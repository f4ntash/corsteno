import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { findSeoPage, pageMetadata, sectorPages, spanishPageMetadata } from "@/lib/seo";
import { localizedRoutes } from "@/lib/i18n/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sectorPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = findSeoPage("sector", slug);
  if (!page) return {};
  const route = localizedRoutes.sectors[slug as keyof typeof localizedRoutes.sectors];
  return route ? spanishPageMetadata({ ...page, spanishPath: route.es, englishPath: route.en }) : pageMetadata(page);
}

export default async function SectorPage({ params }: PageProps) {
  const { slug } = await params;
  const page = findSeoPage("sector", slug);
  if (!page) notFound();
  return <SeoLandingPage page={page} />;
}
