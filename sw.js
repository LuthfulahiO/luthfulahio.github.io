let cache = "converter_currency";
let version = "1.1.0";
let cacheName = `${cache}_${version}`;
let filesToCache = [
    "/currencyconverter/",
    "/currencyconverter/index.html",
    "./manifest.json",
    "./img/icon-192.png",
    "./img/icon-152.png",
    "./css/bootstrap.css",
    "./js/app.js",
    "./js/idb.js",
    "https://free.currencyconverterapi.com/api/v5/currencies"
];



self.addEventListener("install", event => {
    console.log("[Service Worker] installing ");

    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("[Service Worker] caching all files");
            cache.addAll(filesToCache);
        }).then(() => self.skipWaiting()).catch(err => console.log("error occured in caching files ==> ", err))
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request)
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keyList => {
            Promise.all(
                keyList.map(key => {
                    if (key !== cacheName) {
                        caches.delete(key);
                        console.log(`deleted ${key}`)
                    }
                })
            );
        })
    );
});