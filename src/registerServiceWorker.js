/* eslint-disable no-console */
import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  const baseURL = process.env.BASE_URL || '/'


  register(`${baseURL}service-worker.js`, {
    ready() {
      console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Service worker has been registered.')
    },
    cached() {
      console.log('Content has been cached for offline use.')
    },
    updatefound() {
      console.log('New content is downloading.')
    },
    updated() {
      console.log('New content is available; please refresh.')
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Error during service worker registration:', error)
    },
  })
} else {
  // In development mode, still register the service worker for offline testing
  register('/service-worker.js', {
    ready() {
      console.log(
        'Development: App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB'
      )
    },
    registered() {
      console.log('Development: Service worker has been registered.')
    },
    cached() {
      console.log('Development: Content has been cached for offline use.')
    },
    updatefound() {
      console.log('Development: New content is downloading.')
    },
    updated() {
      console.log('Development: New content is available; please refresh.')
    },
    offline() {
      console.log('Development: No internet connection found. App is running in offline mode.')
    },
    error(error) {
      console.error('Development: Error during service worker registration:', error)
    },
  })
}