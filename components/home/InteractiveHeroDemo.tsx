"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import HeroSliderViewer from "@/components/three/HeroSliderViewer";
import {
  DEFAULT_HERO_SLIDER_STATE,
  HERO_SLIDER_GROUPS,
  updateHeroSliderVariant,
  type HeroSliderGroupId,
  type HeroSliderValue,
} from "@/components/three/heroSliderVariants";
import { withBasePath } from "@/lib/assetPath";

const GROUP_ORDER: HeroSliderGroupId[] = ["table", "chair", "rug", "armchair"];
const PREVIA_HOUSE_INTERIOR_PROJECT_URL = withBasePath("/proyectos/revestimientos-interactivos/");
const CHIP_MARGIN = 14;
const PANEL_DISPLAY_LABELS: Record<HeroSliderValue, string> = {
  tableA: "Madera natural",
  tableB: "Nogal medio",
  tableC: "Nogal oscuro",
  chairA: "Tapizado azul",
  chairB: "Madera grafito",
  chairC: "Madera nogal",
  rug01: "Tejido natural",
  rug02: "Geometría clara",
  decorOff: "Esencial",
  decorOn: "Completa",
  armchair1: "Sillón verde",
  armchair2: "Sillón lounge",
};

export default function InteractiveHeroDemo() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const beforeChipRef = useRef<HTMLSpanElement>(null);
  const afterChipRef = useRef<HTMLSpanElement>(null);
  const [comparison, setComparison] = useState(25);
  const [variants, setVariants] = useState({ ...DEFAULT_HERO_SLIDER_STATE });
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

  const selectVariant = (groupId: HeroSliderGroupId, value: HeroSliderValue) => {
    setVariants((current) => updateHeroSliderVariant(current, groupId, value));
  };

  const cycleVariant = (groupId: HeroSliderGroupId) => {
    const group = HERO_SLIDER_GROUPS.find((item) => item.id === groupId);
    if (!group) return;

    const currentIndex = group.options.findIndex((option) => option.value === variants[groupId]);
    const nextOption = group.options[(currentIndex + 1) % group.options.length];
    selectVariant(groupId, nextOption.value);
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
          <HeroSliderViewer variants={variants} comparison={comparison} />
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
          <p className="interactive-hero-panel-note">Seleccioná cada acabado para explorar opciones</p>
          {GROUP_ORDER.map((groupId) => {
            const group = HERO_SLIDER_GROUPS.find((item) => item.id === groupId)!;
            const labelId = `interactive-hero-${group.id}-label`;
            const activeIndex = group.options.findIndex((option) => option.value === variants[group.id]);
            const activeOption = group.options[activeIndex] ?? group.options[0];
            const activeDisplayLabel = PANEL_DISPLAY_LABELS[activeOption.value];
            const optionCount = group.options.length;
            return (
              <div
                key={group.id}
                className={`interactive-hero-panel-group is-${group.id}`}
                role="group"
                aria-labelledby={labelId}
              >
                <span id={labelId} className="interactive-hero-panel-label">
                  {group.label}
                </span>
                {group.id === "decor" ? (
                  <div className="interactive-hero-segmented" role="group" aria-label={group.label}>
                    {group.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="interactive-hero-segment"
                        aria-label={`${group.label}: ${PANEL_DISPLAY_LABELS[option.value]}`}
                        aria-pressed={variants[group.id] === option.value}
                        onClick={() => selectVariant(group.id, option.value)}
                      >
                        {PANEL_DISPLAY_LABELS[option.value]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="interactive-hero-choice-row"
                    aria-label={`${group.label}: ${activeDisplayLabel}. Cambiar opción`}
                    onClick={() => cycleVariant(group.id)}
                  >
                    <span className="interactive-hero-choice-value">
                      <span>{activeDisplayLabel}</span>
                      <span className="interactive-hero-choice-arrow" aria-hidden="true">›</span>
                    </span>
                    <span className="interactive-hero-choice-count" aria-hidden="true">
                      {String(activeIndex + 1).padStart(2, "0")} / {String(optionCount).padStart(2, "0")}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
          <button className="interactive-hero-view-button" type="button" onClick={openProject}>
            <span>VER EN 3D</span>
            <span aria-hidden="true">→</span>
          </button>
        </aside>

      </div>
    </div>
  );
}
