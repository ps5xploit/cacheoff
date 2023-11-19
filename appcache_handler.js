function get_appcache_state() {
    var appCache = window.applicationCache;

    switch (appCache.status) {
        case appCache.UNCACHED: // UNCACHED == 0
            return 'UNCACHED';
            break;
        case appCache.IDLE: // IDLE == 1
            return 'IDLE';
            break;
        case appCache.CHECKING: // CHECKING == 2
            return 'CHECKING';
            break;
        case appCache.DOWNLOADING: // DOWNLOADING == 3
            return 'DOWNLOADING';
            break;
        case appCache.UPDATEREADY:  // UPDATEREADY == 4
            return 'UPDATEREADY';
            break;
        case appCache.OBSOLETE: // OBSOLETE == 5
            return 'OBSOLETE';
            break;
        default:
            return 'UKNOWN CACHE STATUS';
            break;
    };
}

function add_cache_event_toasts() {
    var appCache = window.applicationCache;

    if (!navigator.onLine) {
        showToast('Off-line');
    }

    appCache.addEventListener('cached', function (e) {
        showToast('Finished caching site');
    }, false);

    appCache.addEventListener('downloading', function (e) {
        // Obtener el valor actual del contador de éxito
        let successCount = parseInt(localStorage.getItem("successCount")) || parseInt(localStorage.passcount) || 0;

        // Guardar el valor actual del contador en el almacenamiento local
        localStorage.setItem("successCount", successCount);
    }, false);

    appCache.addEventListener('error', function (e) {
        // Solo mostrar el mensaje de error si estamos en línea
        if (navigator.onLine) {
            showToast('Error while caching site.', 5000);
        }
    }, false);

    appCache.addEventListener('noupdate', function (e) {
        // Obtener el valor actual del contador de éxito
        let successCount = parseInt(localStorage.getItem("successCount")) || parseInt(localStorage.passcount) || 0;

        // Guardar el valor actual del contador en el almacenamiento local
        localStorage.setItem("successCount", successCount);
    }, false);

    appCache.addEventListener('obsolete', function (e) {
        showToast('Site is obsolete');
    }, false);

    appCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            showToast('Site is updated. Refresh browser', 8000);
        }
    }, false);
}
