<template>
  <!-- Spinner Loading -->
  <div
    v-if="type === 'spinner'"
    class="loading-overlay"
    :class="{ 'full-page': fullPage }"
  >
    <div class="loading-spinner">
      <div class="spinner"></div>
      <div v-if="message" class="loading-message">{{ message }}</div>
    </div>
  </div>

  <!-- Skeleton Loading -->
  <div
    v-else-if="type === 'skeleton'"
    class="skeleton-loading"
    :class="{ 'full-width': fullWidth }"
  >
    <div v-if="!customSkeleton" class="default-skeleton">
      <div
        v-for="i in lines"
        :key="i"
        class="skeleton-line"
        :style="{
          width: i === lines && lastLineWidth ? lastLineWidth : '100%',
          height: `${lineHeight}px`,
          marginBottom: i < lines ? `${lineGap}px` : '0',
        }"
      ></div>
    </div>
    <slot v-else name="custom-skeleton"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Loading",
  props: {
    type: {
      type: String,
      default: "spinner", // 'spinner' or 'skeleton'
      validator: (value: string) => ["spinner", "skeleton"].includes(value),
    },
    fullPage: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: "Loading...",
    },
    // Skeleton specific props
    lines: {
      type: Number,
      default: 3,
    },
    lineHeight: {
      type: Number,
      default: 12,
    },
    lineGap: {
      type: Number,
      default: 8,
    },
    lastLineWidth: {
      type: String,
      default: "60%",
    },
    fullWidth: {
      type: Boolean,
      default: true,
    },
    customSkeleton: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped>
/* Common Styles */
.loading-overlay,
.skeleton-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

/* Spinner Styles */
.loading-overlay.full-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
}

.loading-spinner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Skeleton Styles */
.skeleton-loading {
  width: 100%;
  padding: 1rem;
  background: transparent;
}

.skeleton-loading.full-width {
  width: 100%;
}

.default-skeleton {
  width: 100%;
}

.skeleton-line {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Message Styles */
.loading-message {
  color: #2c3e50;
  font-size: 1rem;
  font-weight: 500;
}
</style>
