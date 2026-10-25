const CACHE_NAME = 'bomjara-cache-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './package.json'
];

// Установка (сохраняем файлы в кэш)
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Активация (удаляем старый кэш, если обновили версию)
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Перехват запросов (работаем из кэша, если нет интернета)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});