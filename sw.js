var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  'index.html',
  'css/bootstrap.min.css',
  'css/style.css',
  'js/manifest.js',
  'js/bootstrap.min.js',
  'js/popper.min.js',
  'js/app.js',
  /*'js/tracking-min.js',
  'js/face-min.js',*/
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function activator(event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys
        .filter(function (key) {
          console.log("oi")
          return key.indexOf(CACHE_NAME) !== 0;
        })
        .map(function (key) {
          console.log("oi2")
          return caches.delete(key);
        })
      );
    })
  );
});

addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;     // if valid response is found in cache return it
        } else {
          return fetch(event.request)     //fetch from internet
            .then(function(res) {
              return caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());    //save the response for future
                  return res;   // return the fetched data
                })
            })
            .catch(function(err) {       // fallback mechanism
              return caches.open(CACHE_NAME)
                .then(function(cache) {
                  return cache.match('https://igormarti.github.io/pwa_facial_recognition/');
                });
            });
        }
      })
  );
}); 