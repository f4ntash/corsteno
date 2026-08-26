const capabilities = [
  {
    title: "Configuración 3D",
    description: "Productos con materiales, colores, medidas y variantes editables directamente desde el navegador.",
  },
  {
    title: "Visualización interactiva",
    description: "Espacios y proyectos navegables antes de ser construidos.",
  },
  {
    title: "Experiencias web",
    description: "Sitios y productos digitales para negocios donde lo visual forma parte de la venta.",
  },
  {
    title: "Integraciones",
    description: "Configuradores embebibles en sitios existentes, catálogos, ecommerce o herramientas comerciales.",
  },
  {
    title: "Realidad aumentada y virtual",
    description: "Próximamente: extensión de experiencias 3D al espacio físico y entornos inmersivos.",
  },
];

const audiences = [
  {
    title: "Arquitectura y desarrollos",
    description: "Vendé proyectos antes de construirlos.",
  },
  {
    title: "Productos configurables",
    description: "Mostrá todas las variantes sin fotografiar cada combinación.",
  },
  {
    title: "Mobiliario / cocinas / piscinas / aberturas",
    description: "Dejá que el cliente configure antes de pedir presupuesto.",
  },
  {
    title: "Hotelería y turismo",
    description: "Convertí la presentación digital en parte de la experiencia.",
  },
  {
    title: "Marcas premium",
    description: "Hacé que explorar el producto sea parte de comprarlo.",
  },
];

export default function Capabilities() {
  return (
    <section className="capabilities" id="soluciones" data-od-id="capacidades" data-navbar-theme="light">
      <header className="cap-head">
        <span className="label">Capacidades</span>
        <p>
          Desarrollamos experiencias digitales que combinan visualización 3D, interfaz, contenido y tecnología web para
          presentar productos con mayor claridad.
        </p>
      </header>
      <ol className="cap-list">
        {capabilities.map((capability, index) => (
          <li className="cap-item" key={capability.title}>
            <span className="cap-number">{String(index + 1).padStart(2, "0")}</span>
            <h2>{capability.title}</h2>
            <p>{capability.description}</p>
          </li>
        ))}
      </ol>
      <div className="cap-engine">
        <span className="label">Corsteno Engine</span>
        <h2>No arrancamos de cero.</h2>
        <p>
          Corsteno Engine es nuestra base reutilizable para construir experiencias interactivas adaptadas a cada
          producto.
        </p>
        <div className="engine-formula" aria-label="Modelo 3D más partes configurables más variantes más interfaz más web: experiencia lista para integrar">
          <span>Modelo 3D</span>
          <b aria-hidden="true">+</b>
          <span>Partes configurables</span>
          <b aria-hidden="true">+</b>
          <span>Variantes</span>
          <b aria-hidden="true">+</b>
          <span>Interfaz</span>
          <b aria-hidden="true">+</b>
          <span>Web</span>
          <b aria-hidden="true">→</b>
          <strong>Experiencia lista para integrar</strong>
        </div>
        <p>
          Compartimos la misma base técnica y adaptamos materiales, variantes, controles e integraciones a cada caso.
        </p>
        <ul className="engine-foundation" aria-label="Base reutilizable de Corsteno Engine">
          <li>Materiales</li>
          <li>Variantes</li>
          <li>Cámaras</li>
          <li>Controles</li>
          <li>Lógica de producto</li>
        </ul>
      </div>
      <div className="cap-audience">
        <span className="label">Para quién</span>
        <ol className="audience-list cap-item">
          {audiences.map((audience, index) => (
            <li key={audience.title}>
              <span className="cap-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{audience.title}</h3>
              <p>{audience.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
