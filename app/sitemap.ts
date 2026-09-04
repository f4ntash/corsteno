import type { MetadataRoute } from "next";
import { canonicalUrl, homeSeo } from "@/lib/seo";
import { localizedRoutes } from "@/lib/i18n/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-26");
  const paired = (category: "services" | "sectors" | "projects") => Object.values(localizedRoutes[category]).flatMap((route) => [
    { url: canonicalUrl(route.es), lastModified, changeFrequency: "monthly" as const, priority: category === "services" ? 0.9 : category === "sectors" ? 0.75 : 0.8, alternates: { languages: { es: canonicalUrl(route.es), en: canonicalUrl(route.en) } } },
    { url: canonicalUrl(route.en), lastModified, changeFrequency: "monthly" as const, priority: category === "services" ? 0.9 : category === "sectors" ? 0.75 : 0.8, alternates: { languages: { es: canonicalUrl(route.es), en: canonicalUrl(route.en) } } },
  ]);

  return [
    {
      url: canonicalUrl(homeSeo.path),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: canonicalUrl("/"), en: canonicalUrl("/en/") } },
    },
    {
      url: canonicalUrl("/en/"),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: { es: canonicalUrl("/"), en: canonicalUrl("/en/") } },
    },
    { url: canonicalUrl("/privacidad"), lastModified, changeFrequency: "yearly", priority: 0.3, alternates: { languages: { es: canonicalUrl("/privacidad/"), en: canonicalUrl("/en/privacy/") } } },
    { url: canonicalUrl("/en/privacy/"), lastModified, changeFrequency: "yearly", priority: 0.3, alternates: { languages: { es: canonicalUrl("/privacidad/"), en: canonicalUrl("/en/privacy/") } } },
    ...paired("services"),
    ...paired("sectors"),
    ...paired("projects"),
  ];
}
