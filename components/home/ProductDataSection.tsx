import type { CSSProperties } from "react";
import SectionHeading from "@/components/molecules/SectionHeading";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeExperience.module.css";
import type { HomeDictionary } from "@/lib/i18n";

const dataSignals = [
  [78, 54, 34, 20], [62, 84, 40, 25], [38, 66, 86, 46], [28, 52, 72, 92],
];

export default function ProductDataSection({ dictionary: t }: { dictionary: HomeDictionary }) {
  return (
    <HomeSectionReveal className={styles.dataBackground}>
      <section className={`${styles.section} ${styles.dataSection}`} data-navbar-theme="dark" data-nav-section="soluciones">
        <SectionHeading
          className={styles.sectionHead}
          eyebrow={t.data.eyebrow}
          eyebrowClassName={styles.eyebrow}
          title={t.data.title}
          description={t.data.description}
          wrapContent
        />

        <div className={styles.dataGrid}>
          {t.data.items.map((signal, index) => (
            <article key={signal.title}>
              <span className={styles.dataIndex}>0{index + 1}</span>
              <h3>{signal.title}</h3>
              <p>{signal.body}</p>
              <div className={styles.dataBars} aria-hidden="true">
                {dataSignals[index].map((value, barIndex) => (
                  <span key={barIndex} style={{ "--bar-value": `${value}%` } as CSSProperties} />
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className={styles.dataNote}>{t.data.note}</p>
      </section>
    </HomeSectionReveal>
  );
}
