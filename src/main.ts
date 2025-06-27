import './assets/main.css'

import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'
import ui from '@nuxt/ui/vue-plugin'
import { resources as messages } from './locales'

// Create i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  availableLocales: ['en', 'ar', 'id'],
  messages: messages,
  globalInjection: true,
  silentTranslationWarn: true
})

const app = createApp(App)

app
  .use(i18n)
  .use(VueQueryPlugin)
  .use(router)
  .use(ui)
  .mount('#app')
