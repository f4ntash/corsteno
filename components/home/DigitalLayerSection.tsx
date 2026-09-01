import Eyebrow from "@/components/atoms/Eyebrow";
import SectionHeading from "@/components/molecules/SectionHeading";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeCommercial.module.css";

const solutions = [
  {
    number: "01",
    title: "Configuradores 3D",
    description: "Ayudan a entender y elegir un producto antes de consultar, con sus opciones visibles en un mismo lugar.",
    capabilities: ["3D en tiempo real", "Materiales", "Variantes", "Dimensiones", "Componentes"],
  },
  {
    number: "02",
    title: "Experiencias digitales",
    description: "Transforman catálogos, espacios o proyectos en recorridos que se pueden explorar y compartir.",
    capabilities: ["Showrooms", "Catálogos interactivos", "Visualización", "Preparado para RA", "Experiencias web"],
  },
  {
    number: "03",
    title: "Desarrollo web",
    description:
      "Es la base donde contenido, interacción y herramientas comerciales funcionan como una sola experiencia.",
    capabilities: ["Sitios corporativos", "Comercio electrónico", "Páginas de campaña", "Plataformas web", "Rendimiento", "Adaptable"],
  },
];

export default function DigitalLayerSection() {
  return (
    <HomeSectionReveal className={styles.darkBackground}>
      <section
        className={`${styles.section} ${styles.digitalSection}`}
        id="capacidades"
        data-navbar-theme="dark"
        data-nav-section="soluciones"
      >
        <SectionHeading
          className={styles.sectionHead}
          eyebrow="Soluciones"
          eyebrowClassName={styles.eyebrow}
          title="Una capa digital alrededor de tu producto."
        />

        <div className={styles.solutionList}>
          {solutions.map((solution) => (
            <article className={styles.solutionItem} key={solution.number}>
              <span className={styles.solutionNumber}>{solution.number}</span>
              <div className={styles.solutionCopy}>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </div>
              <ul aria-label={`Capacidades de ${solution.title}`}>
                {solution.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className={styles.integrationCapability}>
          <Eyebrow className={styles.eyebrow}>Capacidad de evolución</Eyebrow>
          <div>
            <h3>Conectado a tu proceso comercial</h3>
            <p>
              La experiencia puede evolucionar para consultar precios, enviar configuraciones o intercambiar datos
              con comercio electrónico, CRM, ERP y otras herramientas, según las necesidades reales del negocio.
            </p>
          </div>
        </div>
      </section>
    </HomeSectionReveal>
  );
}
