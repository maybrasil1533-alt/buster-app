const CACHE_NAME = 'buster-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/logo.png'
];

// Instalar service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache error:', err))
  );
  self.skipWaiting();
});

// Ativar service worker
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

// Estratégia: Network first, fallback to cache
self.addEventListener('fetch', event => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Para arquivos estáticos
  if (event.request.url.includes('/assets/') || 
      event.request.url.includes('/icon-') ||
      event.request.url.includes('/logo.png')) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Para requisições de API - Network first
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clonar resposta
        const responseClone = response.clone();
        
        // Atualizar cache
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
        
        return response;
      })
      .catch(() => {
        // Se falhar, tentar cache
        return caches.match(event.request)
          .then(response => response || caches.match('/index.html'));
      })
  );
});

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'sync-services') {
    event.waitUntil(syncServices());
  }
});

async function syncServices() {
  try {
    const data = localStorage.getItem('buster_services');
    if (data) {
      // Aqui você pode enviar dados para o servidor
      console.log('Sincronizando dados...');
    }
  } catch (error) {
    console.error('Erro na sincronização:', error);
  }
}

// Notificações push
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Nova notificação BUSTER',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'buster-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'BUSTER', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then(clientList => {
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
