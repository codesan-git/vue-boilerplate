# Components and Hooks Documentation

## Table of Contents

1. [Loading Component](#loading-component)
   - [Basic Usage](#basic-usage)
   - [Props](#props)
   - [Spinner Examples](#spinner-examples)
   - [Skeleton Examples](#skeleton-examples)
2. [API Client Hooks](#api-client-hooks)
   - [Basic Usage](#basic-usage-1)
   - [Error Handling](#error-handling)
   - [Example with Loading State](#example-with-loading-state)

---

## Loading Component

A reusable loading component that supports both spinner and skeleton loading types.

### Basic Usage

1. Import the component:

```vue
import Loading from '@/components/Loading.vue';
```

2. Use it in your template:

```vue
<template>
  <div>
    <Loading v-if="isLoading" type="spinner" />
    <div v-else>
      <!-- Your content here -->
    </div>
  </div>
</template>
```

### Props

| Prop             | Type    | Default      | Description                                        |
| ---------------- | ------- | ------------ | -------------------------------------------------- |
| `type`           | String  | `'spinner'`  | Type of loading: `'spinner'` or `'skeleton'`       |
| `fullPage`       | Boolean | `true`       | If true, covers the entire viewport (spinner only) |
| `message`        | String  | 'Loading...' | Custom loading message (spinner only)              |
| `lines`          | Number  | 3            | Number of skeleton lines to display                |
| `lineHeight`     | Number  | 12           | Height of each skeleton line in pixels             |
| `lineGap`        | Number  | 8            | Gap between skeleton lines in pixels               |
| `lastLineWidth`  | String  | '60%'        | Width of the last skeleton line                    |
| `fullWidth`      | Boolean | true         | If true, skeleton takes full width                 |
| `customSkeleton` | Boolean | false        | Use custom skeleton content via slot               |

### Spinner Examples

**1. Full-page spinner with custom message**

```vue
<Loading v-if="isLoading" type="spinner" message="Menyiapkan data..." />
```

**2. Inline spinner**

```vue
<button @click="fetchData">
  <span v-if="!isLoading">Load Data</span>
  <Loading v-else type="spinner" :full-page="false" message="" />
</button>
```

### Skeleton Examples

**1. Basic skeleton loader**

```vue
<Loading
  v-if="isLoading"
  type="skeleton"
  :lines="4"
  :lineHeight="16"
  :lineGap="12"
  lastLineWidth="70%"
/>
```

**2. Custom skeleton content**

```vue
<template>
  <Loading v-if="isLoading" type="skeleton" :customSkeleton="true">
    <template #custom-skeleton>
      <div class="custom-skeleton">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </template>
  </Loading>
  <div v-else>
    <!-- Your content -->
  </div>
</template>

<style scoped>
.custom-skeleton {
  width: 100%;
  padding: 1rem;
}

.skeleton-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #f0f0f0;
  margin-bottom: 1rem;
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-line {
  height: 12px;
  background: #f0f0f0;
  margin-bottom: 8px;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-line.short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
```

**3. Card skeleton**

```vue
<template>
  <div class="card">
    <Loading v-if="loading" type="skeleton" :customSkeleton="true">
      <template #custom-skeleton>
        <div class="card-skeleton">
          <div class="skeleton-image"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
      </template>
    </Loading>
    <div v-else class="card-content">
      <!-- Your card content -->
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.card-skeleton {
  padding: 1rem;
}

.skeleton-image {
  width: 100%;
  height: 160px;
  background: #f5f5f5;
  margin-bottom: 1rem;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-content {
  padding: 0 0.5rem;
}

.skeleton-title {
  height: 20px;
  width: 70%;
  margin-bottom: 12px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-text {
  height: 12px;
  margin-bottom: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
}

.skeleton-text.short {
  width: 60%;
}
</style>
```

### Customization

You can customize the appearance using CSS variables:

```css
:root {
  /* Spinner */
  --spinner-color: #3498db;
  --spinner-bg: rgba(255, 255, 255, 0.8);
  --spinner-text-color: #2c3e50;

  /* Skeleton */
  --skeleton-color: #f0f0f0;
  --skeleton-highlight: #e0e0e0;
  --skeleton-border-radius: 4px;
}
```

---

## API Client Hooks

### Basic Usage

1. Import the API client:

```typescript
import { authApi, publicApi } from "@/service/apiClient";
```

2. Make API requests:

```typescript
// GET request
const fetchData = async () => {
  try {
    const response = await authApi.get("/endpoint");
    console.log(response.data);
  } catch (error) {
    console.error("Error:", error);
  }
};

// POST request
const postData = async (data) => {
  try {
    const response = await authApi.post("/endpoint", data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
```

### Error Handling

The API client automatically handles:

- **401 Unauthorized**: Redirects to `/401` page
- **Other errors**: Returns the error to be handled in the catch block

### Example with Loading State

```vue
<template>
  <div>
    <Loading v-if="isLoading" :message="loadingMessage" />

    <div v-else>
      <button @click="fetchUserData">Load User Data</button>
      <div v-if="userData">
        {{ userData }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { authApi } from "@/service/apiClient";
import Loading from "@/components/Loading.vue";

const isLoading = ref(false);
const loadingMessage = ref("Loading...");
const userData = ref(null);

const fetchUserData = async () => {
  try {
    isLoading.value = true;
    loadingMessage.value = "Mengambil data pengguna...";

    const response = await authApi.get("/api/user");
    userData.value = response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>
```

### Best Practices

1. Always wrap API calls in try/catch blocks
2. Use loading states to improve UX
3. Handle different error cases appropriately
4. Clean up loading states in finally blocks
5. Use the `authApi` for authenticated endpoints and `publicApi` for public endpoints

---

## Common Issues

### Loading component not showing?

- Make sure `isLoading` is properly set to `true`
- Check for any CSS conflicts that might be hiding the component
- Verify the component is imported and registered correctly

### API errors not redirecting?

- Ensure the error response status is being set correctly from the server
- Check that the router is properly configured with the error routes
- Verify that the interceptor is set up correctly in `apiClient.ts`
