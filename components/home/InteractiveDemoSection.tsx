
import SectionHeading from "@/components/molecules/SectionHeading";
import ProductConfigurator from "@/components/home/configurator/ProductConfigurator";
import styles from "./homeExperience.module.css";

export default function InteractiveDemoSection() {
  return (
    <section
      className={`${styles.section} ${styles.demoSection}`}
      id="demo"
      data-navbar-theme="light"
    >
      <SectionHeading
        className={styles.sectionHead}
        eyebrow="Demo interactiva"
        eyebrowClassName={styles.eyebrow}
        title="No te lo contamos. Probalo."
        description="Configurá el producto como si fuera parte de tu catálogo."
        wrapContent
      />
      <ProductConfigurator constrained />
    </section>
  );
}
