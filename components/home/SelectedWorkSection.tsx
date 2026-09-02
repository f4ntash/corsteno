import ActionButton from "@/components/atoms/ActionButton";
import SectionHeading from "@/components/molecules/SectionHeading";
import { withBasePath } from "@/lib/assetPath";
import styles from "./homeExperience.module.css";

const projects = [
  {
    id: "terrambu",
    label: "PROYECTO CLIENTE",
    title: "Terrambú",
    description: "Experiencia web para presentar el hotel, sus espacios y facilitar la consulta directa.",
    action: "Ver proyecto",
    image: withBasePath("/projects/terrambu-hotel-web.webp"),
    href: withBasePath("/proyectos/terrambu/"),
    className: styles.projectTerrambu,
    type: "client_project",
  },
  {
    id: "mapa-punilla",
    label: "PROYECTO CLIENTE",
    title: "Mapa Punilla",
    description: "Plataforma interactiva para organizar información territorial y explorar el Valle de Punilla.",
    action: "Ver proyecto",
    image: withBasePath("/projects/mapa-punilla-web.webp"),
    href: withBasePath("/proyectos/mapa-punilla/"),
    className: styles.projectMap,
    type: "client_project",
  },
  {
    id: "revestimientos-interactivos",
    label: "CORSTENO LAB",
    title: "Revestimientos Interactivos",
    description: "Comparación de pisos, paredes y terminaciones en un ambiente 3D.",
    action: "Explorar experiencia",
    image: withBasePath("/projects/revestimientos-interactivos.png"),
    href: withBasePath("/proyectos/revestimientos-interactivos/"),
    className: styles.projectFinishes,
    type: "corsteno_lab",
  },
  {
    id: "exterior-house",
    label: "CORSTENO LAB",
    title: "Revestimientos de exterior",
    description: "Configuración interactiva de pileta, agua y terminaciones exteriores.",
    action: "Explorar experiencia",
    image: withBasePath("/projects/exterior-house-3d.png"),
    href: withBasePath("/proyectos/exterior-house/"),
    className: styles.projectExterior,
    type: "corsteno_lab",
  },
];

export default function SelectedWorkSection() {
  return (
    <section className={`${styles.section} ${styles.workSection}`} id="proyectos" data-navbar-theme="light" data-nav-section="proyectos">
      <SectionHeading
        className={styles.sectionHead}
        eyebrow="Trabajo seleccionado"
        eyebrowClassName={styles.eyebrow}
        title="Trabajo seleccionado."
        description="Una selección de experiencias digitales, plataformas y productos interactivos."
        wrapContent
      />

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
              <span className={styles.projectDescription}>{project.description}</span>
              <span className={styles.projectAction}>{project.action} <span aria-hidden="true">→</span></span>
            </span>
          </a>
        ))}
      </div>
      <div className={styles.workCta}>
        <p>Veamos qué podríamos construir alrededor de tu producto.</p>
        <ActionButton href="#contacto" data-analytics="cta">Hablemos de tu proyecto</ActionButton>
      </div>
    </section>
  );
}
