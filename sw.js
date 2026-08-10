// QueueEasy Clinic — Service Worker
// Handles offline app-shell caching and push notification display.
// This is real, deployable service-worker code — it just can't register
// inside Claude's sandboxed artifact preview. Host these files anywhere
// (Vercel, Netlify, GitHub Pages, even `npx serve .`) and it works.

const CACHE_NAME = "queueeasy-clinic";
const APP_SHELL = ["./", "./index.html", "./manifest.json", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Cache-first for the app shell, falling back to network for everything
  // else (e.g. the React/Babel CDN scripts, which browsers cache natively).
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

// Push notifications — this is the real equivalent of the "called" /
// "you're next" alerts the artifact prototype simulated with in-app
// banners. Wiring this up for real requires a backend that calls the
// Web Push API (or FCM) when a ticket's status changes; this handler is
// just the client-side receiving end.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { title: "QueueEasy", body: event.data.text() };
  }

  const options = {
    body: payload.body,
    icon: "./icon.svg",
    badge: "./icon.svg",
    vibrate: [200, 100, 200], // was `vibrate:,` (invalid syntax) in the original doc — fixed here
    data: { url: payload.url || "./index.html" },
  };

  event.waitUntil(self.registration.showNotification(payload.title || "QueueEasy", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url));
});
