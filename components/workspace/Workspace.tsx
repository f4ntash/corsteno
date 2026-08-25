"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import workspaceStyles from "@/styles/workspace.module.css";
import ContextCursor from "./ContextCursor";
import DigitalSystemScene from "./DigitalSystemScene";
import H2OScene from "./H2OScene";
import ProductScene from "./ProductScene";
import StepTransition from "./StepTransition";
import TerrambuScene from "./TerrambuScene";
import { digitalProjects, sceneCount } from "./workspaceData";
import type { ShowroomCategory, ShowroomProjectTarget } from "./workspaceData";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const mobileQuery = "(max-width:900px)";

type SceneMetrics = {
  opacity: number;
  x: number;
  y: number;
};

const dispatchChrome = (detail: { dark?: boolean; compact?: boolean }) => {
  window.dispatchEvent(new CustomEvent("forma3d:chrome", { detail }));
};

export default function Workspace() {
  const workspaceRef = useRef<HTMLElement>(null);
  const tickingRef = useRef(false);
  const currentSceneRef = useRef(0);
  const [currentScene, setCurrentScene] = useState(0);
  const [showroomCategory, setShowroomCategory] = useState<ShowroomCategory>("3d");
  const [activeWebProjectId, setActiveWebProjectId] = useState<(typeof digitalProjects)[number]["id"]>(
    digitalProjects[0].id,
  );
  const [sceneDirection, setSceneDirection] = useState<"forward" | "backward">("forward");
  const [rawScene, setRawScene] = useState(0);
  const [compact, setCompact] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  const dark = currentScene === 1 || currentScene === 3;
  const showroomGroupLabel = showroomCategory === "web"
    ? "Casos reales"
    : showroomCategory === "3d"
      ? "Experiencias / Demos Corsteno"
      : "Experiencias Corsteno";

  const sceneMetrics = useMemo<SceneMetrics[]>(
    () =>
      Array.from({ length: sceneCount }, (_, index) => {
        const distance = rawScene - index;
        const x = distance * viewport.width * 0.13;
        return {
          opacity: clamp(1 - Math.abs(distance) * 1.35, 0, 1),
          x,
          y: Math.abs(distance) * viewport.height * 0.035,
        };
      }),
    [rawScene, viewport],
  );

  const sceneStyle = useCallback(
    (index: number) => {
      const distance = Math.min(Math.abs(rawScene - index), 1);
      return ({
        "--scene-opacity": sceneMetrics[index].opacity.toFixed(3),
        "--scene-x": `${sceneMetrics[index].x}px`,
        "--scene-y": `${sceneMetrics[index].y}px`,
        "--scene-distance": distance.toFixed(3),
        "--scene-depth": `${distance * -72}px`,
        "--scene-scale": (1 - distance * 0.045).toFixed(4),
        "--title-scale": (1 + distance * 0.12).toFixed(4),
        "--title-track": `${-0.02 + distance * 0.035}em`,
        "--title-shift": `${distance * 38}px`,
        "--layer-a": `${-sceneMetrics[index].x * 0.42}px`,
        "--layer-b": `${sceneMetrics[index].x * 0.28}px`,
        "--layer-c": `${-sceneMetrics[index].x * 0.18}px`,
      }) as React.CSSProperties;
    },
    [rawScene, sceneMetrics],
  );

  const setScene = useCallback((index: number, raw = index) => {
    if (index !== currentSceneRef.current) {
      setSceneDirection(index > currentSceneRef.current ? "forward" : "backward");
      currentSceneRef.current = index;
      window.dispatchEvent(new CustomEvent("forma3d:project-view", { detail: { scene: index } }));
    }
    setShowroomCategory(index === 1 ? "web" : index === 3 ? "immersive" : "3d");
    setCurrentScene(index);
    setRawScene(raw);
    dispatchChrome({ dark: index === 1 || index === 3 });
  }, []);

  const updateWorkspace = useCallback(() => {
    tickingRef.current = false;
    const nextCompact = window.scrollY > 40;
    setCompact(nextCompact);
    dispatchChrome({ compact: nextCompact });
  }, []);

  const requestWorkspaceUpdate = useCallback(() => {
    if (tickingRef.current) return;
    window.requestAnimationFrame(updateWorkspace);
    tickingRef.current = true;
  }, [updateWorkspace]);

  const goToScene = useCallback((index: number) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    setScene(index, index);
    window.scrollTo({ top: workspace.offsetTop, behavior: "smooth" });
  }, [setScene]);

  const selectWebProject = useCallback((projectId: (typeof digitalProjects)[number]["id"]) => {
    setActiveWebProjectId(projectId);
    setScene(1, 1);
    window.dispatchEvent(new CustomEvent("forma3d:web-project", { detail: { projectId } }));
    const workspace = workspaceRef.current;
    if (workspace) window.scrollTo({ top: workspace.offsetTop, behavior: "smooth" });
  }, [setScene]);

  const openProject = useCallback(({ category, project }: ShowroomProjectTarget) => {
    if (category === "3d") {
      const scene = project === "atlas" ? 0 : project === "exterior-house" ? 2 : null;
      if (scene !== null) goToScene(scene);
      return;
    }

    if (category === "web") {
      const webProject = digitalProjects.find((item) => item.type === "website" && item.id === project);
      if (webProject) selectWebProject(webProject.id);
      return;
    }

    goToScene(3);
  }, [goToScene, selectWebProject]);

  useEffect(() => {
    dispatchChrome({ dark, compact });
  }, [dark, compact]);

  useEffect(() => {
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      requestWorkspaceUpdate();
    };

    setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("scroll", requestWorkspaceUpdate, { passive: true });
    window.addEventListener("resize", onResize);
    setScene(currentSceneRef.current, currentSceneRef.current);
    requestWorkspaceUpdate();
    return () => {
      window.removeEventListener("scroll", requestWorkspaceUpdate);
      window.removeEventListener("resize", onResize);
    };
  }, [requestWorkspaceUpdate, setScene]);

  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const scenes = Array.from(workspace.querySelectorAll<HTMLElement>("[data-project-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        if (!window.matchMedia(mobileQuery).matches) return;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.projectScene);
          setScene(index, index);
        });
      },
      { threshold: 0.45 },
    );

    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, [setScene]);

  useEffect(() => {
    const onShowroomScene = (event: Event) => {
      const detail = (event as CustomEvent<{ scene?: number } & Partial<ShowroomProjectTarget>>).detail;
      if (detail.category && detail.project) {
        openProject({ category: detail.category, project: detail.project });
        return;
      }

      const { scene } = detail;
      if (typeof scene === "number") goToScene(scene);
    };

    window.addEventListener("forma3d:showroom-scene", onShowroomScene);
    return () => window.removeEventListener("forma3d:showroom-scene", onShowroomScene);
  }, [goToScene, openProject]);

  return (
    <>
      <ContextCursor />
      <section className="showroom-intro" id="proyectos" data-navbar-theme="light">
        <span className="label">Proyectos</span>
        <h2>
          Trabajo real.
          <br />
          Experiencias interactivas.
        </h2>
        <p>Casos entregados a clientes y demos propias donde mostramos desarrollo web, visualización 3D e interacción.</p>
        <div className="showroom-trust-groups" aria-label="Tipos de proyectos">
          <span><strong>Casos reales</strong> Terrambú · Mapa Punilla</span>
          <span><strong>Demos Corsteno</strong> ATLAS · Exterior House</span>
        </div>
      </section>
      <section
        ref={workspaceRef}
        className={`workspace ${workspaceStyles.workspaceComponent}`}
        id="showroom-3d"
        data-od-id="workspace-trabajo"
        data-navbar-theme={dark ? "dark" : "light"}
      >
        <div className="workspace-stage" data-scene={currentScene + 1} data-od-id="escena-principal">
          <nav className={`showroom-nav${dark ? " dark" : ""}`} aria-label="Showroom">
            <div className="showroom-category-tabs" aria-label="Categorías">
              <button type="button" aria-current={showroomCategory === "3d" ? "true" : undefined} onClick={() => goToScene(currentScene === 2 ? 2 : 0)}>
                3D interactivo
              </button>
              <button type="button" aria-current={showroomCategory === "web" ? "true" : undefined} onClick={() => goToScene(1)}>
                Web
              </button>
              <button type="button" aria-current={showroomCategory === "immersive" ? "true" : undefined} onClick={() => goToScene(3)}>
                Inmersivo
              </button>
            </div>
            <div className="showroom-project-menu">
              <span className="showroom-project-group-label">{showroomGroupLabel}</span>
              <div className="showroom-project-tabs" aria-label={`${showroomGroupLabel}: proyectos`}>
                {showroomCategory === "3d" && (
                  <>
                    <button type="button" aria-current={currentScene === 0 ? "true" : undefined} onClick={() => goToScene(0)}>
                      01 ATLAS
                    </button>
                    <button type="button" aria-current={currentScene === 2 ? "true" : undefined} onClick={() => goToScene(2)}>
                      02 Exterior House
                    </button>
                  </>
                )}
                {showroomCategory === "web" && (
                  <>
                    {digitalProjects
                      .filter((project) => project.type === "website")
                      .map((project) => (
                        <button
                          key={project.id}
                          type="button"
                          aria-current={activeWebProjectId === project.id ? "true" : undefined}
                          onClick={() => selectWebProject(project.id)}
                        >
                          {project.number} {project.title}
                        </button>
                      ))}
                  </>
                )}
                {showroomCategory === "immersive" && <span>Próximamente</span>}
              </div>
            </div>
          </nav>
          <span className="axis axis-x" />
          <span className="axis axis-y" />
          <div className="stage-status label">Showroom · Proyectos reales</div>

          <StepTransition step={currentScene} direction={sceneDirection}>
            <H2OScene sceneStyle={sceneStyle(0)} active={sceneMetrics[0].opacity > 0.12} onSceneLink={goToScene} />
            <TerrambuScene sceneStyle={sceneStyle(1)} active={sceneMetrics[1].opacity > 0.12} onSceneLink={goToScene} />
            <ProductScene sceneStyle={sceneStyle(2)} active={sceneMetrics[2].opacity > 0.12} onSceneLink={goToScene} />
            <DigitalSystemScene sceneStyle={sceneStyle(3)} active={sceneMetrics[3].opacity > 0.12} />
          </StepTransition>
        </div>
      </section>
    </>
  );
}
