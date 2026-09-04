import type { Metadata } from "next";
import { ConfirmationPage } from "@/components/LocalizedLegalPage";
import { enLegal } from "@/lib/i18n/legal";
export const metadata: Metadata = { title: "Request sent | Corsteno", description: "We received your inquiry at Corsteno.", alternates: { canonical: null }, robots: { index: false, follow: false } };
export default function EnglishRequestSentPage() { return <ConfirmationPage copy={enLegal.confirmation} />; }
