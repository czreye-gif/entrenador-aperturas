/* Service worker — offline con actualización automática (stale-while-revalidate).
   Sube el número de versión cuando cambies archivos para forzar una actualización limpia. */
const CACHE = 'entrenador-aperturas-v6';
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
  './apple-touch-icon.png',
  './pieces/merida/wK.svg','./pieces/merida/wQ.svg','./pieces/merida/wR.svg','./pieces/merida/wB.svg','./pieces/merida/wN.svg','./pieces/merida/wP.svg',
  './pieces/merida/bK.svg','./pieces/merida/bQ.svg','./pieces/merida/bR.svg','./pieces/merida/bB.svg','./pieces/merida/bN.svg','./pieces/merida/bP.svg',
  './pieces/cburnett/wK.svg','./pieces/cburnett/wQ.svg','./pieces/cburnett/wR.svg','./pieces/cburnett/wB.svg','./pieces/cburnett/wN.svg','./pieces/cburnett/wP.svg',
  './pieces/cburnett/bK.svg','./pieces/cburnett/bQ.svg','./pieces/cburnett/bR.svg','./pieces/cburnett/bB.svg','./pieces/cburnett/bN.svg','./pieces/cburnett/bP.svg'
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
  // Otros orígenes (Firebase Auth/Firestore, Google, CDN de respaldo): sin intervención.
  if (new URL(req.url).origin !== self.location.origin) return;

  // Navegaciones: primero la red (para tomar la versión nueva), con respaldo al caché.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Recursos (js, css, iconos): stale-while-revalidate.
  // Responde rápido desde caché, pero en segundo plano baja la versión nueva
  // y actualiza el caché — así la próxima carga ya trae los cambios sin trucos.
  e.respondWith(
    caches.match(req).then((cached) => {
      const fromNet = fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
      return cached || fromNet;
    })
  );
});
