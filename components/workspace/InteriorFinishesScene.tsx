"use client";

import { useEffect, useRef, useState } from "react";
import InteriorFinishesViewer, {
  type InteriorFinishesViewerHandle,
} from "@/components/three/InteriorFinishesViewer";
import {
  DEFAULT_INTERIOR_FINISHES,
  INTERIOR_FINISH_GROUPS,
  getInteriorFinishOption,
  updateInteriorFinish,
  type InteriorFinishGroupId,
  type InteriorFinishValue,
} from "@/components/three/interiorFinishVariants";

type InteriorFinishesSceneProps = {
  sceneStyle: React.CSSProperties;
  active: boolean;
  onSceneLink: (index: number) => void;
  presentation?: "default" | "project";
};

export default function InteriorFinishesScene({
  sceneStyle,
  active,
  onSceneLink,
  presentation = "default",
}: InteriorFinishesSceneProps) {
  const slotRef = useRef<HTMLElement>(null);
  const viewerRef = useRef<InteriorFinishesViewerHandle>(null);
  const renderStateRef = useRef("idle");
  const [renderState, setRenderState] = useState("idle");
  const [engaged, setEngaged] = useState(false);
  const [variants, setVariants] = useState({ ...DEFAULT_INTERIOR_FINISHES });
  const [activeGroupId, setActiveGroupId] = useState<InteriorFinishGroupId>("bar");
  const [fullscreenSupported, setFullscreenSupported] = useState(true);

  const activeGroup = INTERIOR_FINISH_GROUPS.find((group) => group.id === activeGroupId)!;
  const activeOption = getInteriorFinishOption(activeGroup, variants);

  useEffect(() => {
    setFullscreenSupported(Boolean(slotRef.current?.requestFullscreen));
  }, []);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    slot.dataset.renderActive = String(active);
    slot.dispatchEvent(new CustomEvent("forma3d:render-visibility", { detail: { active } }));
    if (!active || renderStateRef.current !== "idle") return;

    renderStateRef.current = "loading";
    setRenderState("loading");
    let completed = false;
    const readyTimeout = window.setTimeout(() => {
      completed = true;
      renderStateRef.current = "ready";
      setRenderState("ready");
      slot.dispatchEvent(new CustomEvent("forma3d:mount-ready"));
    }, 520);

    return () => {
      window.clearTimeout(readyTimeout);
      if (!completed) renderStateRef.current = "idle";
    };
  }, [active]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, [number, number]> = {
      ArrowLeft: [0, -6],
      ArrowRight: [0, 6],
      ArrowUp: [-4, 0],
      ArrowDown: [4, 0],
    };
    const change = keys[event.key];
    if (!change) return;
    event.preventDefault();
    setEngaged(true);
    viewerRef.current?.nudge(change[1] * 0.016, change[0] * 0.016);
  };

  const toggleFullscreen = () => {
    const slot = slotRef.current;
    if (!slot?.requestFullscreen) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void slot.requestFullscreen();
  };

  const selectVariant = (groupId: InteriorFinishGroupId, value: InteriorFinishValue) => {
    setVariants((current) => updateInteriorFinish(current, groupId, value));
    setActiveGroupId(groupId);
  };

  const resetExperience = () => {
    setVariants({ ...DEFAULT_INTERIOR_FINISHES });
    setActiveGroupId("bar");
  };

  return (
    <article
      className={`scene scene-product is-interior-finishes-config${active ? " is-active" : ""}`}
      id="interior-finishes"
      data-project-scene="0"
      data-od-id="escena-producto"
      style={sceneStyle}
    >
      <section
        ref={slotRef}
        className="three-slot"
        data-three-slot="product-configurator"
        data-render-state={renderState}
        data-engaged={engaged ? "true" : undefined}
        aria-label="Configurador 3D de revestimientos interiores"
        aria-describedby="interior-finishes-accessible-description"
        data-od-id="producto-three-slot"
      >
        <div
          className="canvas-mount"
          tabIndex={0}
          aria-label="Explorá el ambiente arrastrando o usando las flechas del teclado"
          data-canvas-mount="product-configurator"
          data-cursor="Rotar"
          onPointerDown={() => setEngaged(true)}
          onKeyDown={onKeyDown}
        >
          <p id="interior-finishes-accessible-description" className="visually-hidden">
            Experiencia 3D interactiva para comparar revestimientos de barra, pisos, paredes y aberturas.
          </p>
          <div className="slot-loading">Preparando ambiente</div>
          <div className="interior-finishes-layout">
            <aside className="interior-finishes-detail" aria-live="polite" aria-label="Detalle del revestimiento seleccionado">
              <div className="demo-panel-intro">
                <span className="scene-number">01 / 03</span>
                <span className="project-trust-label">CORSTENO LAB · INTERIOR FINISHES 3D</span>
                <span className="kind">Modifica el espacio a tu medida</span>
                <h2 data-od-id="producto-titulo">Revestimientos Interactivos</h2>
              </div>
              <span className="interior-finishes-detail-group">{activeGroup.label}</span>
              <h3>{activeOption.label}</h3>
              <p>{activeOption.description}</p>
              <dl>
                {activeOption.details.map((detail) => (
                  <div key={detail.label}>
                    <dt>{detail.label}</dt>
                    <dd>{detail.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="panel-commercial-copy">Compará revestimientos antes de definir el proyecto.</p>
              <a className="contextual-cta" href="#contacto" data-service="revestimientos-3d" data-cursor="Abrir">
                Quiero algo así ↗
              </a>
            </aside>

            <div className="interior-finishes-render-column">
              <div className="interior-finishes-render-stage">
                {active ? (
                  <InteriorFinishesViewer ref={viewerRef} variants={variants} presentation={presentation} />
                ) : null}
              </div>
              <span className="drag-hint">Arrastrar · Rotar</span>
            </div>

            <aside className="interior-finishes-panel" aria-label="Configuración de revestimientos interiores">
              <div className="interior-finishes-variant-panel">
                {INTERIOR_FINISH_GROUPS.map((group) => (
                  <div className="interior-finishes-variant-group" key={group.id}>
                    <span className="interior-finishes-variant-label">{group.label}</span>
                    <div className="interior-finishes-variant-options">
                      {group.options.map((option) => (
                        <button
                          key={option.id}
                          className="interior-finishes-variant-button"
                          type="button"
                          aria-pressed={variants[group.id] === option.value}
                          aria-label={`${group.label}: ${option.label}`}
                          onClick={() => selectVariant(group.id, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="slot-controls">
                <button className="quiet-button reset-button" type="button" onClick={resetExperience}>
                  Reiniciar
                </button>
                <button
                  className="quiet-button fullscreen-button"
                  type="button"
                  disabled={!fullscreenSupported}
                  onClick={toggleFullscreen}
                >
                  Ampliar ↗
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <a
        className="scene-action"
        href="#terrambu"
        data-scene-link="1"
        data-od-id="producto-siguiente"
        onClick={(event) => {
          event.preventDefault();
          onSceneLink(1);
        }}
      >
        Continuar →
      </a>
    </article>
  );
}
