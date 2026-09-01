import InteractiveHeroDemo from "./home/InteractiveHeroDemo";
import ProcessComparisonSection from "./home/ProcessComparisonSection";
import ActionButton from "./atoms/ActionButton";
import Eyebrow from "./atoms/Eyebrow";
import ActionGroup from "./molecules/ActionGroup";

export default function CommercialIntro() {
  return (
    <>
      <section className="commercial-hero" id="inicio" data-od-id="que-hacemos" data-navbar-theme="light" data-nav-section="inicio">
        <div className="commercial-hero-copy">
          <Eyebrow className="label">Tecnología interactiva para productos y proyectos</Eyebrow>
          <h1>
            Transformamos
            <br />
            imágenes estáticas
            <br />
            en experiencias
            <br />
            <em>que venden.</em>
          </h1>
          <p>
            Creamos experiencias web donde tus clientes pueden explorar, comparar y personalizar lo que ofrecés antes
            de iniciar una consulta comercial.
          </p>
          <ul className="commercial-hero-metrics" aria-label="Capacidades de la experiencia">
            <li><strong>3D</strong><span>en tiempo real</span></li>
            <li><strong>Web</strong><span>desde el navegador</span></li>
            <li><strong>Datos</strong><span>listos para consultar</span></li>
          </ul>
          <ActionGroup className="commercial-actions">
            <ActionButton className="commercial-action-primary" href="#contacto">Contanos sobre tu producto</ActionButton>
            <ActionButton className="commercial-action-secondary" href="#proyectos">Ver proyectos</ActionButton>
          </ActionGroup>
          <div className="commercial-proof" aria-label="Áreas de trabajo">
            <span>3D</span>
            <span>Interacción</span>
            <span>Web</span>
            <span>Configuradores</span>
          </div>
        </div>
        <div className="commercial-hero-visual">
          <InteractiveHeroDemo />
        </div>
      </section>

      <ProcessComparisonSection />
    </>
  );
}
