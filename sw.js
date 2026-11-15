// Offline support for the IBM webMethods BPMS Academy.
// Network first: online visitors always get the latest version; the cache is the fallback when offline.
const CACHE = "wm-academy-v1.3.0";
const CORE = [
  "./", "index.html", "read.html", "manifest.webmanifest",
  "css/styles.css", "css/read.css",
  "js/content.js", "js/knowledge.js", "js/howto.js", "js/lab.js", "js/support.js",
  "js/explainer.js", "js/explainer-app.js", "js/basics.js", "js/app.js", "js/decision-lab.js", "js/read.js", "js/mobile.js", "js/diagrams.js", "js/fun.js", "js/path.js", "js/words.js",
  "assets/diagrams/process-vs-rules.svg", "assets/diagrams/rule-task-hot-deploy.svg",
  "assets/icons/icon-192.png", "assets/icons/icon-512.png", "assets/icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("index.html")))
  );
});
