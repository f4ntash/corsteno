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
import type { Locale } from "@/lib/i18n";
import { enHome } from "@/lib/i18n/en/home";
import { englishProjects } from "@/lib/i18n/en/projects";
import { localizedRoutes } from "@/lib/i18n/routes";

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
  relatedHref: string;
  relatedLabel: string;
  commercialQuestion: string;
  commercialCta: string;
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
    relatedHref: `${site.basePath}/servicios/desarrollo-web/`,
    relatedLabel: "Ver desarrollo web",
    commercialQuestion: "¿Querés aplicar algo así a tu negocio?",
    commercialCta: "Hablemos de tu proyecto",
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
    relatedHref: `${site.basePath}/servicios/desarrollo-web/`,
    relatedLabel: "Ver desarrollo web",
    commercialQuestion: "¿Querés aplicar algo así a tu negocio?",
    commercialCta: "Hablemos de tu proyecto",
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
    relatedHref: `${site.basePath}/servicios/visualizacion-3d/`,
    relatedLabel: "Ver visualización 3D",
    commercialQuestion: "¿Querés aplicar algo así a tu negocio?",
    commercialCta: "Hablemos de tu proyecto",
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
    relatedHref: `${site.basePath}/servicios/visualizacion-3d/`,
    relatedLabel: "Ver visualización 3D",
    commercialQuestion: "¿Querés aplicar algo así a tu negocio?",
    commercialCta: "Hablemos de tu proyecto",
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

export default function ProjectCaseStudy({ page, locale = "es" }: { page: SeoPage; locale?: Locale }) {
  const config = projectConfigs[page.slug];
  if (!config) return null;
  const english = locale === "en";
  const copy = english ? englishProjects[page.slug as keyof typeof englishProjects] : config;
  const route = localizedRoutes.projects[page.slug as keyof typeof localizedRoutes.projects];
  const relatedHref = english
    ? (page.slug === "terrambu" || page.slug === "mapa-punilla" ? `${site.basePath}/en/services/web-development/` : `${site.basePath}/en/services/interactive-3d-visualization/`)
    : config.relatedHref;
  const isThreeD = config.experience === "interior-finishes" || config.experience === "exterior-house";


  const breadcrumbItems = [
    { label: english ? "Home" : "Inicio", href: `${site.basePath}/${english ? "en/" : ""}` },
    { label: english ? "Projects" : "Proyectos", href: `${site.basePath}/${english ? "en/" : ""}#proyectos` },
    { label: page.h1, href: `${site.basePath}${page.path}/` },
  ];

  return (
    <>
      {route ? <Navigation locale={locale} dictionary={english ? enHome : undefined} languageHref={english ? route.es : route.en} homePathPrefix={english ? "/en" : undefined} /> : <Navigation />}
      <JsonLd data={organizationJsonLd(locale)} />
      <JsonLd data={projectJsonLd(page)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <main className={styles.page} id="main-content">
        <header className={styles.hero} id="inicio" data-navbar-theme="light">
          <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <a href={`${site.basePath}/${english ? "en/" : ""}#proyectos`}>← {english ? "Back to projects" : "Volver a proyectos"}</a>
          </nav>
          <Eyebrow className={styles.eyebrow}>{copy.category}</Eyebrow>
          <h1>{page.h1}</h1>
          <p>{copy.description}</p>
        </header>

        <section
          className={`${styles.liveSection}${isThreeD ? ` ${styles.liveSectionThreeD}` : ""}`}
          aria-labelledby="project-live-title"
          data-navbar-theme="light"
        >
          <SectionHeading
            className={styles.sectionHead}
            eyebrow={english ? "Live experience" : "Experiencia live"}
            eyebrowClassName={styles.eyebrow}
            title={copy.liveTitle}
            titleId="project-live-title"
          />
          <ProjectExperience config={config} />
        </section>

        <section className={styles.caseStudy} data-navbar-theme="light">
          <article>
            <Eyebrow className={styles.eyebrow}>{copy.firstLabel}</Eyebrow>
            <h2>{copy.firstTitle}</h2>
            <p>{copy.firstBody}</p>
          </article>
          <article>
            <Eyebrow className={styles.eyebrow}>{copy.secondLabel}</Eyebrow>
            <h2>{copy.secondTitle}</h2>
            <p>{copy.secondBody}</p>
          </article>
        </section>

        <div className={styles.caseActions} data-navbar-theme="light">
          <div className={styles.commercialCta}>
            <p>{copy.commercialQuestion}</p>
            <ActionButton href="#contacto" data-analytics="project_contact_click" data-project={page.slug}>{copy.commercialCta}</ActionButton>
          </div>
          <ActionGroup className={styles.actions}>
            <ActionButton href={relatedHref}>{copy.relatedLabel}</ActionButton>
            <ActionButton href={`${site.basePath}/${english ? "en/" : ""}#proyectos`}>{english ? "Back to projects" : "Volver a proyectos"}</ActionButton>
          </ActionGroup>
        </div>
        <ContactSection locale={locale} dictionary={english ? enHome : undefined} />
      </main>
    </>
  );
}
