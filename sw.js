/* Karachi Construction Cost Calculator — service worker */
var VERSION = 'v1';
const SHELL = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png",
  "icon-512.png",
  "apple-touch-icon.png"
];
var SHELL_CACHE = 'kcc-shell-' + VERSION;
var RUNTIME_CACHE = 'kcc-runtime-' + VERSION;

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(SHELL_CACHE).then(function (c) {
    return c.addAll(SHELL).then(function () { return self.skipWaiting(); });
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) {
      return k.indexOf('kcc-') === 0 && k.indexOf(VERSION) === -1;
    }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  // App shell + same-origin assets: cache-first, then network, cache the copy
  if (req.mode === 'navigate' || new URL(req.url).origin === self.location.origin) {
    e.respondWith(caches.match(req).then(function (hit) {
      var fetchAndCache = fetch(req).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(SHELL_CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        return hit || caches.match('index.html');
      });
      return hit || fetchAndCache;
    }));
    return;
  }

  // Cross-origin (Chart.js CDN): network-first, fall back to cached copy
  e.respondWith(fetch(req).then(function (res) {
    if (res && res.ok) {
      var copy = res.clone();
      caches.open(RUNTIME_CACHE).then(function (c) { c.put(req, copy); });
    }
    return res;
  }).catch(function () {
    return caches.match(req);
  }));
});
