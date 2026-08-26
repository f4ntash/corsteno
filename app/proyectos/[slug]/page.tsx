import { notFound } from "next/navigation";
import ProjectCaseStudy from "@/components/projects/ProjectCaseStudy";
import { findSeoPage, pageMetadata, projectPages } from "@/lib/seo";

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
  return pageMetadata(page);
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const page = findSeoPage("proyecto", slug);
  if (!page) notFound();
  return <ProjectCaseStudy page={page} />;
}
