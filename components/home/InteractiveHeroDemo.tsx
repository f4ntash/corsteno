"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import InteriorFinishesViewer from "@/components/three/InteriorFinishesViewer";
import {
  DEFAULT_INTERIOR_FINISHES,
  INTERIOR_FINISH_GROUPS,
  updateInteriorFinish,
  type InteriorFinishGroupId,
  type InteriorFinishValue,
} from "@/components/three/interiorFinishVariants";
import { withBasePath } from "@/lib/assetPath";

const GROUP_ORDER: InteriorFinishGroupId[] = ["wall", "bar", "floor", "opening"];
const PREVIA_HOUSE_INTERIOR_PROJECT_URL = withBasePath("/proyectos/revestimientos-interactivos/");
const CHIP_MARGIN = 14;

export default function InteractiveHeroDemo() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const beforeChipRef = useRef<HTMLSpanElement>(null);
  const afterChipRef = useRef<HTMLSpanElement>(null);
  const [comparison, setComparison] = useState(25);
  const [variants, setVariants] = useState({ ...DEFAULT_INTERIOR_FINISHES });
  const [measurements, setMeasurements] = useState({
    width: 0,
    panelLeft: 0,
    beforeChipWidth: 0,
    afterChipWidth: 0,
  });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      setMeasurements({
        width: stage.clientWidth,
        panelLeft: panelRef.current?.offsetLeft ?? stage.clientWidth,
        beforeChipWidth: beforeChipRef.current?.offsetWidth ?? 0,
        afterChipWidth: afterChipRef.current?.offsetWidth ?? 0,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    if (panelRef.current) observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  const setComparisonFromPointer = (clientX: number) => {
    const bounds = stageRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const value = ((clientX - bounds.left) / bounds.width) * 100;
    setComparison(Math.min(100, Math.max(0, value)));
  };

  const selectVariant = (groupId: InteriorFinishGroupId, value: InteriorFinishValue) => {
    setVariants((current) => updateInteriorFinish(current, groupId, value));
  };

  const openProject = () => router.push(PREVIA_HOUSE_INTERIOR_PROJECT_URL);

  const split = measurements.width * (comparison / 100);
  const afterEnd = Math.max(split, measurements.panelLeft - CHIP_MARGIN);
  const beforeVisible = split >= measurements.beforeChipWidth + CHIP_MARGIN * 2;
  const afterVisible = afterEnd - split >= measurements.afterChipWidth + CHIP_MARGIN * 2;
  const beforeChipLeft = Math.min(
    split - CHIP_MARGIN - measurements.beforeChipWidth / 2,
    Math.max(CHIP_MARGIN + measurements.beforeChipWidth / 2, split / 2),
  );
  const afterChipLeft = Math.min(
    afterEnd - CHIP_MARGIN - measurements.afterChipWidth / 2,
    Math.max(
      split + CHIP_MARGIN + measurements.afterChipWidth / 2,
      split + (afterEnd - split) / 2,
    ),
  );

  return (
    <div className="interactive-hero-demo">
      <div ref={stageRef} className="interactive-hero-stage">
        <div className="interactive-hero-viewer" aria-hidden="true">
          <InteriorFinishesViewer variants={variants} presentation="hero" comparison={comparison} />
        </div>
        <span
          ref={beforeChipRef}
          className="interactive-hero-comparison-chip interactive-hero-comparison-chip-before"
          aria-hidden={!beforeVisible}
          style={{ left: beforeChipLeft, opacity: beforeVisible ? 1 : 0 }}
        >
          Antes
        </span>
        <span
          ref={afterChipRef}
          className="interactive-hero-comparison-chip interactive-hero-comparison-chip-after"
          aria-hidden={!afterVisible}
          style={{ left: afterChipLeft, opacity: afterVisible ? 1 : 0 }}
        >
          Después: experiencia interactiva
        </span>

        <div className="interactive-hero-divider" style={{ left: `${comparison}%` }} aria-hidden="true" />
        <div
          className="interactive-hero-slider"
          role="slider"
          tabIndex={0}
          aria-label="Comparar espacio base y experiencia interactiva"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(comparison)}
          style={{ left: `${comparison}%` }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setComparisonFromPointer(event.clientX);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              setComparisonFromPointer(event.clientX);
            }
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            setComparison((current) => Math.min(100, Math.max(0, current + (event.key === "ArrowRight" ? 2 : -2))));
          }}
        >
          <span aria-hidden="true">↔</span>
        </div>

        <aside ref={panelRef} className="interactive-hero-panel" aria-label="Personalización del ambiente">
          <h2>Personalizá tu espacio</h2>
          {GROUP_ORDER.map((groupId) => {
            const group = INTERIOR_FINISH_GROUPS.find((item) => item.id === groupId)!;
            return (
              <fieldset key={group.id}>
                <legend>{group.id === "opening" ? "Abertura" : group.id === "bar" ? "Barra" : group.label}</legend>
                <div className={`interactive-hero-swatches is-${group.id}`}>
                  {group.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`interactive-hero-swatch swatch-${option.value}`}
                      aria-label={`${group.label}: ${option.label}`}
                      aria-pressed={variants[group.id] === option.value}
                      title={option.label}
                      onClick={() => selectVariant(group.id, option.value)}
                    >
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
            );
          })}
          <button className="interactive-hero-view-button" type="button" onClick={openProject}>
            ◈ Ver en 3D
          </button>
        </aside>

      </div>
    </div>
  );
}
