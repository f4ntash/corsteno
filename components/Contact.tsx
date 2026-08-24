import { contactChannels } from "@/lib/contact";

export default function Contact() {
  const hasContactChannel = Boolean(contactChannels.whatsappUrl || contactChannels.email);

  return (
    <section className="contact dark" id="contacto" data-od-id="contacto">
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
      </div>
      <div className="contact-action">
        <p className="contact-commercial-copy">
          Mandanos una foto o catálogo de tu producto y te mostramos qué se puede hacer.
        </p>
        <span className="contact-support-copy">No necesitás tener un modelo 3D preparado.</span>
        {hasContactChannel ? (
          <div className="contact-channels" aria-label="Canales de contacto">
            {contactChannels.whatsappUrl ? (
              <a href={contactChannels.whatsappUrl} data-cursor="Abrir" data-od-id="contacto-iniciar">
                Contanos sobre tu producto
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
        <span className="meta">Ver · Probar · Configurar · Decidir</span>
      </footer>
    </section>
  );
}
