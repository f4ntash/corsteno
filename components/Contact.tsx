import { contactChannels, socialLinks } from "@/lib/contact";
import { site } from "@/lib/seo";
import ContactForm from "@/components/contact/ContactForm";

export default function Contact() {
  const hasContactChannel = Boolean(contactChannels.whatsappUrl || contactChannels.email);

  return (
    <section className="contact dark" id="contacto" data-od-id="contacto" data-navbar-theme="dark">
      <div className="contact-copy">
        <span className="label">Contacto</span>
        <h2 data-od-id="contacto-titulo">
          Veamos cómo presentar mejor
          <br />
          tu producto o proyecto.
        </h2>
        <p>
          Contanos qué necesitás mostrar.
          <br />
          Podés enviarnos una referencia, fotografía, catálogo, plano o modelo 3D y analizamos qué tipo de experiencia
          puede adaptarse mejor.
        </p>
        <div className="contact-quote-info" aria-labelledby="contact-quote-title">
          <h3 id="contact-quote-title">¿Cómo cotizamos?</h3>
          <p>
            Cada proyecto es distinto. El alcance depende de lo que quieras construir y del producto que necesitemos
            representar.
          </p>
          <ul>
            <li>Complejidad del producto</li>
            <li>Cantidad de variantes</li>
            <li>Modelado 3D necesario</li>
            <li>Interacciones y funcionalidades</li>
            <li>Integraciones con otros sistemas</li>
          </ul>
          <p>Contanos qué necesitás y evaluamos el proyecto sin costo.</p>
        </div>
      </div>
      <div className="contact-action">
        <p className="contact-commercial-copy">
          Mandanos una foto o catálogo de tu producto y te mostramos qué se puede hacer.
        </p>
        <span className="contact-support-copy">No necesitás tener un modelo 3D preparado.</span>
        <ContactForm />
        {hasContactChannel ? (
          <div className="contact-channels" aria-label="Canales de contacto">
            {contactChannels.whatsappUrl ? (
              <a href={contactChannels.whatsappUrl} data-cursor="Abrir" data-od-id="contacto-iniciar">
                Escribinos por WhatsApp
              </a>
            ) : null}
            {contactChannels.email ? (
              <a href={`mailto:${contactChannels.email}`} data-cursor="Abrir">
                Escribinos
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
      <footer className="contact-footer">
        <span className="meta">Corsteno · Argentina</span>
        <nav className="contact-footer-links" aria-label="Servicios y proyectos">
          <a href={`${site.basePath}/servicios/configuradores-3d/`}>Configuradores 3D</a>
          <a href={`${site.basePath}/servicios/visualizacion-3d/`}>Visualización 3D</a>
          <a href={`${site.basePath}/servicios/desarrollo-web/`}>Desarrollo web</a>
          <a href={`${site.basePath}/#proyectos`}>Proyectos</a>
          <a href={`${site.basePath}/#contacto`}>Contacto</a>
          {socialLinks.instagramUrl ? (
            <a href={socialLinks.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
          ) : null}
          {socialLinks.linkedinUrl ? (
            <a href={socialLinks.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
          ) : null}
        </nav>
        <span className="meta">Ver · Probar · Configurar · Decidir</span>
      </footer>
    </section>
  );
}
