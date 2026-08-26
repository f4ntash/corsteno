import type { MetadataRoute } from "next";
import { canonicalUrl, homeSeo, indexablePages } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-26");

  return [
    {
      url: canonicalUrl(homeSeo.path),
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: canonicalUrl("/privacidad"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...indexablePages.map((page) => ({
      url: canonicalUrl(page.path),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page.category === "servicio" ? 0.9 : page.category === "sector" ? 0.75 : 0.8,
    })),
  ];
}
