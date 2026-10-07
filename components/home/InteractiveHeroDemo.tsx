"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { formatHour, PRESETS, sunAt } from "@/components/three/container-house-hero/presets";
import type { CameraRequest } from "@/components/three/container-house-hero/cameras";
import type { ModelLightEntry } from "@/components/three/container-house-hero/lights";
import { buildRows, GROUPS, GROUP_LABELS, type SectionEntry } from "@/components/three/container-house-hero/sections";
import HeroActionButtons from "@/components/three/container-house-hero/HeroActionButtons";
import HotspotSwitcher from "@/components/three/container-house-hero/HotspotSwitcher";
import { useTimelapse } from "@/components/three/container-house-hero/useTimelapse";
import type { HomeDictionary, Locale } from "@/lib/i18n";

type HeroViewerProps = {
  time: number;
  azimuth: number;
  elevation: number;
  intensity: number;
  hidden: Set<string>;
  lightsOff: Set<string>;
  cameraRequest: CameraRequest;
  onSelectCamera: (key: string) => void;
  onSelectLight: (key: string) => void;
  viewFromLabel: string;
  hotspotMode: "cameras" | "lights" | null;
  activeCameraKey: string | null;
  activeLightKey: string | null;
  onSections: (sections: Omit<SectionEntry, "node">[]) => void;
  onLights: (lights: ModelLightEntry[]) => void;
  onCameras: (cameras: { key: string; label: string }[]) => void;
};

type HeroViewer = ComponentType<HeroViewerProps>;
type ControlTab = "lighting" | "sections" | "lights" | "cameras";
const TAB_ORDER: ControlTab[] = ["lighting", "sections", "lights", "cameras"];
const INITIAL_TIME = 12;
const INITIAL_SUN = sunAt(INITIAL_TIME);

// Textos de los botones de rotación y timelapse. Conviene moverlos a tu diccionario i18n (HomeDictionary).
const ACTION_LABELS = {
  es: { timelapseOff: "Comenzar timelapse", timelapseOn: "Detener timelapse", fullscreenOff: "Pantalla completa", fullscreenOn: "Salir de pantalla completa", previous: "Anterior", next: "Siguiente", advanced: "Ajustes avanzados" },
  en: { timelapseOff: "Start timelapse", timelapseOn: "Stop timelapse", fullscreenOff: "Fullscreen", fullscreenOn: "Exit fullscreen", previous: "Previous", next: "Next", advanced: "Advanced settings" },
};

const nowHour = () => {
  const date = new Date();
  return date.getHours() + date.getMinutes() / 60;
};

const parseTime = (value: string) => {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  return match ? Number(match[1]) + Number(match[2]) / 60 : null;
};

function replaceValue(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) => String(values[key] ?? ""));
}

export default function InteractiveHeroDemo({ dictionary: t, locale }: { dictionary: HomeDictionary; locale: Locale }) {
  const [time, setTime] = useState(INITIAL_TIME);
  const [azimuth, setAzimuth] = useState(INITIAL_SUN.azimuth);
  const [elevation, setElevation] = useState(INITIAL_SUN.elevation);
  const [intensity, setIntensity] = useState(INITIAL_SUN.intensity);
  const [sections, setSections] = useState<Omit<SectionEntry, "node">[]>([]);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [lights, setLights] = useState<ModelLightEntry[] | null>(null);
  const [lightsOff, setLightsOff] = useState<Set<string>>(() => new Set());
  const [cameras, setCameras] = useState<{ key: string; label: string }[] | null>(null);
  const [cameraRequest, setCameraRequest] = useState<CameraRequest>(null);
  const [activeTab, setActiveTab] = useState<ControlTab>("lighting");
  const [activeCameraKey, setActiveCameraKey] = useState<string | null>(null);
  const [activeLightKey, setActiveLightKey] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [HeroViewer, setHeroViewer] = useState<HeroViewer | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);

  // Pantalla completa del visor junto con su panel de controles
  useEffect(() => {
    setFullscreenSupported(Boolean(document.fullscreenEnabled));
    const onChange = () => setIsFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen().catch(() => undefined);
  };

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const initializeViewer = () => {
      void import("@/components/three/container-house-hero/ContainerHeroCanvas").then((module) => {
        if (!cancelled) setHeroViewer(() => module.default);
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
      if (timeoutId !== undefined) globalThis.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const hour = nowHour();
    const sun = sunAt(hour);
    setTime(hour);
    setAzimuth(sun.azimuth);
    setElevation(sun.elevation);
    setIntensity(sun.intensity);
  }, []);

  const applyTime = (hour: number) => {
    const sun = sunAt(hour);
    setTime(hour);
    setAzimuth(sun.azimuth);
    setElevation(sun.elevation);
    setIntensity(sun.intensity);
  };

  const timelapse = useTimelapse({ time, onTimeChange: applyTime });

  const setGroupVisible = (items: Omit<SectionEntry, "node">[], visible: boolean) => setHidden((current) => {
    const next = new Set(current);
    items.forEach((item) => (visible ? next.delete(item.key) : next.add(item.key)));
    return next;
  });

  // Prende o apaga de una vez todas las claves de un botón combinado
  const setKeysVisible = (keys: string[], visible: boolean) => setHidden((current) => {
    const next = new Set(current);
    keys.forEach((key) => (visible ? next.delete(key) : next.add(key)));
    return next;
  });

  const setAllSectionsVisible = (visible: boolean) => setHidden(
    visible ? new Set() : new Set(sections.filter((section) => !section.locked).map((section) => section.key)),
  );

  const toggleLight = (key: string) => setLightsOff((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  const setAllLights = (on: boolean) => setLightsOff(on ? new Set() : new Set((lights ?? []).map((light) => light.key)));

  const toggleGroupExpanded = (group: string) => setExpandedGroups((current) => {
    const next = new Set(current);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    return next;
  });

  // Cámara "Camera Inicial" del modelo (también acepta "Initial"): es la que muestra "Vista inicial"
  const homeCamera = cameras?.find((camera) => /inicial|initial/i.test(`${camera.key} ${camera.label}`)) ?? null;

  const requestCamera = (key: string | null, mode: "home" | "view") => {
    setActiveCameraKey(mode === "view" ? key : homeCamera?.key ?? null);
    setCameraRequest({ key, mode, n: Date.now() });
  };

  // Elemento anterior o siguiente de una lista (cámaras o luces), dando la vuelta al llegar al final
  const stepKey = (items: { key: string }[], current: string | null, delta: 1 | -1) => {
    const index = items.findIndex((item) => item.key === current);
    const next = index === -1 ? (delta === 1 ? 0 : items.length - 1) : (index + delta + items.length) % items.length;
    return items[next].key;
  };
  const stepCamera = (delta: 1 | -1) => {
    if (cameras?.length) requestCamera(stepKey(cameras, activeCameraKey ?? homeCamera?.key ?? null, delta), "view");
  };
  const stepLight = (delta: 1 | -1) => {
    if (lights?.length) setActiveLightKey(stepKey(lights, activeLightKey, delta));
  };
  // Tocar el punto de una luz la selecciona y la enciende o apaga
  const selectLight = (key: string) => {
    setActiveLightKey(key);
    toggleLight(key);
  };

  const scene = t.hero.sceneControls;
  const isEnglish = String(locale).toLowerCase().startsWith("en");
  const actionLabels = isEnglish ? ACTION_LABELS.en : ACTION_LABELS.es;
  const visibleLights = (lights ?? []).filter((light) => !lightsOff.has(light.key)).length;
  // Si no hay ninguna cámara elegida, el selector muestra "Camera Inicial" en vez del contador de cámaras
  const activeCamera = cameras?.find((camera) => camera.key === activeCameraKey) ?? homeCamera;
  const activeLight = lights?.find((light) => light.key === activeLightKey) ?? null;

  return (
    <div className="interactive-hero-demo">
      <div className="interactive-hero-stage" ref={stageRef}>
        <div className="interactive-hero-viewer" aria-label={t.hero.panel.aria}>
          {HeroViewer ? (
            <HeroViewer
              time={time}
              azimuth={azimuth}
              elevation={elevation}
              intensity={intensity}
              hidden={hidden}
              lightsOff={lightsOff}
              cameraRequest={cameraRequest}
              onSelectCamera={(key) => requestCamera(key, "view")}
              viewFromLabel={scene.viewFrom}
              onSelectLight={selectLight}
              hotspotMode={activeTab === "cameras" ? "cameras" : activeTab === "lights" ? "lights" : null}
              activeCameraKey={activeCameraKey}
              activeLightKey={activeLightKey}
              onSections={setSections}
              onLights={setLights}
              onCameras={setCameras}
            />
          ) : <span className="container-hero-loader-label">0%</span>}
        </div>

        {/* Selector central: solo con la pestaña Cámaras o la pestaña Luces abierta */}
        {activeTab === "cameras" && cameras !== null && cameras.length > 0 && (
          <HotspotSwitcher
            label={activeCamera ? activeCamera.label : replaceValue(scene.camerasCount, { count: cameras.length })}
            prevLabel={actionLabels.previous}
            nextLabel={actionLabels.next}
            onPrev={() => stepCamera(-1)}
            onNext={() => stepCamera(1)}
          />
        )}
        {activeTab === "lights" && lights !== null && lights.length > 0 && (
          <HotspotSwitcher
            label={activeLight ? activeLight.label : replaceValue(scene.lightsCount, { on: visibleLights, total: lights.length })}
            prevLabel={actionLabels.previous}
            nextLabel={actionLabels.next}
            onPrev={() => stepLight(-1)}
            onNext={() => stepLight(1)}
            onLabelClick={activeLight ? () => toggleLight(activeLight.key) : undefined}
            labelPressed={activeLight ? !lightsOff.has(activeLight.key) : undefined}
          />
        )}

        {!mobilePanelOpen && (
          <button
            className="interactive-hero-panel-trigger"
            type="button"
            aria-controls="interactive-hero-scene-controls"
            aria-expanded={mobilePanelOpen}
            onClick={() => setMobilePanelOpen(true)}
          >
            {t.hero.panel.trigger}
          </button>
        )}

        <aside
          id="interactive-hero-scene-controls"
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
            <HeroActionButtons
              timelapseRunning={timelapse.running}
              onToggleTimelapse={timelapse.toggle}
              fullscreen={isFullscreen}
              onToggleFullscreen={fullscreenSupported ? toggleFullscreen : undefined}
              labels={actionLabels}
            />
            <div className="interactive-hero-tabs" role="tablist" aria-label={scene.tabAria}>
              {TAB_ORDER.map((tab) => (
                <button
                  key={tab}
                  id={`container-hero-tab-${tab}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  aria-controls="container-hero-tab-panel"
                  className="interactive-hero-tab"
                  onClick={() => setActiveTab(tab)}
                >
                  {scene.tabs[tab]}
                </button>
              ))}
            </div>

            <div id="container-hero-tab-panel" className="interactive-hero-controls-content" role="tabpanel" aria-labelledby={`container-hero-tab-${activeTab}`}>
              {activeTab === "lighting" && (
                <>
                  <div className="interactive-hero-time-presets" role="group" aria-label={scene.time}>
                    {PRESETS.map((preset) => {
                      const active = Math.abs(time - preset.hour) < 0.01 || (preset.hour === 24 && time === 0);
                      return (
                        <button key={preset.id} type="button" aria-pressed={active} onClick={() => applyTime(preset.hour)}>
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                  <label className="interactive-hero-range">
                    <span>{scene.time}</span>
                    <input type="range" min={0} max={1440} step={1} value={Math.round(time * 60)} onChange={(event) => applyTime(Number(event.target.value) / 60)} />
                    <output>{formatHour(time)}</output>
                  </label>
                  <div className="interactive-hero-time-input">
                    <label>
                      <span>{scene.exactTime}</span>
                      <input
                        type="time"
                        value={formatHour(time % 24)}
                        onChange={(event) => {
                          const hour = parseTime(event.target.value);
                          if (hour !== null) applyTime(hour);
                        }}
                      />
                    </label>
                    <button type="button" onClick={() => applyTime(nowHour())}>{scene.systemTime}</button>
                  </div>
                  <details className="interactive-hero-advanced">
                    <summary>{actionLabels.advanced}</summary>
                    <div className="interactive-hero-advanced-body">
                      <label className="interactive-hero-range">
                        <span>{scene.azimuth}</span>
                        <input type="range" min={0} max={360} step={1} value={azimuth} onChange={(event) => setAzimuth(Number(event.target.value))} />
                        <output>{azimuth}°</output>
                      </label>
                      <label className="interactive-hero-range">
                        <span>{scene.elevation}</span>
                        <input type="range" min={0} max={90} step={1} value={elevation} onChange={(event) => setElevation(Number(event.target.value))} />
                        <output>{elevation}°</output>
                      </label>
                      <label className="interactive-hero-range">
                        <span>{scene.intensity}</span>
                        <input type="range" min={0} max={5} step={0.1} value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} />
                        <output>{intensity.toFixed(1)}</output>
                      </label>
                    </div>
                  </details>
                </>
              )}

              {activeTab === "sections" && (
                <>
                  <div className="interactive-hero-section-actions">
                    <button type="button" onClick={() => setAllSectionsVisible(true)}>{scene.showAll}</button>
                    <button type="button" onClick={() => setAllSectionsVisible(false)}>{scene.hideAll}</button>
                  </div>
                  <ul className="interactive-hero-list interactive-hero-section-list">
                    {GROUPS.map((group) => {
                      const items = sections.filter((section) => section.group === group);
                      if (items.length === 0) return null;
                      const toggleable = items.filter((item) => !item.locked);
                      const visibleCount = toggleable.filter((item) => !hidden.has(item.key)).length;
                      const groupVisible = visibleCount === toggleable.length;
                      const indeterminate = visibleCount > 0 && visibleCount < toggleable.length;
                      const label = scene.groups[GROUP_LABELS[group]];
                      const open = expandedGroups.has(group);
                      return (
                        <li key={group}>
                          <div className="interactive-hero-section-group">
                            {toggleable.length > 0 && (
                              <input
                                type="checkbox"
                                checked={groupVisible}
                                ref={(element) => { if (element) element.indeterminate = indeterminate; }}
                                onChange={(event) => setGroupVisible(toggleable, event.target.checked)}
                                aria-label={replaceValue(scene.toggleGroup, { name: label })}
                              />
                            )}
                            <button type="button" aria-expanded={open} onClick={() => toggleGroupExpanded(group)}>
                              <span aria-hidden="true">{open ? "▾" : "▸"}</span>
                              <span>{label}</span>
                              <span className="interactive-hero-count">{visibleCount}/{toggleable.length}</span>
                            </button>
                          </div>
                          {open && (
                            <ul className="interactive-hero-list-items">
                              {buildRows(group, toggleable, isEnglish ? "en" : "es").map((row) => (
                                <li key={row.id}>
                                  <label>
                                    <input
                                      type="checkbox"
                                      checked={row.keys.every((key) => !hidden.has(key))}
                                      onChange={(event) => setKeysVisible(row.keys, event.target.checked)}
                                    />
                                    {row.label}
                                  </label>
                                </li>
                              ))}
                              {items.length > toggleable.length && (
                                <li className="interactive-hero-fixed-note">
                                  {items.length - toggleable.length === 1
                                    ? scene.fixedItem
                                    : replaceValue(scene.fixedItems, { count: items.length - toggleable.length })}
                                </li>
                              )}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              {activeTab === "lights" && lights !== null && (
                <>
                  <p className="interactive-hero-count-label">{replaceValue(scene.lightsCount, { on: visibleLights, total: lights.length })}</p>
                  <div className="interactive-hero-section-actions">
                    <button type="button" onClick={() => setAllLights(true)}>{scene.turnOn}</button>
                    <button type="button" onClick={() => setAllLights(false)}>{scene.turnOff}</button>
                  </div>
                </>
              )}

              {activeTab === "cameras" && cameras !== null && (
                <div className="interactive-hero-camera-head interactive-hero-camera-home">
                  <button type="button" onClick={() => requestCamera(null, "home")}>{scene.homeView}</button>
                </div>
              )}

              {activeTab === "lights" && lights !== null && lights.length === 0 && <p className="interactive-hero-empty">{scene.noLights}</p>}
              {activeTab === "cameras" && cameras !== null && cameras.length === 0 && <p className="interactive-hero-empty">{scene.noCameras}</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}