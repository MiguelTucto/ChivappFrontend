import { addCollection, _api as iconifyApi } from "@iconify/react";
import { ICON_COLLECTIONS } from "@/lib/icon-data.generated";

/**
 * Registra localmente los íconos usados por <Icon icon="prefix:name" /> en
 * vez de depender del fetch en vivo a api.iconify.design: en este proyecto
 * (Next 16 + Turbopack, dev) ese fetch nunca se dispara desde el componente
 * y los íconos quedan en blanco. `ICON_COLLECTIONS` se genera con
 * `npm run icons:generate` (scripts/generate-icons.mjs) a partir de los usos
 * reales de <Icon> en el código.
 */
export function setupIcons(): void {
    for (const collection of ICON_COLLECTIONS) {
        addCollection(collection);
    }
    // Fallback defensivo por si algún ícono nuevo aún no está en el bundle
    // offline (hasta correr `npm run icons:generate` de nuevo).
    if (typeof window !== "undefined" && typeof window.fetch === "function") {
        iconifyApi.setFetch(window.fetch.bind(window));
    }
}
