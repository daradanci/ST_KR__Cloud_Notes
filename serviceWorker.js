
// import {IP4} from "../src/store/pref"

const CACHE = 'network-or-cache-v1';
const timeout = 1000;


// При установке воркера мы должны закешировать часть данных
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll([
                // `http://127.0.0.1:8000/api/token/refresh`,
                // `http://127.0.0.1:8000/api/token/obtain`,
                // `http://127.0.0.1:8000/api/user`,
                // `http://127.0.0.1:8000/notes/1/`,
                // 'http://127.0.0.1:8000/',
                '/',
                '/notes',
                'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
                'https://fonts.googleapis.com/icon?family=Material+Icons',
                '/static/js/bundle.js',
                '/manifest.json',
                'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
                '/static/media/clouds2B.39fa490f03d3c6178d1c.jpg',
                '/static/media/paimon.2044e728fc2c11b534b9.png',
                '/static/media/zh-cn.54a8212866e6ec1b1003.ttf',
            ])
        ));
});

// при событии fetch, мы и делаем запрос, но используем кэш, только после истечения timeout.
self.addEventListener('fetch', function(event) {
  if (event.request.method === "GET") {
    event.respondWith(fromNetwork(event.request, timeout)
      .catch((err) => {
          console.log(`Error: ${err}`);
          return fromCache(event.request);
      }));
      // event.respondWith(
      //     fromNetwork(event.request, timeout)
      //     .catch(()=>{
      //         console.log(caches)
      //         return caches.match(event.request)
      //     })
      // );
  }
});


// Временно-ограниченный запрос.
function fromNetwork(request, timeout) {
    console.log('in network')

    return new Promise((fulfill, reject) => {
        var timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            console.log(response)
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
}


function fromCache(request) {
// Открываем наше хранилище кэша (CacheStorage API), выполняем поиск запрошенного ресурса.
// Обратите внимание, что в случае отсутствия соответствия значения Promise выполнится успешно, но со значением `undefined`
    console.log('in cache')

    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}
