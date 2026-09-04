import SectionHeading from "@/components/molecules/SectionHeading";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeCommercial.module.css";
import type { HomeDictionary } from "@/lib/i18n";

const pipelines = [
  { number: "01" },
  { number: "02", active: true },
];

export default function ProcessComparisonSection({ dictionary: t }: { dictionary: HomeDictionary }) {
  const localizedPipelines = pipelines.map((pipeline, index) => ({ ...pipeline, ...t.process.pipelines[index] }));
  return (
    <HomeSectionReveal className={styles.lightBackground}>
      <section className={`${styles.section} ${styles.processSection}`} data-navbar-theme="light" data-nav-section="inicio">
        <SectionHeading
          className={styles.sectionHead}
          eyebrow={t.process.eyebrow}
          eyebrowClassName={styles.eyebrow}
          title={t.process.title}
        />

        <div className={styles.pipelineComparison}>
          {localizedPipelines.map((pipeline) => (
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
        <p className={styles.processConclusion}>
          {t.process.conclusion}
        </p>
      </section>
    </HomeSectionReveal>
  );
}
