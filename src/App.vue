<script setup lang="ts"></script>

<template>
  <UApp>
    <div class="flex flex-col items-center justify-center gap-4 h-screen">
      <h1 class="font-bold text-2xl text-(--ui-primary)"></h1>

      <LanguageSwitcher />
      <router-view />

      <div class="p-4 text-primary">
        <h1 class="text-2xl font-bold mb-4">{{ $t("common.welcome") }}</h1>
        <p>{{ $t("common.description") }}</p>
      </div>

      <!-- <UserProfile />

      <div class="flex items-center gap-2">
        <UButton
          label="Documentation"
          icon="i-lucide-square-play"
          to="https://ui.nuxt.com/getting-started/installation/vue"
          target="_blank"
        />

        <UButton
          label="GitHub"
          color="neutral"
          variant="outline"
          icon="i-simple-icons:github"
          to="https://github.com/nuxt/ui"
          target="_blank"
        />
      </div> -->
      <TestTable />
    </div>
  </UApp>
</template>
