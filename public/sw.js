self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  clients.claim();
});

self.addEventListener("push", (event) => {
  const data = event.data?.json();
  const title = data?.title || "Nowe zamówienie!";
  const options = {
    body: data?.body || "Klient złożył nowe zamówienie.",
    icon: "/icon-192.png",
    data: {
      url: "/orders",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
