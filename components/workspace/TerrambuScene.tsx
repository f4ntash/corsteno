"use client";

import { useEffect, useState } from "react";
import LiveWebsiteFrame from "./LiveWebsiteFrame";
import { digitalProjects } from "./workspaceData";

type TerrambuSceneProps = {
  sceneStyle: React.CSSProperties;
  active: boolean;
  onSceneLink: (index: number) => void;
};

const websiteProjects = digitalProjects.filter((project) => project.type === "website");

export default function TerrambuScene({ sceneStyle, active, onSceneLink }: TerrambuSceneProps) {
  const [activeProjectId, setActiveProjectId] = useState<(typeof digitalProjects)[number]["id"]>(
    digitalProjects[0].id,
  );
  const activeProject = digitalProjects.find((project) => project.id === activeProjectId) ?? digitalProjects[0];

  useEffect(() => {
    const onProjectSelect = (event: Event) => {
      const projectId = (event as CustomEvent<{ projectId?: (typeof digitalProjects)[number]["id"] }>).detail.projectId;
      if (!projectId || !websiteProjects.some((project) => project.id === projectId)) return;
      setActiveProjectId(projectId);
    };

    window.addEventListener("forma3d:web-project", onProjectSelect);
    return () => window.removeEventListener("forma3d:web-project", onProjectSelect);
  }, []);

  return (
    <article
      className={`scene scene-terrambu dark${active ? " is-active" : ""}`}
      id="terrambu"
      data-project-scene="1"
      data-od-id="escena-terrambu"
      style={sceneStyle}
    >
      <div className="digital-project-content" key={activeProject.id}>
        {activeProject.type === "website" ? (
          <>
            <header className="scene-heading project-scene-heading project-context-heading motion-heading terrambu-motion-heading">
              <span className="scene-number">02 / Experiencia web</span>
              <span className="project-trust-label">{activeProject.trustLabel}</span>
              <h2 className="motion-title">{activeProject.title}</h2>
              <span className="kind">{activeProject.subtitle}</span>
              <span className="project-location">{activeProject.location}</span>
              <p className="project-context-copy">{activeProject.commercialContext}</p>
              <a className="contextual-cta dark" href="#contacto" data-service="web" data-cursor="Abrir">
                Quiero algo así ↗
              </a>
            </header>
            <LiveWebsiteFrame
              title={activeProject.title}
              url={activeProject.url}
              externalUrl={activeProject.externalUrl}
              projectSlug={activeProject.id}
              className="terrambu-project-frame"
            />
          </>
        ) : (
          <div className="digital-project-cta">
            <span className="scene-number">02 / Experiencia web</span>
            <h2>{activeProject.title}</h2>
            <p>
              Contanos qué querés mostrar, vender o hacer explorable.
              <br />
              Nosotros te ayudamos a darle forma.
            </p>
            <a href="#contacto">Contanos sobre tu producto ↗</a>
            <span className="digital-project-cta-meta">Web · 3D · Producto interactivo</span>
          </div>
        )}
      </div>
      <a
        className="scene-action"
        href="#product"
        data-scene-link="2"
        data-od-id="terrambu-siguiente"
        onClick={(event) => {
          event.preventDefault();
          onSceneLink(2);
        }}
      >
        Continuar →
      </a>
    </article>
  );
}
