import logoCorsteno from "@/components/logoSombreado.png";
import { withBasePath } from "@/lib/assetPath";
import IndustrialConfigurator from "./IndustrialConfigurator";
import IndustrialHeroModel from "./IndustrialHeroModel";
import IndustrialLeadForm from "./IndustrialLeadForm";
import IndustrialReveal from "./IndustrialReveal";
import styles from "./industrial.module.css";

const traditionalFlow = ["Catálogo", "Consulta", "WhatsApp / Email", "Vendedor", "Presupuesto", "Correcciones", "Pedido"];
const corstenoFlow = ["Producto", "Configura", "Visualiza", "Cotiza", "Envía", "CRM / vendedor", "Producción"];

const solutions = [
  {
    number: "01",
    title: "Configuradores 3D",
    description: "Tus clientes pueden explorar modelos, materiales, colores, componentes y variantes en tiempo real.",
    capabilities: ["3D en tiempo real", "Materiales", "Variantes", "Dimensiones", "Componentes"],
  },
  {
    number: "02",
    title: "Experiencias digitales",
    description: "Showrooms, webs y experiencias interactivas diseñadas alrededor del producto.",
    capabilities: ["Showrooms", "Catálogos interactivos", "Visualización", "AR-ready", "Experiencias web"],
  },
  {
    number: "03",
    title: "Software conectado",
    description: "La experiencia puede conectarse con el resto de los procesos digitales de la empresa.",
    capabilities: ["Cotizaciones", "Precios", "CRM", "ERP", "APIs", "eCommerce"],
  },
];

const dataSignals = [
  { title: "Productos más configurados", body: "Qué modelos despiertan más interés.", pattern: [78, 54, 34, 20] },
  { title: "Materiales preferidos", body: "Qué colores y terminaciones eligen tus clientes.", pattern: [62, 84, 40, 25] },
  { title: "Combinaciones", body: "Qué variantes suelen aparecer juntas.", pattern: [38, 66, 86, 46] },
  { title: "Intención de compra", body: "Dónde los clientes abandonan o solicitan cotización.", pattern: [28, 52, 72, 92] },
];

const industries = [
  { title: "Manufactura", body: "Productos industriales, piezas, componentes y variantes." },
  { title: "Muebles & Diseño", body: "Materiales, dimensiones, colores y terminaciones." },
  { title: "Arquitectura & Real Estate", body: "Espacios, unidades, edificios y proyectos interactivos." },
  { title: "eCommerce", body: "Productos personalizables antes de comprar." },
];

const process = [
  { number: "01", title: "Entendemos", body: "Producto, variantes, reglas y proceso comercial." },
  { number: "02", title: "Diseñamos", body: "Experiencia, interfaz y arquitectura." },
  { number: "03", title: "Construimos", body: "Modelos 3D, lógica y plataforma." },
  { number: "04", title: "Integramos", body: "Web, eCommerce, CRM, APIs o sistemas internos." },
  { number: "05", title: "Escalamos", body: "Nuevos modelos, variantes y funcionalidades." },
];

const engineNodes = ["Website", "eCommerce", "CRM", "ERP", "Pricing", "Cotizaciones", "Producción", "Analytics"];

export default function IndustrialExperience() {
  return (
    <main className={styles.page} id="main-content">
      <header className={styles.header}>
        <a className={styles.brand} href={withBasePath("/")} aria-label="Volver a Corsteno">
          <img
            className={styles.brandLogo}
            src={logoCorsteno.src}
            width={logoCorsteno.width}
            height={logoCorsteno.height}
            alt=""
            aria-hidden="true"
          />
          <span>
            <strong>Corsteno</strong>
            <small>Industrial concept</small>
          </span>
        </a>
        <nav aria-label="Navegación de la experiencia industrial">
          <a href="#industrial-demo">Demo</a>
          <a href="#industrial-contact">Contacto</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Corsteno · Product systems</span>
          <h1>Productos físicos. Experiencias digitales.</h1>
          <p>
            Creamos configuradores 3D, plataformas interactivas y herramientas digitales para transformar cómo tus
            clientes exploran, personalizan y compran tus productos.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#industrial-demo">Explorar una demo</a>
            <a className={styles.secondaryAction} href="#industrial-contact">Hablemos de tu producto</a>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <IndustrialHeroModel />
          <span className={`${styles.annotation} ${styles.annotationMaterials}`}>Materiales</span>
          <span className={`${styles.annotation} ${styles.annotationDimensions}`}>Dimensiones</span>
          <span className={`${styles.annotation} ${styles.annotationComponents}`}>Componentes</span>
          <span className={`${styles.annotation} ${styles.annotationPrice}`}>Precio</span>
          <span className={`${styles.annotation} ${styles.annotationData}`}>Datos</span>
        </div>
        <span className={styles.heroIndex}>EXP / 01</span>
      </section>

      <IndustrialReveal>
        <section className={`${styles.section} ${styles.problem}`}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Cambio de proceso</span>
            <h2>Tu producto puede venderse de otra manera.</h2>
          </header>
          <div className={styles.pipelineComparison}>
            <article className={styles.pipeline}>
              <div className={styles.pipelineLabel}>
                <span>01</span>
                <h3>Proceso tradicional</h3>
              </div>
              <ol>
                {traditionalFlow.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
            <article className={`${styles.pipeline} ${styles.pipelineActive}`}>
              <div className={styles.pipelineLabel}>
                <span>02</span>
                <h3>Con Corsteno</h3>
              </div>
              <ol>
                {corstenoFlow.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </article>
          </div>
        </section>
      </IndustrialReveal>

      <IndustrialReveal>
        <section className={`${styles.section} ${styles.solutions}`}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Soluciones</span>
            <h2>Una capa digital alrededor de tu producto.</h2>
          </header>
          <div className={styles.solutionList}>
            {solutions.map((solution) => (
              <article key={solution.number} className={styles.solutionItem}>
                <span>{solution.number}</span>
                <div>
                  <h3>{solution.title}</h3>
                  <p>{solution.description}</p>
                </div>
                <ul>
                  {solution.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </IndustrialReveal>

      <section className={`${styles.section} ${styles.demo}`} id="industrial-demo">
        <header className={styles.demoHead}>
          <span className={styles.eyebrow}>Demo industrial · Ventana modular</span>
          <h2>No te lo contamos. Probalo.</h2>
          <p>Configurá el producto como si fuera parte de tu catálogo.</p>
        </header>
        <IndustrialConfigurator />
      </section>

      <IndustrialReveal>
        <section className={styles.connected}>
          <div className={styles.connectedCopy}>
            <span className={styles.eyebrow}>Sistema conectado</span>
            <h2>El 3D es solo la interfaz.</h2>
            <p>Detrás puede existir una plataforma conectada a ventas, precios, stock y producción.</p>
          </div>
          <div className={styles.engineNetwork} aria-label="Corsteno Product Engine conectado con sistemas comerciales">
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
            <strong>CORSTENO<br />PRODUCT ENGINE</strong>
            {engineNodes.map((node, index) => (
              <span key={node} style={{ "--node-index": index } as React.CSSProperties}>{node}</span>
            ))}
          </div>
        </section>
      </IndustrialReveal>

      <IndustrialReveal>
        <section className={`${styles.section} ${styles.dataSection}`}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Datos de producto</span>
            <h2>Cada configuración también genera información.</h2>
            <p>Ejemplos conceptuales del tipo de información que una implementación puede capturar.</p>
          </header>
          <div className={styles.dataGrid}>
            {dataSignals.map((signal, index) => (
              <article key={signal.title}>
                <span className={styles.dataIndex}>0{index + 1}</span>
                <h3>{signal.title}</h3>
                <p>{signal.body}</p>
                <div className={styles.dataBars} aria-hidden="true">
                  {signal.pattern.map((value, barIndex) => (
                    <span key={barIndex} style={{ "--bar-value": `${value}%` } as React.CSSProperties} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </IndustrialReveal>

      <IndustrialReveal>
        <section className={`${styles.section} ${styles.industries}`}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Aplicaciones</span>
            <h2>Una tecnología. Distintos productos.</h2>
          </header>
          <div className={styles.industryGrid}>
            {industries.map((industry, index) => (
              <article key={industry.title}>
                <span>0{index + 1}</span>
                <h3>{industry.title}</h3>
                <p>{industry.body}</p>
              </article>
            ))}
          </div>
        </section>
      </IndustrialReveal>

      <IndustrialReveal>
        <section className={`${styles.section} ${styles.process}`}>
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Proceso</span>
            <h2>De tu producto al navegador.</h2>
          </header>
          <ol className={styles.processList}>
            {process.map((step) => (
              <li key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </IndustrialReveal>

      <IndustrialReveal>
        <section className={`${styles.section} ${styles.engineSection}`}>
          <span className={styles.eyebrow}>CORSTENO ENGINE</span>
          <div>
            <h2>Una base para experiencias de producto interactivas.</h2>
            <p>Una capa tecnológica pensada para conectar visualización 3D, reglas de producto, datos e integraciones.</p>
            <div className={styles.engineSequence} aria-label="3D Engine, Product Logic, Data e Integrations">
              <span>3D Engine</span><b>→</b><span>Product Logic</span><b>→</b><span>Data</span><b>→</b><span>Integrations</span>
            </div>
            <small>Base interna de desarrollo · No es un producto SaaS independiente.</small>
          </div>
        </section>
      </IndustrialReveal>

      <section className={styles.finalCta} id="industrial-contact">
        <div>
          <span className={styles.eyebrow}>Iniciar exploración</span>
          <h2>¿Tu producto tiene variantes, materiales o configuraciones?</h2>
          <p>Podemos explorar cómo convertirlo en una experiencia digital.</p>
          <a href="#industrial-form">Contanos sobre tu producto</a>
        </div>
        <IndustrialLeadForm />
      </section>
    </main>
  );
}
