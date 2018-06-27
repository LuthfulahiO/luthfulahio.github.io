// var cacheName = 'currency-converter';
// var filesToCache = [
//     '/',
//     '../index.html',
//     '../css/bootstrap.css'
// ];

// self.addEventListener('install', function (e) {
//     e.waitUntill(
//         caches.open(cacheName).then(function (cache) {
//             return cache.addAll(filesToCache);
//         })
//     );
// });

// self.addEventListener('activate', event => {
//     event.waitUntill(self.clients.claim());
// });

// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.match(event.request, {
//             ignoreSearch: true
//         })
//         .then(response => {
//             return response || fetch(event.request);
//         })
//     );
// });
let appName = 'currency-converter';
let version = 'v1';
let cacheName = appName + version;

self.addEventListener('fetch', function (event) {
    console.log('fetch request : ' + event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + event.request.url);
                return request;
            } else {
                console.log('file is not cached, fetching : ' + event.request.url);
                return fetch(event.request);
            }
        })
    )
})

// Cache resources
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('installing cache : ' + cacheName);
            return cache.addAll([
                '/',
                '../index.html',
                '../css/bootstrap.css',
                '../img/icon.png'
            ]);
        })
    );
});

// Delete outdated caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keyList) {
            var cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf(appName);
            });
            // add current cache name to white list
            cacheWhitelist.push(cacheName);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }))
        })
    );
});