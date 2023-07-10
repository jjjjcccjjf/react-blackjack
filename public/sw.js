// service-worker.js

const CACHE_NAME = 'image-cache';

self.addEventListener('fetch', event => {
  const { request } = event;

  // Check if the request is for an image
  if (request.destination === 'image') {
    event.respondWith(cachedImageResponse(request));
  }
});

async function cachedImageResponse(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request.url);

  if (cachedResponse) {
    // Image is found in cache, return it
    console.log(`Cached response found for ${request.url}`);
    return cachedResponse;
  }

  // Image is not in cache, fetch it from the network and cache it
  const response = await fetch(request);
  console.log(`Caching response for ${request.url}`);
  await cache.put(request.url, response.clone());

  return response;
}