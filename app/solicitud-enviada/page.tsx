import type { Metadata } from "next";
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
      <span className="label">Contacto</span>
      <h1>Solicitud enviada</h1>
      <p>Recibimos tu consulta. Te responderemos a la brevedad.</p>
      <div>
        <a href={`${site.basePath}/`}>Volver al inicio</a>
      </div>
    </main>
  );
}
