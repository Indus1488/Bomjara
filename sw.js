const CACHE_NAME = 'bomjara-cache-v5'; // МЕНЯЙ ПРИ КАЖДОМ ОБНОВЛЕНИИ: v4 → v5 → v6...
const ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(err => console.log('Ошибка кэширования:', err));
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((keys) => {
                return Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) return caches.delete(key);
                    })
                );
            })
        ])
    );
});

// NETWORK-FIRST: всегда сначала сеть, кэш — только офлайн
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
                return response;
            })
            .catch(() => caches.match(e.request))
    );
});