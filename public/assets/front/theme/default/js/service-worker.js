const DEBUG = false;
const THEME = 'default';
const CACHE = 'app-front-cache-v1';
const BASEURL = `/public/assets/front/theme/${THEME}`;
const EXT = DEBUG == true ? '.' : '.min.';
const ASSETS = [
  `${BASEURL}/js/main${EXT}js`,
  `${BASEURL}/css/style${EXT}css`,
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
