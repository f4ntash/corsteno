import Eyebrow from "@/components/atoms/Eyebrow";
import SectionHeading from "@/components/molecules/SectionHeading";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeCommercial.module.css";
import type { HomeDictionary } from "@/lib/i18n";

const solutionNumbers = ["01", "02", "03"];

export default function DigitalLayerSection({ dictionary: t }: { dictionary: HomeDictionary }) {
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
          eyebrow={t.solutions.eyebrow}
          eyebrowClassName={styles.eyebrow}
          title={t.solutions.title}
        />

        <div className={styles.solutionList}>
          {t.solutions.items.map((solution, index) => (
            <article className={styles.solutionItem} key={solution.title}>
              <span className={styles.solutionNumber}>{solutionNumbers[index]}</span>
              <div className={styles.solutionCopy}>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </div>
              <ul aria-label={`${t.solutions.capabilitiesAria} ${solution.title}`}>
                {solution.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className={styles.integrationCapability}>
          <Eyebrow className={styles.eyebrow}>{t.solutions.evolution}</Eyebrow>
          <div>
            <h3>{t.solutions.integrationTitle}</h3>
            <p>{t.solutions.integrationBody}</p>
          </div>
        </div>
      </section>
    </HomeSectionReveal>
  );
}
