"use client";

import H2OViewer, { type H2OViewerHandle } from "@/components/three/H2OViewer";
import { DEFAULT_H2O_VARIANTS, H2O_VARIANT_GROUPS, type H2OVariantGroupId } from "@/components/three/h2oVariants";
import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assetPath";

const H2O_PREVIEW_URL = withBasePath("/projects/corsteno-showroom-3d.webp");

type H2OSceneProps = {
  sceneStyle: React.CSSProperties;
  active: boolean;
  onSceneLink: (index: number) => void;
  presentation?: "default" | "project";
};

export default function H2OScene({ sceneStyle, active, onSceneLink, presentation = "default" }: H2OSceneProps) {
  const slotRef = useRef<HTMLElement>(null);
  const viewerRef = useRef<H2OViewerHandle>(null);
  const [renderState, setRenderState] = useState("idle");
  const [engaged, setEngaged] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(true);
  const [variants, setVariants] = useState({ ...DEFAULT_H2O_VARIANTS });
  const [activeSelection, setActiveSelection] = useState<{ groupId: H2OVariantGroupId; variantId: string }>({
    groupId: "wallDining",
    variantId: DEFAULT_H2O_VARIANTS.wallDining,
  });

  const activeGroup = H2O_VARIANT_GROUPS.find((group) => group.id === activeSelection.groupId)!;
  const activeVariant = activeGroup.variants.find((variant) => variant.id === activeSelection.variantId)!;

  useEffect(() => {
    setFullscreenSupported(Boolean(slotRef.current?.requestFullscreen));
  }, []);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    slot.dataset.renderActive = String(active);
    slot.dispatchEvent(new CustomEvent("forma3d:render-visibility", { detail: { active } }));
    if (active && renderState === "idle") setRenderState("loading");
  }, [active, renderState]);

  const markEngaged = () => {
    setEngaged(true);
  };

  const markReady = () => {
    setRenderState("ready");
    slotRef.current?.dispatchEvent(new CustomEvent("forma3d:mount-ready"));
  };

  const startInteraction = () => {
    setDragging(true);
    window.dispatchEvent(new CustomEvent("forma3d:cursor-label", { detail: { label: "DRAGGING" } }));
  };

  const endInteraction = () => {
    setDragging(false);
    window.dispatchEvent(new CustomEvent("forma3d:cursor-label", { detail: { label: "ROTATE" } }));
  };

  const toggleFullscreen = () => {
    const slot = slotRef.current;
    if (!slot?.requestFullscreen) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void slot.requestFullscreen();
  };

  const selectVariant = (groupId: H2OVariantGroupId, variantId: string) => {
    setVariants((current) => ({ ...current, [groupId]: variantId }));
    setActiveSelection({ groupId, variantId });
  };

  const resetExperience = () => {
    setVariants({ ...DEFAULT_H2O_VARIANTS });
    setActiveSelection({ groupId: "wallDining", variantId: DEFAULT_H2O_VARIANTS.wallDining });
    viewerRef.current?.reset();
  };

  const onViewerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const movement: Record<string, [number, number]> = {
      ArrowLeft: [-0.1, 0],
      ArrowRight: [0.1, 0],
      ArrowUp: [0, -0.08],
      ArrowDown: [0, 0.08],
    };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    setEngaged(true);
    viewerRef.current?.nudge(...delta);
  };

  return (
    <article
      className={`scene scene-h2o${active ? " is-active" : ""}`}
      id="h2o"
      data-project-scene="0"
      data-od-id="escena-h2o"
      style={sceneStyle}
    >
      <div className="h2o-layout">
        <aside className="h2o-material-detail" aria-live="polite" aria-label="Detalle del material seleccionado">
          <div className="demo-panel-intro">
            <span className="scene-number">01 / 04</span>
            <span className="project-trust-label">CORSTENO LAB · 3D PRODUCT CONFIGURATOR</span>
            <span className="kind">Showroom digital</span>
            <h2 data-od-id="h2o-titulo">ATLAS</h2>
            <span className="kind">Configurador de producto</span>
          </div>
          <span className="h2o-detail-group">{activeGroup.label}</span>
          <h3>{activeVariant.label}</h3>
          <p>{activeVariant.description}</p>
          <dl>
            {activeVariant.details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
          <p className="panel-commercial-copy">Tus clientes pueden explorar materiales y terminaciones en tiempo real.</p>
          <a className="contextual-cta" href="#contacto" data-service="showroom" data-cursor="Abrir">
            Quiero algo así ↗
          </a>
        </aside>
        <div className="h2o-render-column">
          <section
            id="h2o-three-slot"
            ref={slotRef}
            className="three-slot"
            data-three-slot="h2o-configurator"
            data-render-state={renderState}
            data-engaged={engaged ? "true" : undefined}
            aria-label="Espacio preparado para el configurador 3D ATLAS"
            aria-describedby="h2o-accessible-description"
            data-od-id="h2o-three-slot"
          >
            <div
              className="canvas-mount"
              tabIndex={0}
              aria-label="Explorá ATLAS arrastrando o usando las flechas del teclado"
              data-canvas-mount="h2o-configurator"
              data-cursor="ROTATE"
              data-dragging={dragging ? "true" : "false"}
              onKeyDown={onViewerKeyDown}
            >
              <p id="h2o-accessible-description" className="visually-hidden">
                Experiencia 3D interactiva del proyecto ATLAS. Usá las flechas para mover la cámara y los controles
                disponibles para cambiar materiales y variantes.
              </p>
              <img className="slot-loading-preview" src={H2O_PREVIEW_URL} alt="" aria-hidden="true" />
              <div className="slot-loading">Cargando 3D</div>
              {(active || renderState !== "idle") && (
                <H2OViewer
                  ref={viewerRef}
                  active={active}
                  presentation={presentation}
                  variants={variants}
                  onEngaged={markEngaged}
                  onInteractionStart={startInteraction}
                  onInteractionEnd={endInteraction}
                  onReady={markReady}
                />
              )}
            </div>
          </section>
          <span className="drag-hint">Arrastrar · Rotar</span>
        </div>
        <aside className="h2o-control-panel" aria-label="Controles ATLAS">
          <div className="h2o-variant-panel" aria-label="Variantes ATLAS">
            {H2O_VARIANT_GROUPS.map((group) => (
              <div className="h2o-variant-group" key={group.id}>
                <span className="h2o-variant-label">{group.label}</span>
                <div className="h2o-variant-options">
                  {group.variants.map((variant) => (
                    <button
                      key={variant.id}
                      className="h2o-variant-button"
                      type="button"
                      aria-pressed={variants[group.id] === variant.id}
                      aria-label={`${group.label}: ${variant.label}`}
                      onClick={() => selectVariant(group.id, variant.id)}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="slot-controls">
            <button
              className="quiet-button reset-button"
              type="button"
              aria-label="Reiniciar ATLAS"
              data-od-id="h2o-reiniciar"
              onClick={resetExperience}
            >
              Reiniciar
            </button>
            <button
              className="quiet-button fullscreen-button"
              type="button"
              data-od-id="h2o-ampliar"
              disabled={!fullscreenSupported}
              onClick={toggleFullscreen}
            >
              Ampliar ↗
            </button>
          </div>
        </aside>
      </div>
      <a
        className="scene-action"
        href="#terrambu"
        data-scene-link="1"
        data-od-id="h2o-siguiente"
        onClick={(event) => {
          event.preventDefault();
          onSceneLink(1);
        }}
      >
        Explorar →
      </a>
    </article>
  );
}
