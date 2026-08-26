import { withBasePath } from "@/lib/assetPath";
import styles from "./homeExperience.module.css";

const projects = [
  {
    id: "terrambu",
    label: "CLIENT PROJECT",
    title: "Terrambú",
    description: "Sitio web para hotel boutique y restaurante.",
    image: withBasePath("/projects/terrambu-hotel-web.webp"),
    href: withBasePath("/proyectos/terrambu/"),
    className: styles.projectTerrambu,
    type: "client_project",
  },
  {
    id: "mapa-punilla",
    label: "CLIENT PROJECT",
    title: "Mapa Punilla",
    description: "Plataforma interactiva para descubrir el Valle de Punilla.",
    image: withBasePath("/projects/mapa-punilla-web.webp"),
    href: withBasePath("/proyectos/mapa-punilla/"),
    className: styles.projectMap,
    type: "client_project",
  },
  {
    id: "exterior-house",
    label: "CORSTENO LAB",
    title: "Exterior House",
    description: "Exploración arquitectónica interactiva en navegador.",
    image: withBasePath("/projects/exterior-house-3d.png"),
    href: withBasePath("/proyectos/exterior-house/"),
    className: styles.projectExterior,
    type: "corsteno_lab",
  },
  {
    id: "atlas",
    label: "CORSTENO LAB",
    title: "ATLAS",
    description: "Configuración de materiales y variantes en tiempo real.",
    image: withBasePath("/projects/corsteno-showroom-3d.webp"),
    href: withBasePath("/proyectos/h2o/"),
    className: styles.projectAtlas,
    type: "corsteno_lab",
  },
];

export default function SelectedWorkSection() {
  return (
    <section className={`${styles.section} ${styles.workSection}`} id="proyectos" data-navbar-theme="light">
      <header className={styles.sectionHead}>
        <span className={styles.eyebrow}>Trabajo seleccionado</span>
        <div>
          <h2>Trabajo seleccionado.</h2>
          <p>Una selección de experiencias digitales, plataformas y productos interactivos.</p>
        </div>
      </header>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <a
            className={`${styles.projectItem} ${project.className}`}
            id={`project-${project.id}`}
            href={project.href}
            key={project.id}
            data-analytics="project_opened"
            data-project={project.id}
            data-project-type={project.type}
          >
            <span className={styles.projectMedia}>
              <img src={project.image} alt={`Preview de ${project.title}`} loading="lazy" decoding="async" />
            </span>
            <span className={styles.projectCopy}>
              <small>{project.label}</small>
              <strong>{project.title}</strong>
              <span>{project.description}</span>
            </span>
          </a>
        ))}
      </div>
      <div className={styles.workCta}>
        <p>Veamos qué podríamos construir alrededor de tu producto.</p>
        <a href="#contacto" data-analytics="cta">Hablemos de tu proyecto</a>
      </div>
    </section>
  );
}
