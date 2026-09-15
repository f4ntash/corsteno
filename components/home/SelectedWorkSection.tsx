import type { CSSProperties } from "react";
import ActionButton from "@/components/atoms/ActionButton";
import SectionHeading from "@/components/molecules/SectionHeading";
import { withBasePath } from "@/lib/assetPath";
import type { HomeDictionary } from "@/lib/i18n";
import { localizedRoutes } from "@/lib/i18n/routes";
import { generatedProjects, projectHomeOrder } from "@/lib/projects";
import styles from "./homeExperience.module.css";

type ProjectCardCopy = { label: string; title: string; description: string; action: string; alt: string };
type ProjectCard = {
  id: string;
  image: string;
  imageSrcSet?: string;
  href: string;
  className: string;
  type: string;
  copyIndex?: number;
  copy?: ProjectCardCopy;
};

const fixedProjects: ProjectCard[] = [
  {
    id: "terrambu",
    image: withBasePath("/projects/terrambu-hotel-web.webp"),
    imageSrcSet: `${withBasePath("/projects/terrambu-hotel-web-480.webp")} 480w, ${withBasePath("/projects/terrambu-hotel-web-960.webp")} 960w, ${withBasePath("/projects/terrambu-hotel-web.webp")} 1425w`,
    href: withBasePath("/proyectos/terrambu/"),
    className: styles.projectTerrambu,
    type: "client_project",
    copyIndex: 0,
  },
  {
    id: "mapa-punilla",
    image: withBasePath("/projects/mapa-punilla-web.webp"),
    imageSrcSet: `${withBasePath("/projects/mapa-punilla-web-480.webp")} 480w, ${withBasePath("/projects/mapa-punilla-web-960.webp")} 960w, ${withBasePath("/projects/mapa-punilla-web.webp")} 1800w`,
    href: withBasePath("/proyectos/mapa-punilla/"),
    className: styles.projectMap,
    type: "client_project",
    copyIndex: 1,
  },
  {
    id: "revestimientos-interactivos",
    image: withBasePath("/projects/revestimientos-interactivos.png"),
    imageSrcSet: `${withBasePath("/projects/revestimientos-interactivos-480.webp")} 480w, ${withBasePath("/projects/revestimientos-interactivos.png")} 630w`,
    href: withBasePath("/proyectos/revestimientos-interactivos/"),
    className: styles.projectFinishes,
    type: "corsteno_lab",
    copyIndex: 2,
  },
  {
    id: "exterior-house",
    image: withBasePath("/projects/exterior-house-3d.png"),
    imageSrcSet: `${withBasePath("/projects/exterior-house-3d-480.webp")} 480w, ${withBasePath("/projects/exterior-house-3d.png")} 650w`,
    href: withBasePath("/proyectos/exterior-house/"),
    className: styles.projectExterior,
    type: "corsteno_lab",
    copyIndex: 3,
  },
];

function gridPlacement(index: number): CSSProperties {
  const originalPlacements = ["1 / 8", "8 / 13", "1 / 6", "6 / 13"];
  const gridColumn = originalPlacements[index] ?? (index % 2 === 0 ? "1 / 7" : "7 / 13");
  const gridRow = String(Math.floor(index / 2) + 1);
  return { "--project-grid-column": gridColumn, "--project-grid-row": gridRow } as CSSProperties;
}

export default function SelectedWorkSection({ dictionary: t }: { dictionary: HomeDictionary }) {
  const english = t.locale === "en";
  const cardsById = new Map<string, ProjectCard>(fixedProjects.map((project) => [project.id, project]));

  for (const project of generatedProjects) {
    if (!projectHomeOrder.includes(project.slug)) continue;
    const copy = english ? project.copy.en : project.copy.es;
    const route = localizedRoutes.projects[project.slug];
    const isLab = project.kind === "corsteno-lab";
    cardsById.set(project.slug, {
      id: project.slug,
      image: withBasePath(project.image),
      href: withBasePath(route[english ? "en" : "es"]),
      className: styles.projectGenerated,
      type: isLab ? "corsteno_lab" : "client_project",
      copy: {
        label: isLab ? "CORSTENO LAB" : english ? "CLIENT PROJECT" : "PROYECTO CLIENTE",
        title: copy.name,
        description: copy.cardDescription,
        action: isLab ? (english ? "Explore experience" : "Explorar experiencia") : (english ? "View project" : "Ver proyecto"),
        alt: project.imageAlt[english ? "en" : "es"],
      },
    });
  }

  const projects = projectHomeOrder
    .map((id) => cardsById.get(id))
    .filter((project): project is ProjectCard => project !== undefined);

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
          const copy = project.copy ?? t.projects.items[project.copyIndex ?? 0];
          return (
          <a
            className={`${styles.projectItem} ${project.className}`}
            style={gridPlacement(index)}
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
