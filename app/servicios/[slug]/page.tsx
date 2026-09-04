import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { findSeoPage, pageMetadata, servicePages, spanishPageMetadata } from "@/lib/seo";
import { localizedRoutes } from "@/lib/i18n/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = findSeoPage("servicio", slug);
  if (!page) return {};
  const route = localizedRoutes.services[slug as keyof typeof localizedRoutes.services];
  return route ? spanishPageMetadata({ ...page, spanishPath: route.es, englishPath: route.en }) : pageMetadata(page);
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const page = findSeoPage("servicio", slug);
  if (!page) notFound();
  return <SeoLandingPage page={page} />;
}
