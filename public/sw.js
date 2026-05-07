const CACHE_NAME = 'matsyalink-pwa-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/sw.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

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
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Always try network first for HTML and our root to prevent stale bundle errors
  if (event.request.mode === 'navigate' || 
      event.request.url.includes('index.html') || 
      event.request.url === self.location.origin + '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
           // Success! Update the cache
           const responseToCache = response.clone();
           caches.open(CACHE_NAME).then(cache => {
             cache.put(event.request, responseToCache);
           });
           return response;
        })
        .catch(() => {
           // Fail, serve from cache
           return caches.match(event.request);
        })
    );
    return;
  }

  // Otherwise, default to Cache-First for assets like logos, etc.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(error => {
          console.error('Service Worker Fetch Failed:', error);
          // Return nothing or a fallback here
          throw error;
        });
      })
  );
});
