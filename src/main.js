import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './assets/main.css'
import './registerServiceWorker'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import icons you want to use
import { faUser, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faUser, faEdit, faTrash, faPlus)

// Initialize the app
const app = createApp(App)

// Add global error handling
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err, info)
}

app.use(createPinia())
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
// Mount the app
app.mount('#app')
