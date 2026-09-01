import type { Metadata } from "next";
import Eyebrow from "@/components/atoms/Eyebrow";
import Navigation from "@/components/Navigation";
import { contactChannels } from "@/lib/contact";
import { canonicalUrl, site } from "@/lib/seo";

const privacyUrl = canonicalUrl("/privacidad");

export const metadata: Metadata = {
  title: "Política de privacidad | Corsteno",
  description: "Cómo Corsteno utiliza la información enviada mediante formularios, demos y comunicaciones opcionales.",
  alternates: { canonical: privacyUrl },
  openGraph: {
    title: "Política de privacidad | Corsteno",
    description: "Información sobre formularios, demos, proveedores externos y comunicaciones de Corsteno.",
    url: privacyUrl,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Política de privacidad | Corsteno",
    description: "Información sobre el uso de datos en Corsteno.",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="privacy-page" id="main-content" data-navbar-theme="light">
        <header>
          <Eyebrow className="label">Información legal</Eyebrow>
          <h1>Política de privacidad</h1>
          <p>Última actualización: 26 de agosto de 2026.</p>
        </header>

        <section>
          <h2>Qué información recopilamos</h2>
          <p>
            Corsteno puede recibir el nombre, email, empresa, tipo de proyecto y mensaje que una persona envía mediante
            el formulario de contacto. La demo interactiva puede solicitar un email, la configuración elegida, fecha,
            página de origen y consentimiento opcional para comunicaciones.
          </p>
        </section>

        <section>
          <h2>Para qué se utiliza</h2>
          <p>
            Utilizamos la información para responder consultas, evaluar proyectos, preparar solicitudes de demostración
            y mantener comunicaciones sobre novedades, demos o casos únicamente cuando existe consentimiento.
          </p>
        </section>

        <section>
          <h2>Proveedores externos</h2>
          <p>
            El formulario de contacto utiliza Formspree. La web puede utilizar servicios externos de hosting, medición,
            email o newsletter cuando estén configurados. Cada proveedor procesa la información según sus propias
            condiciones y políticas. Google Analytics puede recopilar datos de uso y navegación cuando la medición
            está habilitada; no recibe el contenido de los formularios enviados a Corsteno.
          </p>
        </section>

        <section>
          <h2>Marketing y consentimiento</h2>
          <p>
            Solicitar una demo no incorpora automáticamente el email a una lista de marketing. Esa finalidad requiere
            una opción separada, voluntaria y no preseleccionada. El consentimiento puede retirarse posteriormente.
          </p>
        </section>

        <section>
          <h2>Conservación y solicitudes</h2>
          <p>
            Conservamos la información durante el tiempo necesario para gestionar la consulta o la finalidad aceptada.
            Podés solicitar acceso, corrección o eliminación mediante los canales disponibles de Corsteno.
          </p>
          <p>
            {contactChannels.email ? (
              <a href={`mailto:${contactChannels.email}`}>{contactChannels.email}</a>
            ) : (
              <a href={`${site.basePath}/#contacto`}>Contactar a Corsteno</a>
            )}
          </p>
        </section>
      </main>
    </>
  );
}
