import { servicePages, sectorPages, type SeoPage } from "@/lib/seo";
import { englishSeoPages } from "./en/seoPages";
import { localizedRoutes } from "./routes";

export type LocalizedSeoPage = SeoPage & { locale: "en"; spanishPath: string; englishPath: string };

function localize(page: SeoPage, category: "services" | "sectors"): LocalizedSeoPage {
  const translated = englishSeoPages[page.slug as keyof typeof englishSeoPages];
  if (!translated) throw new Error(`Missing English SEO page: ${page.slug}`);
  const routeMap: Record<string, { es: string; en: string }> = localizedRoutes[category];
  const route = routeMap[page.slug];
  return { ...page, ...translated, locale: "en", spanishPath: route.es, englishPath: route.en, path: route.en } as LocalizedSeoPage;
}

export const englishServicePages = servicePages.map((page) => localize(page, "services"));
export const englishSectorPages = sectorPages.map((page) => localize(page, "sectors"));

export function findEnglishSeoPage(category: "servicio" | "sector", slug: string) {
  const pages = category === "servicio" ? englishServicePages : englishSectorPages;
  return pages.find((page) => page.englishPath.replace(/^\/en\/(?:services|sectors)\//, "").replace(/\/$/, "") === slug);
}
