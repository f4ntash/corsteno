import Eyebrow from "@/components/atoms/Eyebrow";
import HomeSectionReveal from "./HomeSectionReveal";
import styles from "./homeExperience.module.css";

const systemNodes = ["Sitio web", "Comercio", "Ventas · CRM", "Gestión · ERP", "Precios", "Cotizaciones", "Producción", "Analítica"];

export default function ConnectedSystemSection() {
  return (
    <HomeSectionReveal className={styles.connectedBackground}>
      <section className={styles.connectedSection} id="soluciones" data-navbar-theme="dark" data-nav-section="soluciones">
        <div className={styles.connectedCopy}>
          <Eyebrow className={styles.eyebrow}>Sistema conectado</Eyebrow>
          <h2>El 3D es solo la interfaz.</h2>
          <p>
            Cada elección puede convertirse en una consulta con el producto ya configurado. Según el proceso de cada
            empresa, la experiencia puede conectarse con ventas, precios, stock, cotizaciones o producción.
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
