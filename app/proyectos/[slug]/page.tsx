import { notFound } from "next/navigation";
import ProjectCaseStudy from "@/components/projects/ProjectCaseStudy";
import { findSeoPage, pageMetadata, projectPages, spanishPageMetadata } from "@/lib/seo";
import { localizedRoutes } from "@/lib/i18n/routes";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = findSeoPage("proyecto", slug);
  if (!page) return {};
  const route = localizedRoutes.projects[slug as keyof typeof localizedRoutes.projects];
  return route ? spanishPageMetadata({ ...page, spanishPath: route.es, englishPath: route.en }) : pageMetadata(page);
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const page = findSeoPage("proyecto", slug);
  if (!page) notFound();
  return <ProjectCaseStudy page={page} />;
}
