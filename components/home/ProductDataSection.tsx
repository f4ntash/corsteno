import type { CSSProperties } from "react";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeExperience.module.css";

const dataSignals = [
  { title: "Productos más configurados", body: "Qué productos generan mayor interés.", pattern: [78, 54, 34, 20] },
  { title: "Materiales preferidos", body: "Qué colores y terminaciones eligen tus clientes.", pattern: [62, 84, 40, 25] },
  { title: "Combinaciones", body: "Qué variantes suelen configurarse juntas.", pattern: [38, 66, 86, 46] },
  { title: "Intención de compra", body: "Dónde avanzan, abandonan o solicitan cotización.", pattern: [28, 52, 72, 92] },
];

export default function ProductDataSection() {
  return (
    <HomeSectionReveal className={styles.dataBackground}>
      <section className={`${styles.section} ${styles.dataSection}`} data-navbar-theme="dark">
        <header className={styles.sectionHead}>
          <span className={styles.eyebrow}>Datos de producto</span>
          <div>
            <h2>Cada configuración también genera información.</h2>
            <p>Entendé qué buscan tus clientes antes de que lleguen a una cotización.</p>
          </div>
        </header>

        <div className={styles.dataGrid}>
          {dataSignals.map((signal, index) => (
            <article key={signal.title}>
              <span className={styles.dataIndex}>0{index + 1}</span>
              <h3>{signal.title}</h3>
              <p>{signal.body}</p>
              <div className={styles.dataBars} aria-hidden="true">
                {signal.pattern.map((value, barIndex) => (
                  <span key={barIndex} style={{ "--bar-value": `${value}%` } as CSSProperties} />
                ))}
              </div>
            </article>
          ))}
        </div>
        <p className={styles.dataNote}>Ejemplos de datos que una implementación puede registrar.</p>
      </section>
    </HomeSectionReveal>
  );
}
