var cacheName = 'currency-converter';
var filesToCache = [
    '/',
    '../index.html',
    '../css/bootstrap.css'
];

self.addEventListener('install', function (e) {
    e.waitUntill(
        caches.open(cacheName).then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntill(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, {
            ignoreSearch: true
        })
        .then(response => {
            return response || fetch(event.request);
        })
    );
});