import { NotFoundPage } from "@/components/LocalizedLegalPage";
import { enLegal } from "@/lib/i18n/legal";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Page not found | Corsteno", description: "The requested page does not exist at Corsteno.", robots: { index: false, follow: true }, alternates: { canonical: null } };
export default function EnglishNotFound() { return <NotFoundPage copy={enLegal.notFound} english />; }
