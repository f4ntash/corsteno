import type { Metadata } from "next";
import { PrivacyPage } from "@/components/LocalizedLegalPage";
import { enLegal } from "@/lib/i18n/legal";
import { canonicalUrl, site } from "@/lib/seo";
const url = canonicalUrl("/en/privacy/");
export const metadata: Metadata = { title: "Privacy policy | Corsteno", description: "How Corsteno uses information submitted through forms, demos and optional communications.", alternates: { canonical: url, languages: { es: canonicalUrl("/privacidad/"), en: url, "x-default": canonicalUrl("/privacidad/") } }, openGraph: { title: "Privacy policy | Corsteno", description: "Information about forms, demos, external providers and Corsteno communications.", url, siteName: site.name, locale: "en_US", type: "website" }, twitter: { card: "summary", title: "Privacy policy | Corsteno", description: "Information about data use at Corsteno." } };
export default function EnglishPrivacyPage() { return <PrivacyPage copy={enLegal.privacy} locale="en" />; }
