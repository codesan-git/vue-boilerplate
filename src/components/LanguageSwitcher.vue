<template>
  <div class="language-switcher">
    <select
      v-model="currentLocale"
      @change="changeLanguage"
      class="p-2 border rounded"
    >
      <option value="en">English</option>
      <option value="id">Bahasa Indonesia</option>
      <option value="ar">العربية</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { Locale } from "../locales";

const { locale } = useI18n();
const currentLocale = ref<Locale>(locale.value as Locale);

const changeLanguage = () => {
  locale.value = currentLocale.value;
  // You can save the selected language to localStorage for persistence
  localStorage.setItem("userLanguage", currentLocale.value);
};

// Load saved language if exists
const savedLanguage = localStorage.getItem("userLanguage");
if (savedLanguage) {
  currentLocale.value = savedLanguage as Locale;
  locale.value = savedLanguage;
}
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 50;
}

select {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background-color: white;
  cursor: pointer;
}
</style>
