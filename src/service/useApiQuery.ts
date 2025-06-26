import { useQuery, useMutation } from '@tanstack/vue-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryKey
} from '@tanstack/vue-query';
import apiClient from './apiClient';

// Generic type for our API response
export type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: number;
};

type ApiQueryOptions<TData, TError> = Omit<
  UseQueryOptions<ApiResponse<TData>, TError>,
  'queryKey' | 'queryFn'
>;

type ApiMutationOptions<TData, TError, TVariables = void> = Omit<
  UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
  'mutationFn'
>;

// For GET requests
export function useApiQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  endpoint: string,
  options: ApiQueryOptions<TData, TError> = {}
) {
  return useQuery<ApiResponse<TData>, TError>({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<TData>>(endpoint);
      return data;
    },
    ...options,
  });
}

// For mutations (POST, PUT, PATCH, DELETE)
export function useApiMutation<TData = void, TError = Error, TVariables = unknown>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) {
  return useMutation<ApiResponse<TData>, TError, TVariables>({
    mutationFn: async (variables) => {
      const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint;

      switch (method) {
        case 'POST':
          return (await apiClient.post<ApiResponse<TData>>(url, variables)).data;
        case 'PUT':
          return (await apiClient.put<ApiResponse<TData>>(url, variables)).data;
        case 'PATCH':
          return (await apiClient.patch<ApiResponse<TData>>(url, variables)).data;
        case 'DELETE':
          return (await apiClient.delete<ApiResponse<TData>>(url, { data: variables })).data;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
    },
    ...options,
  });
}

// Helper functions for common mutation types
export const useApiPost = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('POST', endpoint, options);

export const useApiPut = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('PUT', endpoint, options);

export const useApiPatch = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('PATCH', endpoint, options);

export const useApiDelete = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('DELETE', endpoint, options);