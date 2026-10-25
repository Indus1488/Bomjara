const CACHE_NAME = 'bomjara-cache-v2'; // Поменяли версию на v2
const ASSETS = [
    './',
    './index.html',
    './manifest.json' // Если у тебя нет manifest.json, просто удали эту строчку
];

// Установка (сохраняем файлы в кэш)
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(err => console.log('Ошибка кэширования:', err));
        })
    );
});

// Активация (удаляем старый кэш)
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