"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_HERO_SLIDER_STATE,
  HERO_SLIDER_GROUPS,
  updateHeroSliderVariant,
  type HeroSliderGroupId,
  type HeroSliderState,
  type HeroSliderValue,
} from "@/components/three/heroSliderVariants";
import { withBasePath } from "@/lib/assetPath";
import type { HomeDictionary, Locale } from "@/lib/i18n";

type VisibleHeroGroupId = Exclude<HeroSliderGroupId, "decor">;
const GROUP_ORDER: VisibleHeroGroupId[] = ["table", "chair", "rug", "armchair"];
const PREVIA_HOUSE_INTERIOR_PROJECT_URL = withBasePath("/proyectos/revestimientos-interactivos/");
const CHIP_MARGIN = 14;
type HeroViewer = ComponentType<{ variants: HeroSliderState; comparison: number }>;
export default function InteractiveHeroDemo({ dictionary: t }: { dictionary: HomeDictionary; locale: Locale }) {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const beforeChipRef = useRef<HTMLSpanElement>(null);
  const afterChipRef = useRef<HTMLSpanElement>(null);
  const [comparison, setComparison] = useState(25);
  const [variants, setVariants] = useState({ ...DEFAULT_HERO_SLIDER_STATE });
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [HeroSliderViewer, setHeroSliderViewer] = useState<HeroViewer | null>(null);
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

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const initializeViewer = () => {
      void import("@/components/three/HeroSliderViewer").then((module) => {
        if (!cancelled) setHeroSliderViewer(() => module.default);
      });
    };
    const scheduleViewer = () => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(initializeViewer, { timeout: 1500 });
      } else {
        timeoutId = globalThis.setTimeout(initializeViewer, 400);
      }
    };

    if (document.readyState === "complete") scheduleViewer();
    else window.addEventListener("load", scheduleViewer, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", scheduleViewer);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
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
          {HeroSliderViewer ? <HeroSliderViewer variants={variants} comparison={comparison} /> : null}
        </div>
        <span
          ref={beforeChipRef}
          className="interactive-hero-comparison-chip interactive-hero-comparison-chip-before"
          aria-hidden={!beforeVisible}
          style={{ left: beforeChipLeft, opacity: beforeVisible ? 1 : 0 }}
        >
          {t.hero.comparison.before}
        </span>
        <span
          ref={afterChipRef}
          className="interactive-hero-comparison-chip interactive-hero-comparison-chip-after"
          aria-hidden={!afterVisible}
          style={{ left: afterChipLeft, opacity: afterVisible ? 1 : 0 }}
        >
          {t.hero.comparison.after}
        </span>

        <div className="interactive-hero-divider" style={{ left: `${comparison}%` }} aria-hidden="true" />
        <div
          className="interactive-hero-slider"
          role="slider"
          tabIndex={0}
          aria-label={t.hero.comparison.aria}
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

        {!mobilePanelOpen && (
          <button
            className="interactive-hero-panel-trigger"
            type="button"
            aria-controls="interactive-hero-personalization"
            aria-expanded="false"
            onClick={() => setMobilePanelOpen(true)}
          >
            {t.hero.panel.trigger}
          </button>
        )}

        <aside
          ref={panelRef}
          id="interactive-hero-personalization"
          className="interactive-hero-panel"
          aria-label={t.hero.panel.aria}
          data-mobile-open={mobilePanelOpen}
        >
          <button
            className="interactive-hero-panel-close"
            type="button"
            aria-label={t.hero.panel.close}
            onClick={() => setMobilePanelOpen(false)}
          >
            <span aria-hidden="true">×</span>
          </button>
          <div className="interactive-hero-panel-content">
            <h2>{t.hero.panel.title}</h2>
            <p className="interactive-hero-panel-note">{t.hero.panel.note}</p>
            <div className="interactive-hero-options">
              {GROUP_ORDER.map((groupId) => {
            const group = HERO_SLIDER_GROUPS.find((item) => item.id === groupId)!;
            const labelId = `interactive-hero-${group.id}-label`;
            const activeIndex = group.options.findIndex((option) => option.value === variants[group.id]);
            const activeOption = group.options[activeIndex] ?? group.options[0];
            const groupLabel = t.hero.panel.groups[groupId];
            const activeDisplayLabel = t.hero.panel.values[activeOption.value];
            const optionCount = group.options.length;
                return (
                  <div
                    key={group.id}
                    className={`interactive-hero-panel-group is-${group.id}`}
                    role="group"
                    aria-labelledby={labelId}
                  >
                <span id={labelId} className="interactive-hero-panel-label">
                  {groupLabel}
                </span>
                {group.id === "decor" ? (
                  <div className="interactive-hero-segmented" role="group" aria-label={groupLabel}>
                    {group.options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className="interactive-hero-segment"
                        aria-label={`${groupLabel}: ${t.hero.panel.values[option.value]}`}
                        aria-pressed={variants[group.id] === option.value}
                        onClick={() => selectVariant(group.id, option.value)}
                      >
                        {t.hero.panel.values[option.value]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="interactive-hero-choice-row"
                    aria-label={`${groupLabel}: ${activeDisplayLabel}. ${t.hero.panel.change}`}
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
            </div>
          </div>
          <button className="interactive-hero-view-button" type="button" onClick={openProject}>
               <span>{t.hero.panel.view3d}</span>
            <span aria-hidden="true">→</span>
          </button>
        </aside>

      </div>
    </div>
  );
}
