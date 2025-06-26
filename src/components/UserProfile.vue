<template>
  <div>
    <!-- Query Example -->
    <div>
      <h2>User Profile</h2>
      <div v-if="isLoading">Loading user data...</div>
      <div v-else-if="isError">Error loading user: {{ error?.message }}</div>
      <div v-else-if="userData">
        <p>Name: {{ userData.name }}</p>
        <p>Email: {{ userData.email }}</p>
        <p>Phone: {{ userData.phone }}</p>
        <p>Website: {{ userData.website }}</p>
      </div>
    </div>

    <!-- Mutation Example -->
    <div class="mt-8">
      <h3>Update Profile</h3>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block mb-1">Name:</label>
          <input
            v-model="formData.name"
            type="text"
            class="border p-2 rounded w-full max-w-md"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Email:</label>
          <input
            v-model="formData.email"
            type="email"
            class="border p-2 rounded w-full max-w-md"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Phone:</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="border p-2 rounded w-full max-w-md"
          />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Website:</label>
          <input
            v-model="formData.website"
            type="url"
            class="border p-2 rounded w-full max-w-md"
          />
        </div>
        <button
          type="submit"
          :disabled="isPending"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {{ isPending ? "Saving..." : "Save Changes" }}
        </button>
        <span v-if="updateError" class="text-red-500 ml-4">
          Error: {{ updateError?.message }}
        </span>
        <div v-if="isSuccess" class="text-green-500 mt-2">
          Profile updated successfully! (Note: JSONPlaceholder doesn't persist
          changes)
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useQuery, useMutation } from "@tanstack/vue-query";
import apiClient from "@/service/apiClient";

// Types
type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
};

type UpdateUserDto = {
  name: string;
  email: string;
  phone: string;
  website: string;
};

// Form state
const formData = ref<UpdateUserDto>({
  name: "",
  email: "",
  phone: "",
  website: "",
});

// Query: Fetch user data
const {
  data: userData,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["user", 1],
  queryFn: async () => {
    const response = await apiClient.get<User>("/users/1");
    return response.data;
  },
  retry: 1,
  refetchOnWindowFocus: false,
});

// Update form when data is loaded
watchEffect(() => {
  if (userData.value) {
    formData.value = {
      name: userData.value.name,
      email: userData.value.email,
      phone: userData.value.phone,
      website: userData.value.website,
    };
  }
});

// Mutation: Update user
const {
  mutate: updateUser,
  isPending,
  error: updateError,
  isSuccess,
} = useMutation({
  mutationFn: async (data: UpdateUserDto) => {
    const response = await apiClient.put<User>(`/users/1`, data);
    return response.data;
  },
  onSuccess: () => {
    // Show success message for 3 seconds
    setTimeout(() => {
      isSuccess.value = false;
    }, 3000);
  },
  onError: (error: Error) => {
    console.error("Update failed:", error);
  },
});

const handleSubmit = () => {
  updateUser(formData.value);
};
</script>
