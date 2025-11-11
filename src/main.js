import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './assets/main.css'
import './registerServiceWorker'

// Initialize the app
const app = createApp(App)

// Add global error handling
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
}

app.use(createPinia())
app.use(router)

// Mount the app
app.mount('#app')

// Log that the app has started
console.log('Fashion Design App started successfully')