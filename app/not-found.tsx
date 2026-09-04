import type { Metadata } from "next";
import { NotFoundPage } from "@/components/LocalizedLegalPage";
import { esLegal } from "@/lib/i18n/legal";
export const metadata: Metadata = { title: "Página no encontrada | Corsteno", description: "La página solicitada no existe en Corsteno.", alternates: { canonical: null }, robots: { index: false, follow: true } };
export default function NotFound() { return <NotFoundPage copy={esLegal.notFound} />; }
