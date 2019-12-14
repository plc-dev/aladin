importScripts("/precache-manifest.20899c89d918ed8d26200c80f48a7e2a.js", "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// install new service worker when ok, then reload page.
self.addEventListener("message", msg => {
  if (msg.data.action == "skipWaiting") {
    self.skipWaiting();
  }
});

// subscribe to push event
self.addEventListener("push", event => {
  const data = event.data.json();
  console.log("Push Received");
  self.registration.showNotification(data.title, {
    body: data.body
  });
});

