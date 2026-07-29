const CACHE_NAME = "incuba-electro-trace-v1";

const ARCHIVOS = [
"./",
"./index.html",
"./estilos.css",
"./app.js",
"./manifest.json"
];

self.addEventListener("install", function(event) {

```
event.waitUntil(

    caches.open(CACHE_NAME)

        .then(function(cache) {

            return cache.addAll(ARCHIVOS);

        })

);
```

});

self.addEventListener("activate", function(event) {

```
event.waitUntil(

    caches.keys().then(function(nombres) {

        return Promise.all(

            nombres

                .filter(function(nombre) {

                    return nombre !== CACHE_NAME;

                })

                .map(function(nombre) {

                    return caches.delete(nombre);

                })

        );

    })

);
```

});

self.addEventListener("fetch", function(event) {

```
event.respondWith(

    caches.match(event.request)

        .then(function(respuesta) {

            return respuesta || fetch(event.request);

        })

);
```

});
