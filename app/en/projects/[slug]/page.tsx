import { notFound } from "next/navigation";
import ProjectCaseStudy from "@/components/projects/ProjectCaseStudy";
import { englishProjects } from "@/lib/i18n/en/projects";
import { localizedRoutes } from "@/lib/i18n/routes";
import { findSeoPage, localizedPageMetadata } from "@/lib/seo";

export function generateStaticParams() { return Object.values(localizedRoutes.projects).map((route) => ({ slug: route.en.split("/").filter(Boolean).pop() })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const entry = Object.entries(localizedRoutes.projects).find(([, route]) => route.en.split("/").filter(Boolean).pop() === slug);
  const page = entry ? findSeoPage("proyecto", entry[0]) : undefined;
  if (!page || !entry) return {};
  const { category: _category, ...englishCopy } = englishProjects[entry[0] as keyof typeof englishProjects];
  return localizedPageMetadata({ ...page, ...englishCopy, spanishPath: entry[1].es, englishPath: entry[1].en, path: entry[1].en });
}
export default async function EnglishProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const entry = Object.entries(localizedRoutes.projects).find(([, route]) => route.en.split("/").filter(Boolean).pop() === slug);
  const page = entry ? findSeoPage("proyecto", entry[0]) : undefined;
  if (!page || !entry) notFound();
  const { category: _category, ...englishCopy } = englishProjects[entry[0] as keyof typeof englishProjects];
  const englishPage = { ...page, ...englishCopy, path: entry[1].en };
  return <ProjectCaseStudy page={englishPage} locale="en" />;
}
