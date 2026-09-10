/* Service worker — offline cache-first.
   Sube el número de versión cuando cambies archivos para forzar actualización. */
const CACHE = 'entrenador-aperturas-v2';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './firebase-config.js',
  './firebase-sync.js',
  './vendor/chess.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // No intervenir peticiones a otros orígenes (Firebase Auth/Firestore, Google, CDN de respaldo):
  // deja que el navegador las maneje directo, para no interferir con login ni con la sincronización.
  if (new URL(req.url).origin !== self.location.origin) return;
  // Navegaciones: intenta red, cae a index.html cacheado (app de una sola página).
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Recursos: cache-first, y guarda en caché lo que baje de la red.
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
    })
  );
});
