import type { Metadata } from "next";
import ActionButton from "@/components/atoms/ActionButton";
import Eyebrow from "@/components/atoms/Eyebrow";
import ActionGroup from "@/components/molecules/ActionGroup";
import { site } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Página no encontrada | Corsteno",
  description: "La página solicitada no existe en Corsteno.",
  alternates: { canonical: null },
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="not-found-page" id="main-content">
      <Eyebrow className="label">404</Eyebrow>
      <h1>Página no encontrada</h1>
      <p>El enlace no está disponible o cambió de ubicación.</p>
      <ActionGroup>
        <ActionButton href={`${site.basePath}/`}>Volver al inicio</ActionButton>
        <ActionButton href={`${site.basePath}/servicios/configuradores-3d/`}>Servicios</ActionButton>
        <ActionButton href={`${site.basePath}/#proyectos`}>Proyectos</ActionButton>
      </ActionGroup>
    </main>
  );
}
