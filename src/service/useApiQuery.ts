// useApiQuery.ts
import { useQuery, useMutation } from '@tanstack/vue-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryKey,
  QueryFunction,
  MutationFunction
} from '@tanstack/vue-query';
import type { AxiosResponse } from 'axios';
import apiClient, { type ApiResponse } from './apiClient';

type ApiQueryOptions<TData, TError> = Omit<
  UseQueryOptions<ApiResponse<TData>, TError, ApiResponse<TData>, QueryKey>,
  'queryKey' | 'queryFn'
>;

type ApiMutationOptions<TData, TError, TVariables = void> = Omit<
  UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
  'mutationFn'
>;

// Base mutation function
function useApiMutation<TData = void, TError = Error, TVariables = unknown>(
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {},
  useAuth: boolean = true
) {
  const client = useAuth ? apiClient.auth : apiClient.public;

  const mutationFn: MutationFunction<ApiResponse<TData>, TVariables> = async (variables) => {
    const url = typeof endpoint === 'function' ? endpoint(variables) : endpoint;
    let response: AxiosResponse<ApiResponse<TData>>;

    switch (method) {
      case 'POST':
        response = await client.post<ApiResponse<TData>>(url, variables);
        break;
      case 'PUT':
        response = await client.put<ApiResponse<TData>>(url, variables);
        break;
      case 'PATCH':
        response = await client.patch<ApiResponse<TData>>(url, variables);
        break;
      case 'DELETE':
        response = await client.delete<ApiResponse<TData>>(url, { data: variables });
        break;
      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return response.data;
  };

  return useMutation<ApiResponse<TData>, TError, TVariables>({
    mutationFn,
    ...options
  });
}

// For public GET requests (no auth)
export function usePublicApiQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  endpoint: string,
  options: ApiQueryOptions<TData, TError> = {}
) {
  const queryFn: QueryFunction<ApiResponse<TData>, QueryKey> = async () => {
    const response = await apiClient.public.get<ApiResponse<TData>>(endpoint);
    return response.data;
  };

  return useQuery<ApiResponse<TData>, TError, ApiResponse<TData>, QueryKey>({
    queryKey,
    queryFn,
    ...options,
  });
}

// For authenticated GET requests
export function useAuthApiQuery<TData = unknown, TError = Error>(
  queryKey: QueryKey,
  endpoint: string,
  options: ApiQueryOptions<TData, TError> = {}
) {
  const queryFn: QueryFunction<ApiResponse<TData>, QueryKey> = async () => {
    const response = await apiClient.auth.get<ApiResponse<TData>>(endpoint);
    return response.data;
  };

  return useQuery<ApiResponse<TData>, TError, ApiResponse<TData>, QueryKey>({
    queryKey,
    queryFn,
    ...options,
  });
}

// Public mutations
export const usePublicPost = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('POST', endpoint, options, false);

export const usePublicPut = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('PUT', endpoint, options, false);

// Authenticated mutations
export const useAuthPost = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('POST', endpoint, options, true);

export const useAuthPut = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('PUT', endpoint, options, true);

export const useAuthPatch = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: ApiMutationOptions<TData, TError, TVariables> = {}
) => useApiMutation<TData, TError, TVariables>('PATCH', endpoint, options, true);

export const useAuthDelete = <TData = void, TError = Error, TVariables = unknown>(
  endpoint: string | ((variables: TVariables) => string),
  options: Omit<ApiMutationOptions<TData, TError, TVariables>, 'data'> = {}
) => useApiMutation<TData, TError, TVariables>('DELETE', endpoint, options, true);