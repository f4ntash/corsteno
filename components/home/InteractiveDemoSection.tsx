
import SectionHeading from "@/components/molecules/SectionHeading";
import ProductConfigurator from "@/components/home/configurator/ProductConfigurator";
import styles from "./homeExperience.module.css";
import type { HomeDictionary, Locale } from "@/lib/i18n";

export default function InteractiveDemoSection({ dictionary: t, locale }: { dictionary: HomeDictionary; locale: Locale }) {
  return (
    <section
      className={`${styles.section} ${styles.demoSection}`}
      id="demo"
      data-navbar-theme="light"
      data-nav-section="demo"
    >
      <SectionHeading
        className={styles.sectionHead}
        eyebrow={t.demo.eyebrow}
        eyebrowClassName={styles.eyebrow}
        title={t.demo.title}
        description={t.demo.description}
        wrapContent
      />
      <ProductConfigurator constrained dictionary={t} locale={locale} />
    </section>
  );
}
