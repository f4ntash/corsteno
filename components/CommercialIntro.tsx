"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/assetPath";
import DigitalLayerSection from "./home/DigitalLayerSection";
import ProcessComparisonSection from "./home/ProcessComparisonSection";
import type { ShowroomProjectTarget } from "./workspace/workspaceData";
import { trackEvent } from "@/lib/analytics";

const TERRAMBU_IMAGE_URL = withBasePath("/projects/terrambu-hotel-web.webp");
const MAPA_PUNILLA_IMAGE_URL = withBasePath("/projects/mapa-punilla-web.webp");
const SHOWROOM_3D_IMAGE_URL = withBasePath("/projects/corsteno-showroom-3d.webp");

const featuredProjects = [
  {
    id: "terrambu",
    title: "Terrambú",
    category: "Experiencia web",
    trustLabel: "CLIENT PROJECT · WEB DEVELOPMENT",
    image: TERRAMBU_IMAGE_URL,
    alt: "Sitio web para hotel boutique Terrambú desarrollado por Corsteno",
    target: { category: "web", project: "terrambu" },
  },
  {
    id: "mapa-punilla",
    title: "Mapa Punilla",
    category: "Plataforma interactiva",
    trustLabel: "CLIENT PROJECT · INTERACTIVE PLATFORM",
    image: MAPA_PUNILLA_IMAGE_URL,
    alt: "Plataforma web Mapa Punilla desarrollada por Corsteno",
    target: { category: "web", project: "mapa-punilla" },
  },
  {
    id: "atlas",
    title: "ATLAS",
    category: "Showroom digital",
    trustLabel: "CORSTENO LAB · 3D PRODUCT CONFIGURATOR",
    image: SHOWROOM_3D_IMAGE_URL,
    alt: "Configurador 3D interactivo ATLAS desarrollado por Corsteno",
    target: { category: "3d", project: "atlas" },
  },
] satisfies Array<{
  id: string;
  title: string;
  category: string;
  trustLabel: string;
  image: string;
  alt: string;
  target: ShowroomProjectTarget;
}>;

const projectAnchors: Record<string, string> = {
  "3d:atlas": "project-atlas",
  "web:terrambu": "project-terrambu",
  "web:mapa-punilla": "project-mapa-punilla",
};

export default function CommercialIntro() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredProject = featuredProjects[featuredIndex];
  const secondaryProjects = featuredProjects.filter((_, index) => index !== featuredIndex);

  useEffect(() => {
    setFeaturedIndex(Math.floor(Math.random() * featuredProjects.length));
  }, []);

  const openProject = ({ category, project }: ShowroomProjectTarget) => {
    const anchor = projectAnchors[`${category}:${project}`];
    const projectElement = anchor ? document.getElementById(anchor) : null;
    if (!projectElement) return;

    trackEvent("project_opened", {
      project_slug: project,
      project_type: category === "web" ? "client_project" : "corsteno_lab",
    });
    window.history.replaceState(null, "", `#${anchor}`);
    projectElement.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <section className="commercial-hero" id="inicio" data-od-id="que-hacemos" data-navbar-theme="light">
        <div className="commercial-hero-copy">
          <span className="label">Experiencias digitales para productos, marcas y negocios</span>
          <h1>
            Hacemos que tus productos
            <br />
            se puedan ver, probar y
            <br />
            entender antes de comprarlos.
          </h1>
          <p>
            Creamos configuradores 3D, experiencias interactivas y productos web que transforman cómo las empresas
            presentan, personalizan y venden.
          </p>
          <ul className="commercial-hero-services" aria-label="Servicios principales">
            <li>Configuradores 3D</li>
            <li>Experiencias digitales</li>
            <li>Desarrollo web</li>
          </ul>
          <div className="commercial-actions">
            <a className="commercial-action-primary" href="#contacto">Contanos sobre tu producto</a>
            <a className="commercial-action-secondary" href="#proyectos">Ver proyectos</a>
          </div>
          <div className="commercial-proof" aria-label="Áreas de trabajo">
            <span>3D</span>
            <span>Interacción</span>
            <span>Web</span>
          </div>
        </div>
        <div className="commercial-hero-visual" aria-label="Proyectos de Corsteno">
          <button
            type="button"
            className="hero-project-link hero-project-primary"
            aria-label={`Ver ${featuredProject.title} en proyectos`}
            onClick={() => openProject(featuredProject.target)}
          >
            <span className="hero-project">
              <img src={featuredProject.image} alt={featuredProject.alt} />
              <span className="hero-project-caption">
                <span>{featuredProject.category} · {featuredProject.title}</span>
                <span className="project-trust-label">{featuredProject.trustLabel}</span>
              </span>
            </span>
          </button>
          {secondaryProjects.map((project) => (
            <button
              type="button"
              className="hero-project-link hero-project-secondary"
              key={project.id}
              aria-label={`Ver ${project.title} en proyectos`}
              onClick={() => openProject(project.target)}
            >
              <span className="hero-project">
                <img src={project.image} alt={project.alt} />
                <span className="hero-project-caption">
                  <span>{project.category} · {project.title}</span>
                  <span className="project-trust-label">{project.trustLabel}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <ProcessComparisonSection />
      <DigitalLayerSection />
    </>
  );
}
