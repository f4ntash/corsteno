
import SectionHeading from "@/components/molecules/SectionHeading";
import ProductConfigurator from "@/components/home/configurator/ProductConfigurator";
import styles from "./homeExperience.module.css";

export default function InteractiveDemoSection() {
  return (
    <section
      className={`${styles.section} ${styles.demoSection}`}
      id="demo"
      data-navbar-theme="light"
      data-nav-section="demo"
    >
      <SectionHeading
        className={styles.sectionHead}
        eyebrow="Demo interactiva"
        eyebrowClassName={styles.eyebrow}
        title="No te lo contamos. Probalo."
        description="Elegí modelo, medidas y terminaciones. El producto y el pedido se actualizan en el momento."
        wrapContent
      />
      <ProductConfigurator constrained />
    </section>
  );
}
