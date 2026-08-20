// notificaciones.ts
// Módulo reutilizable para mostrar notificaciones (toasts) de éxito, error o info
// tanto desde componentes React (.tsx) como desde scripts de Astro (.astro).

export type TipoNotificacion = "success" | "error" | "info";

let estilosInyectados = false;

function inyectarEstilos() {
    if (estilosInyectados) return;
    estilosInyectados = true;

    const style = document.createElement("style");
    style.textContent = `
        #contenedor-notificaciones {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
            max-width: 340px;
        }
        .notificacion {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 14px 16px;
            border-radius: 8px;
            background-color: #1c1c1c;
            border-left: 4px solid #666;
            box-shadow: 0 8px 24px rgba(0,0,0,0.45);
            color: #fff;
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
            line-height: 1.4;
            pointer-events: auto;
            transform: translateX(120%);
            opacity: 0;
            transition: transform 0.25s ease, opacity 0.25s ease;
        }
        .notificacion.mostrar {
            transform: translateX(0);
            opacity: 1;
        }
        .notificacion.exito { border-left-color: #2ecc71; }
        .notificacion.error { border-left-color: #e50914; }
        .notificacion.info { border-left-color: #3498db; }
        .notificacion .notif-icono {
            font-size: 15px;
            line-height: 1.4;
            flex-shrink: 0;
        }
        .notificacion.exito .notif-icono { color: #2ecc71; }
        .notificacion.error .notif-icono { color: #e50914; }
        .notificacion.info .notif-icono { color: #3498db; }
        .notificacion .notif-texto { flex: 1; word-break: break-word; }
        .notificacion .notif-cerrar {
            background: none;
            border: none;
            color: #999;
            cursor: pointer;
            font-size: 13px;
            padding: 0;
            line-height: 1.4;
            flex-shrink: 0;
        }
        .notificacion .notif-cerrar:hover { color: #fff; }
    `;
    document.head.appendChild(style);
}

function obtenerContenedor(): HTMLElement {
    let contenedor = document.getElementById("contenedor-notificaciones");
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "contenedor-notificaciones";
        document.body.appendChild(contenedor);
    }
    return contenedor;
}

const ICONOS: Record<TipoNotificacion, string> = {
    success: "✓",
    error: "✕",
    info: "ℹ",
};

/**
 * Muestra una notificación tipo toast en la esquina superior derecha.
 * @param mensaje Texto a mostrar
 * @param tipo "success" | "error" | "info"
 * @param duracionMs Tiempo antes de auto-cerrarse (ms)
 */
export function mostrarNotificacion(
    mensaje: string,
    tipo: TipoNotificacion = "info",
    duracionMs: number = 4000
) {
    if (typeof document === "undefined") return;

    inyectarEstilos();
    const contenedor = obtenerContenedor();

    const toast = document.createElement("div");
    toast.classList.add("notificacion", tipo === "success" ? "exito" : tipo);

    const icono = document.createElement("span");
    icono.classList.add("notif-icono");
    icono.textContent = ICONOS[tipo];

    const texto = document.createElement("span");
    texto.classList.add("notif-texto");
    texto.textContent = mensaje;

    const btnCerrar = document.createElement("button");
    btnCerrar.classList.add("notif-cerrar");
    btnCerrar.textContent = "✕";
    btnCerrar.setAttribute("aria-label", "Cerrar notificación");

    toast.appendChild(icono);
    toast.appendChild(texto);
    toast.appendChild(btnCerrar);
    contenedor.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("mostrar"));

    let eliminado = false;
    const eliminar = () => {
        if (eliminado) return;
        eliminado = true;
        toast.classList.remove("mostrar");
        setTimeout(() => toast.remove(), 250);
    };

    btnCerrar.addEventListener("click", eliminar);
    setTimeout(eliminar, duracionMs);
}