"use client";

import { useEffect, useRef, useState } from "react";
import ExteriorHouseScene from "@/components/three/ExteriorHouseScene";
import {
  DEFAULT_EXTERIOR_HOUSE_VARIANTS,
  EXTERIOR_HOUSE_VARIANT_GROUPS,
  type ExteriorHouseGroupId,
} from "@/components/three/exteriorHouseVariants";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type ProductSceneProps = {
  sceneStyle: React.CSSProperties;
  active: boolean;
  onSceneLink: (index: number) => void;
};

type Variant = "natural" | "light" | "dark";

const variantBackground: Record<Variant, string> = {
  natural: "var(--accent-secondary)",
  light: "var(--bg)",
  dark: "var(--accent)",
};

export default function ProductScene({ sceneStyle, active, onSceneLink }: ProductSceneProps) {
  const slotRef = useRef<HTMLElement>(null);
  const dragRef = useRef({ dragging: false, x: 0, y: 0 });
  const renderStateRef = useRef("idle");
  const [rotation, setRotation] = useState({ x: -16, y: 28 });
  const [renderState, setRenderState] = useState("idle");
  const [engaged, setEngaged] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [expandedHotspot, setExpandedHotspot] = useState(false);
  const [variant] = useState<Variant>("natural");
  const [exteriorVariants, setExteriorVariants] = useState({ ...DEFAULT_EXTERIOR_HOUSE_VARIANTS });
  const [exteriorSelection, setExteriorSelection] = useState<{ groupId: ExteriorHouseGroupId; variantId: string }>({
    groupId: "poolLining",
    variantId: DEFAULT_EXTERIOR_HOUSE_VARIANTS.poolLining,
  });
  const [fullscreenSupported, setFullscreenSupported] = useState(true);

  const activeExteriorGroup = EXTERIOR_HOUSE_VARIANT_GROUPS.find(
    (group) => group.id === exteriorSelection.groupId,
  )!;
  const activeExteriorVariant = activeExteriorGroup.variants.find(
    (item) => item.id === exteriorSelection.variantId,
  )!;

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

  const beginDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (variant === "natural") return;
    if ((event.target as Element).closest("button")) return;
    dragRef.current = { dragging: true, x: event.clientX, y: event.clientY };
    setDragging(true);
    setEngaged(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.dragging) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    dragRef.current = { dragging: true, x: event.clientX, y: event.clientY };
    setRotation((current) => ({
      x: clamp(current.x - dy * 0.12, -38, 12),
      y: current.y + dx * 0.18,
    }));
  };

  const stopDrag = () => {
    dragRef.current.dragging = false;
    setDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (variant === "natural") return;
    const keys: Record<string, [number, number]> = {
      ArrowLeft: [0, -6],
      ArrowRight: [0, 6],
      ArrowUp: [-4, 0],
      ArrowDown: [4, 0],
    };
    const change = keys[event.key];
    if (!change) return;
    event.preventDefault();
    setRotation((current) => ({ x: current.x + change[0], y: current.y + change[1] }));
  };

  const toggleFullscreen = () => {
    const slot = slotRef.current;
    if (!slot?.requestFullscreen) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void slot.requestFullscreen();
  };

  const selectExteriorVariant = (groupId: ExteriorHouseGroupId, variantId: string) => {
    setExteriorVariants((current) => ({ ...current, [groupId]: variantId }));
    setExteriorSelection({ groupId, variantId });
  };

  const resetExperience = () => {
    setRotation({ x: -16, y: 28 });
    if (variant !== "natural") return;
    setExteriorVariants({ ...DEFAULT_EXTERIOR_HOUSE_VARIANTS });
    setExteriorSelection({ groupId: "poolLining", variantId: DEFAULT_EXTERIOR_HOUSE_VARIANTS.poolLining });
  };

  const slotControls = (
    <div className="slot-controls">
      <button
        className="quiet-button reset-button"
        type="button"
        data-od-id="producto-reiniciar"
        onClick={resetExperience}
      >
        Reiniciar
      </button>
      <button
        className="quiet-button fullscreen-button"
        type="button"
        data-od-id="producto-ampliar"
        disabled={!fullscreenSupported}
        onClick={toggleFullscreen}
      >
        Ampliar ↗
      </button>
    </div>
  );

  return (
    <article
      className={`scene scene-product${active ? " is-active" : ""}${variant === "natural" ? " is-exterior-config" : ""}`}
      id="product"
      data-project-scene="2"
      data-od-id="escena-producto"
      style={sceneStyle}
    >
      <section
        ref={slotRef}
        className="three-slot"
        data-three-slot="product-configurator"
        data-render-state={renderState}
        data-engaged={engaged ? "true" : undefined}
        aria-label="Espacio preparado para el configurador 3D de producto"
        data-od-id="producto-three-slot"
      >
        <div
          className="canvas-mount"
          tabIndex={0}
          aria-label="Arrastrá para rotar el producto"
          data-canvas-mount="product-configurator"
          data-cursor="Rotar"
          data-dragging={dragging ? "true" : "false"}
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onKeyDown={onKeyDown}
        >
          <div className="slot-loading">Preparando objeto</div>
          {variant === "natural" ? (
            <div className="exterior-config-layout">
              <aside className="exterior-config-detail" aria-live="polite" aria-label="Detalle del material exterior">
                <div className="demo-panel-intro">
                  <span className="scene-number">03 / 04</span>
                  <span className="project-trust-label">DEMO CORSTENO · PREVENTA INTERACTIVA</span>
                  <span className="kind">Preventa interactiva</span>
                  <h2 data-od-id="producto-titulo">Exterior House</h2>
                  <span className="kind">Preventa interactiva</span>
                </div>
                <span className="exterior-config-detail-group">{activeExteriorGroup.label}</span>
                <h3>{activeExteriorVariant.label}</h3>
                <p>{activeExteriorVariant.description}</p>
                <dl>
                  {activeExteriorVariant.details.map((detail) => (
                    <div key={detail.label}>
                      <dt>{detail.label}</dt>
                      <dd>{detail.value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="panel-commercial-copy">Mostrá materiales y terminaciones antes de construir.</p>
                <a className="contextual-cta" href="#contacto" data-service="preventa" data-cursor="Abrir">
                  Quiero algo así ↗
                </a>
              </aside>
              <div className="exterior-render-column">
                <div className="exterior-render-stage">
                  {active ? <ExteriorHouseScene variants={exteriorVariants} /> : null}
                </div>
                <span className="drag-hint">Arrastrar · Rotar</span>
              </div>
              <aside className="exterior-config-panel" aria-label="Configuración de materiales exteriores">
                <div className="exterior-variant-panel">
                  {EXTERIOR_HOUSE_VARIANT_GROUPS.map((group) => (
                    <div className="exterior-variant-group" key={group.id}>
                      <span className="exterior-variant-label">{group.label}</span>
                      <div className="exterior-variant-options">
                        {group.variants.map((item) => (
                          <button
                            key={item.id}
                            className="exterior-variant-button"
                            type="button"
                            aria-pressed={exteriorVariants[group.id] === item.id}
                            aria-label={`${group.label}: ${item.label}`}
                            onClick={() => selectExteriorVariant(group.id, item.id)}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {slotControls}
              </aside>
            </div>
          ) : null}
          {variant !== "natural" ? (
            <div className="slot-fallback" aria-hidden="true">
              <div
                className="product-object"
                data-object
                style={
                  {
                    "--rot-x": `${rotation.x}deg`,
                    "--rot-y": `${rotation.y}deg`,
                    "--object-scale": 1,
                  } as React.CSSProperties
                }
              >
                <span className="core" style={{ background: variantBackground[variant] }} />
                <span className="rail" />
                <span className="module" />
              </div>
            </div>
          ) : null}
          {variant !== "natural" ? (
            <button
              className="hotspot product-hotspot"
              type="button"
              aria-expanded={expandedHotspot}
              data-od-id="producto-hotspot-modulo"
              onClick={() => setExpandedHotspot((open) => !open)}
            >
              <span className="hotspot-label">Módulo · Cambiar configuración</span>
            </button>
          ) : null}
          {variant !== "natural" ? <span className="drag-hint">Arrastrar · Rotar</span> : null}
          {variant !== "natural" ? slotControls : null}
        </div>
      </section>
      <a
        className="scene-action"
        href="#system"
        data-scene-link="3"
        data-od-id="producto-siguiente"
        onClick={(event) => {
          event.preventDefault();
          onSceneLink(3);
        }}
      >
        Continuar →
      </a>
    </article>
  );
}
