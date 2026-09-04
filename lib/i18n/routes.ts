import type { Locale } from "./index";

export const localizedRoutes = {
  home: { es: "/", en: "/en/" },
  services: {
    "configuradores-3d": { es: "/servicios/configuradores-3d/", en: "/en/services/3d-configurators/" },
    "visualizacion-3d": { es: "/servicios/visualizacion-3d/", en: "/en/services/interactive-3d-visualization/" },
    "desarrollo-web": { es: "/servicios/desarrollo-web/", en: "/en/services/web-development/" },
    "realidad-aumentada": { es: "/servicios/realidad-aumentada/", en: "/en/services/augmented-reality/" },
    "realidad-virtual": { es: "/servicios/realidad-virtual/", en: "/en/services/virtual-reality/" },
  },
  sectors: {
    "arquitectura-construccion": { es: "/sectores/arquitectura-construccion/", en: "/en/sectors/architecture-construction/" },
    "muebles-equipamiento": { es: "/sectores/muebles-equipamiento/", en: "/en/sectors/furniture-equipment/" },
    "piscinas-exteriores": { es: "/sectores/piscinas-exteriores/", en: "/en/sectors/pools-outdoors/" },
    industria: { es: "/sectores/industria/", en: "/en/sectors/industry/" },
    "real-estate": { es: "/sectores/real-estate/", en: "/en/sectors/real-estate/" },
    "hoteleria-turismo": { es: "/sectores/hoteleria-turismo/", en: "/en/sectors/hospitality-tourism/" },
  },
  projects: {
    terrambu: { es: "/proyectos/terrambu/", en: "/en/projects/terrambu/" },
    "mapa-punilla": { es: "/proyectos/mapa-punilla/", en: "/en/projects/mapa-punilla/" },
    "revestimientos-interactivos": { es: "/proyectos/revestimientos-interactivos/", en: "/en/projects/interactive-finishes/" },
    "exterior-house": { es: "/proyectos/exterior-house/", en: "/en/projects/exterior-house/" },
  },
  privacy: { es: "/privacidad/", en: "/en/privacy/" },
  confirmation: { es: "/solicitud-enviada/", en: "/en/request-sent/" },
} as const;

export function homePath(locale: Locale) { return localizedRoutes.home[locale]; }

export type LocalizedPageRoute = { es: string; en: string };
export function serviceRoute(slug: keyof typeof localizedRoutes.services): LocalizedPageRoute { return localizedRoutes.services[slug]; }
export function sectorRoute(slug: keyof typeof localizedRoutes.sectors): LocalizedPageRoute { return localizedRoutes.sectors[slug]; }
