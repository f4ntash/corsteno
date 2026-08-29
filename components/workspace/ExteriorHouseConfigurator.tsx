"use client";

import { useEffect, useRef, useState } from "react";

import ExteriorHouseScene, {
  type ExteriorHouseSceneHandle,
} from "@/components/three/ExteriorHouseScene";
import {
  DEFAULT_EXTERIOR_HOUSE_STATE,
  EXTERIOR_HOUSE_GROUPS,
  updateExteriorHouseOption,
  type ExteriorHouseOptionGroupId,
  type ExteriorHouseOptionValue,
} from "@/components/three/exteriorHouseVariants";

type ExteriorHouseConfiguratorProps = {
  presentation?: "default" | "project";
};

type ActiveControl = "water" | "border" | ExteriorHouseOptionGroupId;

export default function ExteriorHouseConfigurator({
  presentation = "default",
}: ExteriorHouseConfiguratorProps) {
  const slotRef = useRef<HTMLElement>(null);
  const viewerRef = useRef<ExteriorHouseSceneHandle>(null);
  const [configuration, setConfiguration] = useState({ ...DEFAULT_EXTERIOR_HOUSE_STATE });
  const [activeControl, setActiveControl] = useState<ActiveControl>("water");
  const [engaged, setEngaged] = useState(false);
  const [renderState, setRenderState] = useState("loading");
  const [fullscreenSupported, setFullscreenSupported] = useState(true);

  useEffect(() => {
    setFullscreenSupported(Boolean(slotRef.current?.requestFullscreen));
    const timeout = window.setTimeout(() => setRenderState("ready"), 520);
    return () => window.clearTimeout(timeout);
  }, []);

  const activeGroup = EXTERIOR_HOUSE_GROUPS.find((group) => group.id === activeControl);
  const activeOption = activeGroup?.options.find(
    (option) => option.value === configuration[activeGroup.id],
  );

  const detail = activeControl === "water"
    ? {
        group: "Agua",
        title: configuration.water ? "Activada" : "Desactivada",
        description: "Control conjunto de la superficie de agua y la caída de la cascada.",
        details: [{ label: "Estado", value: configuration.water ? "ON" : "OFF" }],
      }
    : activeControl === "border"
      ? {
          group: "Borde",
          title: "Color",
          description: "Color aplicado sobre el material original del borde de la pileta.",
          details: [{ label: "Color", value: configuration.borderColor.toUpperCase() }],
        }
      : {
          group: activeGroup?.label ?? "",
          title: activeOption?.label ?? "",
          description: activeOption?.description ?? "",
          details: activeOption?.details ?? [],
        };

  const selectOption = (
    groupId: ExteriorHouseOptionGroupId,
    value: ExteriorHouseOptionValue,
  ) => {
    setConfiguration((current) => updateExteriorHouseOption(current, groupId, value));
    setActiveControl(groupId);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const changes: Record<string, [number, number]> = {
      ArrowLeft: [-0.096, 0],
      ArrowRight: [0.096, 0],
      ArrowUp: [0, -0.064],
      ArrowDown: [0, 0.064],
    };
    const change = changes[event.key];
    if (!change) return;
    event.preventDefault();
    setEngaged(true);
    viewerRef.current?.nudge(change[0], change[1]);
  };

  const toggleFullscreen = () => {
    const slot = slotRef.current;
    if (!slot?.requestFullscreen) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void slot.requestFullscreen();
  };

  const resetExperience = () => {
    setConfiguration({ ...DEFAULT_EXTERIOR_HOUSE_STATE });
    setActiveControl("water");
  };

  return (
    <article className="scene scene-product is-exterior-config is-active" id="exterior-house">
      <section
        ref={slotRef}
        className="three-slot"
        data-three-slot="product-configurator"
        data-render-state={renderState}
        data-engaged={engaged ? "true" : undefined}
        aria-label="Configurador 3D Exterior House"
        aria-describedby="exterior-house-accessible-description"
      >
        <div
          className="canvas-mount"
          tabIndex={0}
          aria-label="Explorá Exterior House arrastrando o usando las flechas del teclado"
          data-canvas-mount="product-configurator"
          data-cursor="Rotar"
          onPointerDown={() => setEngaged(true)}
          onKeyDown={onKeyDown}
        >
          <p id="exterior-house-accessible-description" className="visually-hidden">
            Experiencia 3D interactiva para comparar agua y terminaciones de una pileta exterior.
          </p>
          <div className="slot-loading">Preparando ambiente</div>
          <div className="exterior-config-layout">
            <aside className="exterior-config-detail" aria-live="polite" aria-label="Detalle seleccionado">
              <div className="demo-panel-intro">
                <span className="project-trust-label">CORSTENO LAB · ARCHITECTURAL 3D</span>
                <span className="kind">Visualización exterior</span>
                <h2>Exterior House</h2>
              </div>
              <span className="exterior-config-detail-group">{detail.group}</span>
              <h3>{detail.title}</h3>
              <p>{detail.description}</p>
              <dl>
                {detail.details.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="panel-commercial-copy">Compará terminaciones antes de definir el proyecto.</p>
              <a className="contextual-cta" href="#contacto" data-service="visualizacion-3d" data-cursor="Abrir">
                Quiero algo así ↗
              </a>
            </aside>

            <div className="exterior-render-column">
              <div className="exterior-render-stage">
                <ExteriorHouseScene
                  ref={viewerRef}
                  configuration={configuration}
                  presentation={presentation}
                />
              </div>
              <span className="drag-hint">Arrastrar · Rotar</span>
            </div>

            <aside className="exterior-config-panel" aria-label="Configuración de Exterior House">
              <div className="exterior-variant-panel">
                <div className="exterior-variant-group">
                  <span className="exterior-variant-label">Agua</span>
                  <div className="exterior-variant-options">
                    <button
                      className="exterior-variant-button"
                      type="button"
                      aria-pressed={configuration.water}
                      onClick={() => {
                        setConfiguration((current) => ({ ...current, water: !current.water }));
                        setActiveControl("water");
                      }}
                    >
                      {configuration.water ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>

                {EXTERIOR_HOUSE_GROUPS.map((group) => (
                  <div className="exterior-variant-group" key={group.id}>
                    <span className="exterior-variant-label">{group.label}</span>
                    <div className="exterior-variant-options">
                      {group.options.map((option) => (
                        <button
                          className="exterior-variant-button"
                          type="button"
                          key={option.id}
                          aria-pressed={configuration[group.id] === option.value}
                          aria-label={`${group.label}: ${option.label}`}
                          onClick={() => selectOption(group.id, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="exterior-variant-group">
                  <label className="exterior-variant-label" htmlFor="exterior-border-color">Borde</label>
                  <div className="exterior-color-control">
                    <input
                      id="exterior-border-color"
                      type="color"
                      value={configuration.borderColor}
                      aria-label="Color del borde"
                      onChange={(event) => {
                        setConfiguration((current) => ({ ...current, borderColor: event.target.value }));
                        setActiveControl("border");
                      }}
                    />
                    <span>{configuration.borderColor.toUpperCase()}</span>
                  </div>
                </div>
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
    </article>
  );
}
