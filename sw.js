const CACHE_NAME = 'bomjara-cache-v3'; // МЕНЯЙ ПРИ КАЖДОМ ОБНОВЛЕНИИ: v3 → v4 → v5...
const ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// Установка: сразу активируем новый SW, не ждём закрытия вкладок
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(err => console.log('Ошибка кэширования:', err));
        })
    );
});

// Активация: удаляем старый кэш и берём контроль над открытыми вкладками
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

// NETWORK-FIRST: всегда сначала идём в сеть, кэш — только если сети нет
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