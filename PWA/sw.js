// =====================================================================
// SERVICE WORKER — THE SAVAGE REBELS (PWA)
// Gère le cache de l'app shell et le fonctionnement hors-ligne.
// Chemin d'installation : main/PWA/sw.js (scope = main/)
// =====================================================================

// Change ce numéro de version à chaque mise à jour du site pour forcer
// le rafraîchissement du cache chez les visiteurs.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `savage-rebels-cache-${CACHE_VERSION}`;

// Fichiers essentiels ("app shell") mis en cache dès l'installation,
// afin que le site puisse s'ouvrir même sans connexion.
const APP_SHELL = [
  '../index.html',
  '../img/logo.png',
  './manifest.json'
];

// ---------------------------------------------------------------------
// INSTALLATION : on précharge l'app shell dans le cache
// ---------------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()) // active le nouveau SW immédiatement
  );
});

// ---------------------------------------------------------------------
// ACTIVATION : on supprime les anciens caches (versions précédentes)
// ---------------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('savage-rebels-cache-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// ---------------------------------------------------------------------
// FETCH : stratégie de cache adaptée par type de ressource
//
// - Pour l'app shell (HTML/manifest/logo) : "cache d'abord, réseau en secours"
//   -> chargement instantané, fonctionne hors-ligne.
// - Pour les images/photos (jpg, png, webp) : "cache d'abord" aussi,
//   une fois téléchargées elles ne sont plus jamais re-fetchées tant
//   que le cache n'est pas vidé (cohérent avec le lazy-loading du site).
// - Pour la vidéo (vid.mp4) : on laisse passer directement au réseau
//   (les vidéos sont trop lourdes pour être mises en cache correctement
//   et streament mieux directement depuis le serveur).
// - Pour tout le reste (API, ressources externes type Google Fonts) :
//   on tente le réseau, et on retombe sur le cache si hors-ligne.
// ---------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // On ignore les requêtes non-GET (ex: formulaires) : pas de cache dessus
  if (request.method !== 'GET') return;

  // La vidéo de fond ne passe pas par le cache : streaming direct
  if (url.pathname.endsWith('.mp4')) {
    return; // laisse la requête suivre son cours normal
  }

  // Images : cache d'abord, sinon réseau (puis mise en cache du résultat)
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        }).catch(() => cached); // hors-ligne et pas en cache : échec silencieux
      })
    );
    return;
  }

  // App shell et reste des ressources : cache d'abord, réseau en secours
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request).then((response) => {
        // On met en cache uniquement les réponses valides et de même origine
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});

