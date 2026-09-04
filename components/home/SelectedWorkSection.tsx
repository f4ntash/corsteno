import ActionButton from "@/components/atoms/ActionButton";
import SectionHeading from "@/components/molecules/SectionHeading";
import { withBasePath } from "@/lib/assetPath";
import type { HomeDictionary } from "@/lib/i18n";
import styles from "./homeExperience.module.css";

const projects = [
  {
    id: "terrambu",
    image: withBasePath("/projects/terrambu-hotel-web.webp"),
    imageSrcSet: `${withBasePath("/projects/terrambu-hotel-web-480.webp")} 480w, ${withBasePath("/projects/terrambu-hotel-web-960.webp")} 960w, ${withBasePath("/projects/terrambu-hotel-web.webp")} 1425w`,
    href: withBasePath("/proyectos/terrambu/"),
    className: styles.projectTerrambu,
    type: "client_project",
  },
  {
    id: "mapa-punilla",
    image: withBasePath("/projects/mapa-punilla-web.webp"),
    imageSrcSet: `${withBasePath("/projects/mapa-punilla-web-480.webp")} 480w, ${withBasePath("/projects/mapa-punilla-web-960.webp")} 960w, ${withBasePath("/projects/mapa-punilla-web.webp")} 1800w`,
    href: withBasePath("/proyectos/mapa-punilla/"),
    className: styles.projectMap,
    type: "client_project",
  },
  {
    id: "revestimientos-interactivos",
    image: withBasePath("/projects/revestimientos-interactivos.png"),
    imageSrcSet: `${withBasePath("/projects/revestimientos-interactivos-480.webp")} 480w, ${withBasePath("/projects/revestimientos-interactivos.png")} 630w`,
    href: withBasePath("/proyectos/revestimientos-interactivos/"),
    className: styles.projectFinishes,
    type: "corsteno_lab",
  },
  {
    id: "exterior-house",
    image: withBasePath("/projects/exterior-house-3d.png"),
    imageSrcSet: `${withBasePath("/projects/exterior-house-3d-480.webp")} 480w, ${withBasePath("/projects/exterior-house-3d.png")} 650w`,
    href: withBasePath("/proyectos/exterior-house/"),
    className: styles.projectExterior,
    type: "corsteno_lab",
  },
];

export default function SelectedWorkSection({ dictionary: t }: { dictionary: HomeDictionary }) {
  return (
    <section className={`${styles.section} ${styles.workSection}`} id="proyectos" data-navbar-theme="light" data-nav-section="proyectos">
      <SectionHeading
        className={styles.sectionHead}
        eyebrow={t.projects.eyebrow}
        eyebrowClassName={styles.eyebrow}
        title={t.projects.title}
        description={t.projects.description}
        wrapContent
      />

      <div className={styles.projectGrid}>
        {projects.map((project, index) => {
          const copy = t.projects.items[index];
          return (
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
              <img
                src={project.image}
                srcSet={project.imageSrcSet}
                sizes="(max-width: 900px) calc(100vw - 40px), 50vw"
                alt={copy.alt}
                width="650"
                height="300"
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className={styles.projectCopy}>
              <small>{copy.label}</small>
              <strong>{copy.title}</strong>
              <span className={styles.projectDescription}>{copy.description}</span>
              <span className={styles.projectAction}>{copy.action} <span aria-hidden="true">→</span></span>
            </span>
          </a>
          );
        })}
      </div>
      <div className={styles.workCta}>
        <p>{t.projects.closing}</p>
        <ActionButton href="#contacto" data-analytics="cta">{t.projects.cta}</ActionButton>
      </div>
    </section>
  );
}
