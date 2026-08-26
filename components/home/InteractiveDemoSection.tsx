import IndustrialConfigurator from "@/components/industrial/IndustrialConfigurator";
import styles from "./homeExperience.module.css";

export default function InteractiveDemoSection() {
  return (
    <section
      className={`${styles.section} ${styles.demoSection}`}
      id="demo"
      data-navbar-theme="light"
    >
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>Demo interactiva</span>
        <div>
          <h2>No te lo contamos. Probalo.</h2>
          <p>Configurá el producto como si fuera parte de tu catálogo.</p>
        </div>
      </header>
      <IndustrialConfigurator constrained />
    </section>
  );
}
