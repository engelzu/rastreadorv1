const CACHE_NAME = 'rastreador-v1';
const urlsToCache = [
  'rastreadorv1.html',
  'indexORIGINAL.html', // O painel também pode se beneficiar de cache
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Nota: A API Periodic Background Sync (sincronização periódica em segundo plano)
// seria o ideal para garantir o rastreamento, mas requer que o usuário
// adicione o PWA à tela inicial e tem restrições de uso.
// A implementação completa é mais complexa e depende de permissões.
// Este Service Worker básico foca no cache para tornar o app instalável.
// Para o rastreamento, o código em rastreadorv1.html (Wake Lock e setInterval)
// é a melhor solução possível sem APIs de background sync.

