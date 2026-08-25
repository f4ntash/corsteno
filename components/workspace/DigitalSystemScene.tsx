type DigitalSystemSceneProps = {
  sceneStyle: React.CSSProperties;
  active: boolean;
};

export default function DigitalSystemScene({ sceneStyle, active }: DigitalSystemSceneProps) {
  return (
    <article
      className={`scene scene-system dark${active ? " is-active" : ""}`}
      id="system"
      data-project-scene="3"
      data-od-id="escena-sistema"
      style={sceneStyle}
    >
      <div className="spatial-placeholder">
        <span className="scene-number">04 / 04 · Experiencias inmersivas</span>
        <span className="spatial-kicker">RA · RV · Spatial</span>
        <h2 data-od-id="sistema-titulo">Experiencias inmersivas para productos y espacios.</h2>
        <p>
          Estamos preparando experiencias de Realidad Aumentada y Realidad Virtual para productos, espacios y
          proyectos interactivos.
        </p>
        <strong>Próximamente</strong>
        <span className="spatial-meta">Aplicaciones para arquitectura, real estate y producto.</span>
        <a className="contextual-cta dark" href="#contacto" data-service="immersive" data-cursor="Abrir">
          Contanos sobre tu producto ↗
        </a>
      </div>
      <a className="scene-action" href="#capacidades" data-od-id="sistema-continuar">
        Capacidades ↓
      </a>
    </article>
  );
}
