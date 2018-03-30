// 何もしない、PWAのために置いているだけ

// service-worker.js
self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
});

self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
});

// 現状では、この処理を書かないとService Workerが有効と判定されないようです
// DevToolで［Add to homescreen］を試すと「Site cannot be installed: the page does not work offline」と表示されます
self.addEventListener('fetch', function (event) {
  console.log('[ServiceWorker] Fetch');
});
