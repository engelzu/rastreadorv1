const CACHE_NAME = 'rastreador-v2';
const urlsToCache = [
  'rastreadorv1.html',
  'index.html',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache aberto');
        return cache.addAll(urlsToCache).catch(err => {
          console.log('[SW] Erro ao cachear alguns recursos:', err);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('[SW] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('[SW] Servindo do cache:', event.request.url);
          return response;
        }
        
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200 || response.type === 'error' || event.request.method !== 'GET') {
            return response;
          }

          const responseToCache = response.clone();

          if (!event.request.url.includes('/rest/v1/') && !event.request.url.includes('supabase.co')) {
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        }).catch(err => {
          console.log('[SW] Erro ao buscar:', event.request.url, err);
        });
      })
  );
});

console.log('[SW] Service Worker carregado');
