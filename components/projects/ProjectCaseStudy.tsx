import dynamic from "next/dynamic";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import JsonLd from "@/components/seo/JsonLd";
import LiveWebsiteFrame from "@/components/workspace/LiveWebsiteFrame";
import { digitalProjects } from "@/components/workspace/workspaceData";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  projectJsonLd,
  site,
  type SeoPage,
} from "@/lib/seo";
import styles from "./projectCaseStudy.module.css";

const H2OProjectExperience = dynamic(() => import("./H2OProjectExperience"));
const ExteriorHouseProjectExperience = dynamic(() => import("./ExteriorHouseProjectExperience"));

type ProjectConfig = {
  category: string;
  description: string;
  liveTitle: string;
  firstLabel: string;
  firstTitle: string;
  firstBody: string;
  secondLabel: string;
  secondTitle: string;
  secondBody: string;
  capabilities: string[];
  relatedHref: string;
  relatedLabel: string;
  experience: "terrambu" | "mapa-punilla" | "h2o" | "exterior-house";
};

const projectConfigs: Record<string, ProjectConfig> = {
  terrambu: {
    category: "CLIENT PROJECT · WEB DEVELOPMENT",
    description:
      "Una experiencia web responsive centrada en la identidad, el contenido visual y la información necesaria para conocer el hotel y avanzar hacia una reserva o contacto.",
    liveTitle: "Explorá el proyecto",
    firstLabel: "El desafío",
    firstTitle: "Conocer el hotel antes de visitarlo.",
    firstBody:
      "Presentar habitaciones, gastronomía y entorno dentro de una experiencia clara y visual, sin perder la identidad propia del hotel.",
    secondLabel: "La solución",
    secondTitle: "La identidad del lugar, llevada al navegador.",
    secondBody:
      "Diseñamos y desarrollamos una experiencia responsive centrada en contenido visual, exploración de habitaciones y acceso claro a la información del hotel.",
    capabilities: ["UX/UI", "React / Next.js", "Responsive", "Performance", "SEO"],
    relatedHref: `${site.basePath}/servicios/desarrollo-web/`,
    relatedLabel: "Ver desarrollo web",
    experience: "terrambu",
  },
  "mapa-punilla": {
    category: "CLIENT PROJECT · INTERACTIVE PLATFORM",
    description:
      "Una plataforma basada en mapas que transforma información territorial en una experiencia visual y explorable.",
    liveTitle: "Explorá el proyecto",
    firstLabel: "El desafío",
    firstTitle: "Organizar un territorio para poder explorarlo.",
    firstBody:
      "Reunir lugares y puntos de interés del Valle de Punilla dentro de una experiencia visual que facilite descubrirlos.",
    secondLabel: "La solución",
    secondTitle: "El territorio como producto digital.",
    secondBody:
      "Desarrollamos una plataforma interactiva basada en mapas, estructura de datos y una interfaz responsive para explorar información territorial.",
    capabilities: ["Interactive Map", "UX/UI", "Data", "Web Development", "Responsive"],
    relatedHref: `${site.basePath}/servicios/desarrollo-web/`,
    relatedLabel: "Ver desarrollo web",
    experience: "mapa-punilla",
  },
  h2o: {
    category: "CORSTENO LAB · 3D PRODUCT CONFIGURATOR",
    description:
      "Un concepto desarrollado por Corsteno para explorar cómo un producto físico puede convertirse en una experiencia personalizable directamente desde el navegador.",
    liveTitle: "Probá el configurador",
    firstLabel: "El concepto",
    firstTitle: "Un catálogo que responde al cliente.",
    firstBody:
      "ATLAS convierte la exploración de un producto en una experiencia donde materiales y variantes reaccionan en tiempo real.",
    secondLabel: "Qué demuestra",
    secondTitle: "Personalización directamente en la web.",
    secondBody:
      "La demo combina producto 3D, controles de cámara, lógica de variantes, materiales, reinicio y pantalla completa sin afirmar un cliente asociado.",
    capabilities: ["Real-time 3D", "Materials", "Variants", "Product Logic", "WebGL"],
    relatedHref: `${site.basePath}/servicios/configuradores-3d/`,
    relatedLabel: "Ver configuradores 3D",
    experience: "h2o",
  },
  "exterior-house": {
    category: "CORSTENO LAB · ARCHITECTURAL 3D",
    description:
      "Una experiencia conceptual para explorar cómo arquitectura, terminaciones y materiales pueden visualizarse y compararse directamente desde el navegador.",
    liveTitle: "Explorá el proyecto",
    firstLabel: "El concepto",
    firstTitle: "Decidir antes de construir.",
    firstBody:
      "Exterior House explora cómo una propuesta arquitectónica puede comunicar terminaciones y alternativas antes de existir físicamente.",
    secondLabel: "Qué demuestra",
    secondTitle: "Arquitectura y materiales en tiempo real.",
    secondBody:
      "La demo integra navegación 3D, configuración de materiales, controles táctiles, reinicio y pantalla completa dentro de una experiencia web.",
    capabilities: ["Archviz", "Material Configuration", "Real-time 3D", "Three.js", "Interactive Web"],
    relatedHref: `${site.basePath}/servicios/visualizacion-3d/`,
    relatedLabel: "Ver visualización 3D",
    experience: "exterior-house",
  },
};

function ProjectExperience({ config }: { config: ProjectConfig }) {
  if (config.experience === "h2o") return <H2OProjectExperience />;
  if (config.experience === "exterior-house") return <ExteriorHouseProjectExperience />;

  const project = digitalProjects.find((item) => item.id === config.experience);
  if (!project || project.type !== "website") return null;

  return (
    <LiveWebsiteFrame
      className={styles.webExperience}
      title={project.title}
      url={project.url}
      externalUrl={project.externalUrl}
      projectSlug={project.id}
    />
  );
}

export default function ProjectCaseStudy({ page }: { page: SeoPage }) {
  const config = projectConfigs[page.slug];
  if (!config) return null;
  const isThreeD = config.experience === "h2o" || config.experience === "exterior-house";

  const breadcrumbItems = [
    { label: "Inicio", href: `${site.basePath}/` },
    { label: "Proyectos", href: `${site.basePath}/#proyectos` },
    { label: page.h1, href: `${site.basePath}${page.path}/` },
  ];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={projectJsonLd(page)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <Navigation />
      <main className={styles.page} id="main-content">
        <header className={styles.hero} id="inicio" data-navbar-theme="light">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <a href={`${site.basePath}/#proyectos`}>← Volver a proyectos</a>
          </nav>
          <span className={styles.eyebrow}>{config.category}</span>
          <h1>{page.h1}</h1>
          <p>{config.description}</p>
        </header>

        <section
          className={`${styles.liveSection}${isThreeD ? ` ${styles.liveSectionThreeD}` : ""}`}
          aria-labelledby="project-live-title"
          data-navbar-theme="light"
        >
          <header className={styles.sectionHead}>
            <span className={styles.eyebrow}>Experiencia live</span>
            <h2 id="project-live-title">{config.liveTitle}</h2>
          </header>
          <ProjectExperience config={config} />
        </section>

        <section className={styles.caseStudy} data-navbar-theme="light">
          <article>
            <span className={styles.eyebrow}>{config.firstLabel}</span>
            <h2>{config.firstTitle}</h2>
            <p>{config.firstBody}</p>
          </article>
          <article>
            <span className={styles.eyebrow}>{config.secondLabel}</span>
            <h2>{config.secondTitle}</h2>
            <p>{config.secondBody}</p>
          </article>
        </section>

        <section className={styles.capabilities} aria-labelledby="project-capabilities-title" data-navbar-theme="light">
          <span className={styles.eyebrow}>Capacidades</span>
          <h2 id="project-capabilities-title">Tecnología aplicada con un objetivo concreto.</h2>
          <ul>
            {config.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
          <div className={styles.actions}>
            <a href={config.relatedHref}>{config.relatedLabel}</a>
            <a href={`${site.basePath}/#proyectos`}>Volver a proyectos</a>
            <a href="#contacto" data-analytics="cta">Contanos sobre tu proyecto</a>
          </div>
        </section>
        <Contact />
      </main>
    </>
  );
}
