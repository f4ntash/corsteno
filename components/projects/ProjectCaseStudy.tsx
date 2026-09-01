import dynamic from "next/dynamic";
import ActionButton from "@/components/atoms/ActionButton";
import Eyebrow from "@/components/atoms/Eyebrow";
import ActionGroup from "@/components/molecules/ActionGroup";
import SectionHeading from "@/components/molecules/SectionHeading";
import Navigation from "@/components/Navigation";
import ContactSection from "@/components/organisms/ContactSection";
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

const InteriorFinishesProjectExperience = dynamic(() => import("./InteriorFinishesProjectExperience"));
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
  experience: "terrambu" | "mapa-punilla" | "interior-finishes" | "exterior-house";
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
  "revestimientos-interactivos": {
    category: "CORSTENO LAB · INTERIOR FINISHES 3D",
    description:
      "Explorá distintas combinaciones de pisos, paredes y terminaciones en tiempo real dentro de un ambiente 3D.",
    liveTitle: "Explorá los revestimientos",
    firstLabel: "El concepto",
    firstTitle: "Comparar antes de elegir.",
    firstBody:
      "La experiencia permite probar pisos, paredes, revestimientos de barra y aberturas directamente sobre un ambiente interior.",
    secondLabel: "Qué demuestra",
    secondTitle: "Revestimientos en contexto.",
    secondBody:
      "La demo combina variantes incluidas en el modelo, navegación 3D, controles táctiles, reinicio y pantalla completa sin convertir el mobiliario en una opción configurable.",
    capabilities: ["Interior Finishes", "Material Comparison", "Real-time 3D", "Three.js", "Interactive Web"],
    relatedHref: `${site.basePath}/servicios/visualizacion-3d/`,
    relatedLabel: "Ver visualización 3D",
    experience: "interior-finishes",
  },
  "exterior-house": {
    category: "CORSTENO LAB · ARCHITECTURAL 3D",
    description:
      "Una experiencia conceptual para explorar materiales y terminaciones de una pileta directamente desde el navegador.",
    liveTitle: "Probá el configurador",
    firstLabel: "El concepto",
    firstTitle: "Decidir materiales antes de construir.",
    firstBody:
      "Exterior House permite comparar agua, cascada, borde, interior y piso exterior sobre una pileta interactiva.",
    secondLabel: "Qué demuestra",
    secondTitle: "Terminaciones exteriores en contexto.",
    secondBody:
      "La demo combina variantes incluidas en el modelo, cambio de color del borde, navegación 3D, reinicio y pantalla completa.",
    capabilities: ["Architectural 3D", "Material Comparison", "Real-time 3D", "Three.js", "Interactive Web"],
    relatedHref: `${site.basePath}/servicios/visualizacion-3d/`,
    relatedLabel: "Ver visualización 3D",
    experience: "exterior-house",
  },
};

function ProjectExperience({ config }: { config: ProjectConfig }) {
  if (config.experience === "interior-finishes") return <InteriorFinishesProjectExperience />;
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
  const isThreeD = config.experience === "interior-finishes" || config.experience === "exterior-house";

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
          <Eyebrow className={styles.eyebrow}>{config.category}</Eyebrow>
          <h1>{page.h1}</h1>
          <p>{config.description}</p>
        </header>

        <section
          className={`${styles.liveSection}${isThreeD ? ` ${styles.liveSectionThreeD}` : ""}`}
          aria-labelledby="project-live-title"
          data-navbar-theme="light"
        >
          <SectionHeading
            className={styles.sectionHead}
            eyebrow="Experiencia live"
            eyebrowClassName={styles.eyebrow}
            title={config.liveTitle}
            titleId="project-live-title"
          />
          <ProjectExperience config={config} />
        </section>

        <section className={styles.caseStudy} data-navbar-theme="light">
          <article>
            <Eyebrow className={styles.eyebrow}>{config.firstLabel}</Eyebrow>
            <h2>{config.firstTitle}</h2>
            <p>{config.firstBody}</p>
          </article>
          <article>
            <Eyebrow className={styles.eyebrow}>{config.secondLabel}</Eyebrow>
            <h2>{config.secondTitle}</h2>
            <p>{config.secondBody}</p>
          </article>
        </section>

        <section className={styles.capabilities} aria-labelledby="project-capabilities-title" data-navbar-theme="light">
          <Eyebrow className={styles.eyebrow}>Capacidades</Eyebrow>
          <h2 id="project-capabilities-title">Tecnología aplicada con un objetivo concreto.</h2>
          <ul>
            {config.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>
          <ActionGroup className={styles.actions}>
            <ActionButton href={config.relatedHref}>{config.relatedLabel}</ActionButton>
            <ActionButton href={`${site.basePath}/#proyectos`}>Volver a proyectos</ActionButton>
            <ActionButton href="#contacto" data-analytics="cta">Contanos sobre tu proyecto</ActionButton>
          </ActionGroup>
        </section>
        <ContactSection />
      </main>
    </>
  );
}
