import type { Metadata } from "next";
import ActionButton from "@/components/atoms/ActionButton";
import Eyebrow from "@/components/atoms/Eyebrow";
import ActionGroup from "@/components/molecules/ActionGroup";
import { site } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Solicitud enviada | Corsteno",
  description: "Recibimos tu consulta en Corsteno.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SolicitudEnviadaPage() {
  return (
    <main className="not-found-page" id="main-content">
      <Eyebrow className="label">Contacto</Eyebrow>
      <h1>Solicitud enviada</h1>
      <p>Recibimos tu consulta. Te responderemos a la brevedad.</p>
      <ActionGroup>
        <ActionButton href={`${site.basePath}/`}>Volver al inicio</ActionButton>
      </ActionGroup>
    </main>
  );
}
