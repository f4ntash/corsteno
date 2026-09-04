import type { Metadata } from "next";
import { ConfirmationPage } from "@/components/LocalizedLegalPage";
import { esLegal } from "@/lib/i18n/legal";
export const metadata: Metadata = { title: "Solicitud enviada | Corsteno", description: "Recibimos tu consulta en Corsteno.", alternates: { canonical: null }, robots: { index: false, follow: false } };
export default function SolicitudEnviadaPage() { return <ConfirmationPage copy={esLegal.confirmation} />; }
