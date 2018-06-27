let cacheName = 'currency-converter';
let filesToCache = [
    '/',
    '../index.html',
    '../css/bootstrap.css',
    '..img/icon.png'
];

self.addEventListener('install', (e) => {
    e.waitUntill(
        caches.open(cacheName).then((cache) => {
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