import SectionHeading from "@/components/molecules/SectionHeading";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeCommercial.module.css";

const pipelines = [
  {
    number: "01",
    title: "Proceso tradicional",
    steps: ["Catálogo", "Consulta", "WhatsApp / Email", "Vendedor", "Presupuesto", "Correcciones", "Pedido"],
  },
  {
    number: "02",
    title: "Con Corsteno",
    steps: ["Producto", "Configura", "Visualiza", "Cotiza", "Envía", "CRM / Vendedor", "Producción"],
    active: true,
  },
];

export default function ProcessComparisonSection() {
  return (
    <HomeSectionReveal className={styles.lightBackground}>
      <section className={`${styles.section} ${styles.processSection}`} data-navbar-theme="light">
        <SectionHeading
          className={styles.sectionHead}
          eyebrow="Cambio de proceso"
          eyebrowClassName={styles.eyebrow}
          title="Tu producto puede venderse de otra manera."
        />

        <div className={styles.pipelineComparison}>
          {pipelines.map((pipeline) => (
            <article
              className={`${styles.pipeline}${pipeline.active ? ` ${styles.pipelineActive}` : ""}`}
              key={pipeline.number}
            >
              <div className={styles.pipelineLabel}>
                <span>{pipeline.number}</span>
                <h3>{pipeline.title}</h3>
              </div>
              <ol>
                {pipeline.steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
          ))}
        </div>
      </section>
    </HomeSectionReveal>
  );
}
