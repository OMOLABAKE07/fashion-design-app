// Service Worker for Fashion Design App
// Handles caching and offline functionality

const CACHE_NAME = 'fashion-design-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/main.css',
  '/assets/base.css',
  '/assets/main.js',
  '/assets/logo.svg',
  '/assets/fonts/your-font.woff2'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ⛔ Skip Chrome extension requests (fixes the TypeError)
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // ⛔ Skip Vite/WebSocket/HMR requests (prevents dev errors)
  if (
    event.request.url.includes('ws://') ||
    url.pathname.includes('@vite') ||
    url.pathname.includes('hot')
  ) {
    return;
  }

  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache).catch(err => {
                console.warn("Cache put failed:", err);
              });
            });

            return response;
          })
          .catch(() => {
            return new Response(
              '<html><body><h1>You are offline</h1><p>The Fashion Design App is currently offline. Please check your connection and try again.</p></body></html>',
              {
                headers: { 'Content-Type': 'text/html' }
              }
            );
          });
      })
  );
});

// Handle messages from the app
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
