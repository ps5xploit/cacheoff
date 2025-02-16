const LOCALSTORE_WK_EXPLOIT_TYPE_KEY = "wk_exploit_type";
const LOCALSTORE_WK_EXPLOIT_TYPE_VALUE_PSFREE = "PSFree";
const LOCALSTORE_WK_EXPLOIT_TYPE_VALUE_FONTFACE = "FontFace";

const SESSIONSTORE_ON_LOAD_AUTORUN_KEY = "on_load_autorun";

const MAINLOOP_EXECUTE_PAYLOAD_REQUEST = "mainloop_execute_payload_request";

let exploitStarted = false;

async function run(wkonly = false, animate = true) {
    if (exploitStarted) {
        return;
    }
    exploitStarted = true;

    await switchPage("console-view", animate);

    sessionStorage.setItem(SESSIONSTORE_ON_LOAD_AUTORUN_KEY, wkonly ? "wkonly" : "kernel");

    let wk_exploit_type = localStorage.getItem(LOCALSTORE_WK_EXPLOIT_TYPE_KEY);
    try {
        if (!animate) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
        if (wk_exploit_type == LOCALSTORE_WK_EXPLOIT_TYPE_VALUE_PSFREE) {
            debug_log("[+] running psfree for userland exploit...");
            await run_psfree(fw_str);
        } else if (wk_exploit_type == LOCALSTORE_WK_EXPLOIT_TYPE_VALUE_FONTFACE) {
            debug_log("[+] running fontface for userland exploit...");
            await run_fontface();
        }
    } catch (error) {
        debug_log("[!] Webkit exploit failed: " + error);

        debug_log("[+] Retrying in 2 seconds...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.reload();
        return;
    }

    try {
        await main(wkonly);
    } catch (error)  {
        debug_log("[!] Kernel exploit/main() failed: " + error);
    }

    debug_log("[+] Retrying in 4 seconds...");
    await new Promise((resolve) => setTimeout(resolve, 4000));
    window.location.reload();
}

async function switchPage(id, animate = true) {
    const parentElement = document.getElementById('main-content');
    const targetElement = document.getElementById(id);
    if (!targetElement || targetElement.parentElement !== parentElement) {
        throw new Error('Invalid target element');
    }

    const oldSelectedElement = parentElement.querySelector('.selected');

    if (oldSelectedElement) {
        if (animate) {
            let oldSelectedElementTransitionEnd = new Promise((resolve) => {
                oldSelectedElement.addEventListener("transitionend", function handler(event) {
                    if (event.target === oldSelectedElement) {
                        oldSelectedElement.removeEventListener("transitionend", handler);
                        resolve();
                    }
                });
            });
            oldSelectedElement.classList.remove('selected');
            await oldSelectedElementTransitionEnd;
        } else {
            oldSelectedElement.style.setProperty('transition', 'none', 'important');
            oldSelectedElement.offsetHeight;
            oldSelectedElement.classList.remove('selected');
            oldSelectedElement.offsetHeight;
            oldSelectedElement.style.removeProperty('transition');
        }
    }

    if (animate) {
        let targetElementTransitionEnd = new Promise((resolve) => {
            targetElement.addEventListener("transitionend", function handler(event) {
                if (event.target === targetElement) {
                    targetElement.removeEventListener("transitionend", handler);
                    resolve();
                }
            });
        });
        targetElement.classList.add('selected');
        await targetElementTransitionEnd;
    } else {
        targetElement.style.setProperty('transition', 'none', 'important');
        targetElement.offsetHeight;
        targetElement.classList.add('selected');
        targetElement.offsetHeight;
        targetElement.style.removeProperty('transition');
    }
}

window.onload = async function() {
    await run();
};

function registerAppCacheEventHandlers() {
    var appCache = window.applicationCache;

    let toast;

    function createOrUpdateAppCacheToast(message, timeout = -1) {
        if (!toast) {
            toast = showToast(message, timeout);
        } else {
            updateToastMessage(toast, message);
        }

        if (timeout > 0) {
            setTimeout(() => {
                removeToast(toast);
                toast = null;
            }, timeout);
        }
    }

    if (document.documentElement.hasAttribute("manifest")) {
        if (!navigator.onLine) {
            createOrUpdateAppCacheToast('★ Off-line wait...', 2000);
        } else {
            createOrUpdateAppCacheToast("★ Check updates...");
        }
    }

    appCache.addEventListener('cached', function (e) {
        createOrUpdateAppCacheToast('★ Finished caching site', 1500);
    }, false);

    appCache.addEventListener('checking', function (e) {
        createOrUpdateAppCacheToast('★ Check updates...');
    }, false);

    appCache.addEventListener('downloading', function (e) {
        createOrUpdateAppCacheToast('★ Downloading cache');
    }, false);

    appCache.addEventListener('error', function (e) {
        if (navigator.onLine) {
            createOrUpdateAppCacheToast('★ Error caching ', 5000);
        } else {
            createOrUpdateAppCacheToast('★ Off-line wait...', 2000);
        }
    }, false);

    appCache.addEventListener('noupdate', function (e) {
        createOrUpdateAppCacheToast('★ Cache is up', 1500);
    }, false);

    appCache.addEventListener('obsolete', function (e) {
        createOrUpdateAppCacheToast('★ Site is obsolete.');
    }, false);

    appCache.addEventListener('progress', function (e) {
    let dots = '.'.repeat(Math.min(Math.floor((e.loaded / e.total) * 3), 3)); // Máximo 3 puntos suspensivos

    createOrUpdateAppCacheToast('★ Downloading cache' + dots);

    if (e.loaded + 1 == e.total) {
        createOrUpdateAppCacheToast("★ Done wait ...");
    }
}, false);

    appCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            createOrUpdateAppCacheToast('★ Site updated. Refresh');
        }
    }, false);
}

const TOAST_SUCCESS_TIMEOUT = 2000;
const TOAST_ERROR_TIMEOUT = 5000;

function showToast(message, timeout = 2000) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    toastContainer.appendChild(toast);

    toast.offsetHeight;

    toast.classList.add('show');

    if (timeout > 0) {
        setTimeout(() => {
            removeToast(toast);
        }, timeout);
    }

    return toast;
}

function updateToastMessage(toast, message) {
    if (!toast) {
        return;
    }
    toast.textContent = message;
}

async function removeToast(toast) {
    if (!toast) {
        return;
    }
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => {
        toast.remove();
    });
}

function populatePayloadsPage(wkOnlyMode = false) {
    const payloadsView = document.getElementById('payloads-view');

    while (payloadsView.firstChild) {
        payloadsView.removeChild(payloadsView.firstChild);
    }

const payloads = payload_map;

for (const payload of payloads) {
    if (wkOnlyMode && !payload.toPort && !payload.customAction) {
        continue;
    }

    if (payload.supportedFirmwares && !payload.supportedFirmwares.some(fwPrefix => window.fw_str.startsWith(fwPrefix))) {
        continue;
    }

    // Comentamos la creación del botón para que no se vea
    /*
    const payloadButton = document.createElement("a");
    payloadButton.classList.add("btn");
    payloadButton.classList.add("w-100");
    payloadButton.tabIndex = 0;

    const payloadTitle = document.createElement("p");
    payloadTitle.classList.add("payload-btn-title");
    payloadTitle.textContent = payload.displayTitle;

    const payloadDescription = document.createElement("p");
    payloadDescription.classList.add("payload-btn-description");
    payloadDescription.textContent = payload.description;

    const payloadInfo = document.createElement("p");
    payloadInfo.classList.add("payload-btn-info");
    payloadInfo.innerHTML = `v${payload.version} &centerdot; ${payload.author}`;

    payloadButton.appendChild(payloadTitle);
    payloadButton.appendChild(payloadDescription);
    payloadButton.appendChild(payloadInfo);
    payloadButton.addEventListener("click", function () {
        window.dispatchEvent(new CustomEvent(MAINLOOP_EXECUTE_PAYLOAD_REQUEST, { detail: payload }));
    });

    payloadsView.appendChild(payloadButton);
    */

    // Crear un nuevo contenedor de mensaje
    const debugMessage = document.createElement("div");
    debugMessage.classList.add("btn"); // Usamos las clases btn para el estilo visual, pero no será clickeable
    debugMessage.style.pointerEvents = "none"; // Deshabilita cualquier interacción
    debugMessage.style.cursor = "default"; // Elimina el cursor de tipo "mano" para no dar la impresión de que es clickeable

    // El contenido del mensaje que queremos mostrar
    debugMessage.innerHTML = "★ Debug Settings Ready ✓<br>Waiting payload";

    payloadsView.appendChild(debugMessage); // Agregar el mensaje al contenedor
}


}
