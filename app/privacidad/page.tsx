import type { Metadata } from "next";
import { PrivacyPage } from "@/components/LocalizedLegalPage";
import { esLegal } from "@/lib/i18n/legal";
import { canonicalUrl, site } from "@/lib/seo";
const url = canonicalUrl("/privacidad/");
export const metadata: Metadata = { title: "Política de privacidad | Corsteno", description: "Cómo Corsteno utiliza la información enviada mediante formularios, demos y comunicaciones opcionales.", alternates: { canonical: url, languages: { es: url, en: canonicalUrl("/en/privacy/"), "x-default": url } }, openGraph: { title: "Política de privacidad | Corsteno", description: "Información sobre formularios, demos, proveedores externos y comunicaciones de Corsteno.", url, siteName: site.name, locale: site.locale, type: "website" }, twitter: { card: "summary", title: "Política de privacidad | Corsteno", description: "Información sobre el uso de datos en Corsteno." } };
export default function PrivacyRoute() { return <PrivacyPage copy={esLegal.privacy} locale="es" />; }
