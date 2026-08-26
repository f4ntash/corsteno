import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeExperience.module.css";

const systemNodes = ["Website", "Ecommerce", "CRM", "ERP", "Pricing", "Cotizaciones", "Producción", "Analytics"];

export default function ConnectedSystemSection() {
  return (
    <HomeSectionReveal className={styles.connectedBackground}>
      <section className={styles.connectedSection} data-navbar-theme="dark">
        <div className={styles.connectedCopy}>
          <span className={styles.eyebrow}>Sistema conectado</span>
          <h2>El 3D es solo la interfaz.</h2>
          <p>
            La experiencia puede evolucionar y conectarse con ventas, precios, stock, cotizaciones y producción según
            el proceso de cada empresa.
          </p>
        </div>

        <div className={styles.systemNetwork} aria-label="Tu producto conectado con sistemas comerciales">
          <svg viewBox="0 0 1000 560" aria-hidden="true">
            <g>
              <line x1="500" y1="280" x2="130" y2="90" />
              <line x1="500" y1="280" x2="360" y2="62" />
              <line x1="500" y1="280" x2="660" y2="62" />
              <line x1="500" y1="280" x2="870" y2="90" />
              <line x1="500" y1="280" x2="130" y2="470" />
              <line x1="500" y1="280" x2="360" y2="498" />
              <line x1="500" y1="280" x2="660" y2="498" />
              <line x1="500" y1="280" x2="870" y2="470" />
            </g>
          </svg>
          <strong>Tu producto</strong>
          {systemNodes.map((node) => <span key={node}>{node}</span>)}
        </div>
      </section>
    </HomeSectionReveal>
  );
}
