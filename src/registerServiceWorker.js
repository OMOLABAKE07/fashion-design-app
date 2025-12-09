/* eslint-disable no-console */
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  const baseURL = process.env.BASE_URL || '/'


  register(`${baseURL}service-worker.js`, {
    ready() {

    },
    registered() {
    },
    cached() {
    },
    updatefound() {
    },
    updated() {
    },
    offline() {
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
} else {
  // In development mode, still register the service worker for offline testing
  register('/service-worker.js', {
    ready() {

    },
    registered() {
    },
    cached() {
    },
    updatefound() {
    },
    updated() {
    },
    offline() {
    },
    error(error) {
      console.error('Development: Error during service worker registration:', error)
    },
  })
}