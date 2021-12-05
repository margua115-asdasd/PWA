importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js");

if (workbox) {
    console.log("Ajua! Workbox está cargado! :) ");
    workbox.precaching.precacheAndRoute([]);
    
    /*Cache de imagenes en la carpeta por ejemplo "others", editamos a otras carpetas que se obtuvieron y configuraron en el archivo sw.js */
    workbox.routing.registerRoute(
        /(.*)others(.*)\.(?:png|gif|jpg)/,
        new workbox.strategies.CacheFirst({
            cacheName: "images",
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                })
            ]
        })
    );

    /* Hacemos que el contenido js, css, scss sean rapidos devolviendo los "assets de la cache, mientras se asegura de que se actualizan en segundo plano para su proximo uso."*/
    workbox.routing.registerRoute(
        //cache de js; css y scss
        /.*\.(?:css|js|scss|)/,
        //usamos el cache temporal y actualizamos en segundo plano los  nuevos  cambios lo antes posible,
        new workbox.strategies.StaleWhileRevalidate({
            //usamos el nombre de un cache personalizado
            cacheName: "assets",
        })
    );
    
    //cache de fuentes de google
    workbox.routing.registerRoute(
        new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
        new workbox.strategies.CacheFirst({
            cacheName: "google-fonts",
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0,200],
                }),
            ],
        })
    );

    //agregar un analisi offline
    workbox.googleAnalytics.initialize();

    /* instalar un nuevo service worker y hacer que actualice y controle ña pagina we lo antes posible */
        workbox.core.skipWaiting();
        workbox.core.clientsClaim();
} else {
    console.log("¡Fallo! Workbox no está cargado! ):");
}