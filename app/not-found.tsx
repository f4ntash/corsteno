import type { Metadata } from "next";
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
    <main className="not-found-page">
      <span className="label">404</span>
      <h1>Página no encontrada</h1>
      <p>El enlace no está disponible o cambió de ubicación.</p>
      <div>
        <a href={`${site.basePath}/`}>Volver al inicio</a>
        <a href={`${site.basePath}/servicios/configuradores-3d/`}>Servicios</a>
        <a href={`${site.basePath}/proyectos/h2o/`}>Proyectos</a>
      </div>
    </main>
  );
}
