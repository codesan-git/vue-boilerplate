<template>
  <div class="unauthorized-container">
    <div class="error-content">
      <h1 class="error-code">401</h1>
      <h2 class="error-message">Unauthorized</h2>
      <p class="error-description">
        You don't have permission to access this page.
      </p>
      <router-link to="/" class="home-button"> Return to Home </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Unauthorized",
});
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  text-align: center;
  padding: 20px;
}

.error-content {
  max-width: 500px;
  margin: 0 auto;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: #e74c3c;
  margin: 0;
  line-height: 1;
}

.error-message {
  font-size: 2rem;
  margin: 1rem 0;
  color: #2c3e50;
}

.error-description {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.home-button {
  display: inline-block;
  padding: 12px 30px;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.home-button:hover {
  background-color: #2980b9;
}
</style>
