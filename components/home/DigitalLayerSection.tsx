import Eyebrow from "@/components/atoms/Eyebrow";
import SectionHeading from "@/components/molecules/SectionHeading";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeCommercial.module.css";

const solutions = [
  {
    number: "01",
    title: "Configuradores 3D",
    description: "Tus clientes pueden explorar modelos, materiales, colores, componentes y variantes en tiempo real.",
    capabilities: ["3D en tiempo real", "Materiales", "Variantes", "Dimensiones", "Componentes"],
  },
  {
    number: "02",
    title: "Experiencias digitales",
    description: "Showrooms, catálogos y experiencias interactivas diseñadas alrededor de tu producto.",
    capabilities: ["Showrooms", "Catálogos interactivos", "Visualización", "AR-ready", "Experiencias web"],
  },
  {
    number: "03",
    title: "Desarrollo web",
    description:
      "Diseñamos y desarrollamos sitios y plataformas web rápidas, claras y pensadas para convertir visitas en oportunidades reales.",
    capabilities: ["Sitios corporativos", "Ecommerce", "Landing pages", "Plataformas web", "Performance", "Responsive"],
  },
];

export default function DigitalLayerSection() {
  return (
    <HomeSectionReveal className={styles.darkBackground}>
      <section
        className={`${styles.section} ${styles.digitalSection}`}
        id="soluciones"
        data-navbar-theme="dark"
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
            <h3>Software conectado</h3>
            <p>
              Estas experiencias pueden evolucionar e integrarse con ecommerce, cotizaciones, pricing, CRM, ERP,
              APIs y analytics según las necesidades reales del negocio.
            </p>
          </div>
        </div>
      </section>
    </HomeSectionReveal>
  );
}
