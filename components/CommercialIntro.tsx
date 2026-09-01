import DigitalLayerSection from "./home/DigitalLayerSection";
import InteractiveHeroDemo from "./home/InteractiveHeroDemo";
import ProcessComparisonSection from "./home/ProcessComparisonSection";
import ActionButton from "./atoms/ActionButton";
import Eyebrow from "./atoms/Eyebrow";
import ActionGroup from "./molecules/ActionGroup";

export default function CommercialIntro() {
  return (
    <>
      <section className="commercial-hero" id="inicio" data-od-id="que-hacemos" data-navbar-theme="light">
        <div className="commercial-hero-copy">
          <Eyebrow className="label">Experiencias digitales para productos, marcas y negocios</Eyebrow>
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
            Combinamos 3D, interacción y tecnología web para que tus clientes puedan explorar, personalizar y decidir
            con confianza.
          </p>
          <ul className="commercial-hero-metrics" aria-label="Resultados y capacidades">
            <li><strong>+40%</strong><span>más engagement</span></li>
            <li><strong>3D</strong><span>tiempo real</span></li>
            <li><strong>100%</strong><span>integrado a tu web</span></li>
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
      <DigitalLayerSection />
    </>
  );
}
