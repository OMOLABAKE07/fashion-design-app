// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/pages/Dashboard.vue'
import Customers from '@/pages/Customers.vue'
import Measurements from '@/pages/Measurements.vue'
import Messages from '@/pages/Messages.vue'
import Designs from '@/pages/Designs.vue'
import Settings from '@/pages/Settings.vue'

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/customers', name: 'Customers', component: Customers },
  { path: '/measurements', name: 'Measurements', component: Measurements },
  { path: '/messages', name: 'Messages', component: Messages },
  { path: '/designs', name: 'Designs', component: Designs },
  { path: '/settings', name: 'Settings', component: Settings },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router