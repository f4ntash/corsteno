import { notFound } from "next/navigation";
import SeoLandingPage from "@/components/seo/SeoLandingPage";
import { englishServicePages, findEnglishSeoPage } from "@/lib/i18n/localizedSeo";
import { localizedPageMetadata } from "@/lib/seo";

export function generateStaticParams() { return englishServicePages.map((page) => ({ slug: page.englishPath.split("/").filter(Boolean).pop() })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const page = findEnglishSeoPage("servicio", (await params).slug); return page ? localizedPageMetadata(page) : {}; }
export default async function EnglishServicePage({ params }: { params: Promise<{ slug: string }> }) { const page = findEnglishSeoPage("servicio", (await params).slug); if (!page) notFound(); return <SeoLandingPage page={page} locale="en" />; }
