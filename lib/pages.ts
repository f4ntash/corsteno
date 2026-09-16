import type { Metadata } from "next";
import pageRegistryData from "@/data/page-registry.json";
import { customPageMetadata } from "@/lib/seo";

export type GeneratedPageSeo = {
  title: string;
  description: string;
};

export type GeneratedPage = {
  id: string;
  name: string;
  componentName: string;
  paths: {
    es: string;
    en?: string;
  };
  seo: {
    es: GeneratedPageSeo;
    en?: GeneratedPageSeo;
  };
};

type PageRegistry = {
  pages: GeneratedPage[];
};

export const pageRegistry = pageRegistryData as PageRegistry;
export const generatedPages = pageRegistry.pages;

export function findPage(id: string) {
  return generatedPages.find((page) => page.id === id);
}

export function getPageMetadata(id: string, locale: "es" | "en"): Metadata {
  const page = findPage(id);
  const seo = page?.seo[locale];
  const currentPath = page?.paths[locale];
  if (!page || !seo || !currentPath) return {};

  return customPageMetadata({
    title: seo.title,
    description: seo.description,
    spanishPath: page.paths.es,
    englishPath: page.paths.en,
  }, locale);
}
