import './assets/main.css'

import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'
import ui from '@nuxt/ui/vue-plugin'

const app = createApp(App)

app
  .use(VueQueryPlugin)

  .use(router)
  .use(ui)

  .mount('#app')
