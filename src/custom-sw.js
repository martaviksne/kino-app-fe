var dataCacheName = 'kinoData-v1';
var applicationServerPublicKey = 'BL39yyiLpdRhxzvpZYUs7y3XvG887wS2PFjXuw1Q1xOuDcywDWzN3RRYWHr6oeNpqotL9zIVjczC2W3ZcnOScgo';


self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  if (e.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, falling back to the network" offline strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
     */
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      // TODO: Send to application server
      console.log('[Service Worker] New subscription: ', newSubscription);
    })
  );
});

self.addEventListener('push', function(event) {
  console.log('Received push');
  const notificationOptions = {
    icon: './icons/icon-144.png',
    badge: './icons/icon-144.png',
    data: {
      url: 'https://kino.linnuu.com',
    },
  };

  let notificationTitle = '';

  if (event.data) {
    const dataText = JSON.parse(event.data.text());
    notificationTitle = dataText.header;
    notificationOptions.body = dataText.text;
  }

  event.waitUntil(self.registration.showNotification(
        notificationTitle, notificationOptions)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  let clickResponsePromise = Promise.resolve();
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data.url);
  }

  event.waitUntil(
    Promise.all([
      clickResponsePromise
    ])
  );
});
