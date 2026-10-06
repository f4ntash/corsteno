"use client";

import { useEffect, useState, type ComponentType } from "react";
import { formatHour, PRESETS, sunAt } from "@/components/three/container-house-hero/presets";
import type { CameraRequest } from "@/components/three/container-house-hero/cameras";
import type { ModelLightEntry } from "@/components/three/container-house-hero/lights";
import { GROUPS, GROUP_LABELS, type SectionEntry } from "@/components/three/container-house-hero/sections";
import HeroActionButtons from "@/components/three/container-house-hero/HeroActionButtons";
import { useTimelapse } from "@/components/three/container-house-hero/useTimelapse";
import type { HomeDictionary, Locale } from "@/lib/i18n";

type HeroViewerProps = {
  time: number;
  azimuth: number;
  elevation: number;
  intensity: number;
  showClouds: boolean;
  showStars: boolean;
  hidden: Set<string>;
  lightsOff: Set<string>;
  cameraRequest: CameraRequest;
  autoRotate: boolean;
  onAutoRotateChange: (value: boolean) => void;
  onSelectCamera: (key: string) => void;
  viewFromLabel: string;
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
  es: { autoRotateOff: "Rotar automáticamente", autoRotateOn: "Detener rotación", timelapseOff: "Comenzar timelapse", timelapseOn: "Detener timelapse" },
  en: { autoRotateOff: "Rotate automatically", autoRotateOn: "Stop rotation", timelapseOff: "Start timelapse", timelapseOn: "Stop timelapse" },
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
  const [showClouds, setShowClouds] = useState(true);
  const [showStars, setShowStars] = useState(true);
  const [sections, setSections] = useState<Omit<SectionEntry, "node">[]>([]);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [lights, setLights] = useState<ModelLightEntry[] | null>(null);
  const [lightsOff, setLightsOff] = useState<Set<string>>(() => new Set());
  const [autoRotate, setAutoRotate] = useState(false);
  const [cameras, setCameras] = useState<{ key: string; label: string }[] | null>(null);
  const [cameraRequest, setCameraRequest] = useState<CameraRequest>(null);
  const [activeTab, setActiveTab] = useState<ControlTab>("lighting");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => new Set());
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [HeroViewer, setHeroViewer] = useState<HeroViewer | null>(null);

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

  const toggleSection = (key: string) => setHidden((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });

  const setGroupVisible = (items: Omit<SectionEntry, "node">[], visible: boolean) => setHidden((current) => {
    const next = new Set(current);
    items.forEach((item) => (visible ? next.delete(item.key) : next.add(item.key)));
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

  const requestCamera = (key: string | null, mode: "home" | "view") => {
    setCameraRequest({ key, mode, n: Date.now() });
  };

  const scene = t.hero.sceneControls;
  const actionLabels = String(locale).toLowerCase().startsWith("en") ? ACTION_LABELS.en : ACTION_LABELS.es;
  const visibleLights = (lights ?? []).filter((light) => !lightsOff.has(light.key)).length;

  return (
    <div className="interactive-hero-demo">
      <div className="interactive-hero-stage">
        <div className="interactive-hero-viewer" aria-label={t.hero.panel.aria}>
          {HeroViewer ? (
            <HeroViewer
              time={time}
              azimuth={azimuth}
              elevation={elevation}
              intensity={intensity}
              showClouds={showClouds}
              showStars={showStars}
              hidden={hidden}
              lightsOff={lightsOff}
              cameraRequest={cameraRequest}
              autoRotate={autoRotate}
              onAutoRotateChange={setAutoRotate}
              onSelectCamera={(key) => requestCamera(key, "view")}
              viewFromLabel={scene.viewFrom}
              onSections={setSections}
              onLights={setLights}
              onCameras={setCameras}
            />
          ) : <span className="container-hero-loader-label">0%</span>}
        </div>

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
              autoRotate={autoRotate}
              onToggleAutoRotate={() => setAutoRotate((value) => !value)}
              timelapseRunning={timelapse.running}
              onToggleTimelapse={timelapse.toggle}
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
                  <div className="interactive-hero-checks">
                    <label><input type="checkbox" checked={showClouds} onChange={(event) => setShowClouds(event.target.checked)} />{scene.clouds}</label>
                    <label><input type="checkbox" checked={showStars} onChange={(event) => setShowStars(event.target.checked)} />{scene.stars}</label>
                  </div>
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
                              {toggleable.map((section) => (
                                <li key={section.key}>
                                  <label><input type="checkbox" checked={!hidden.has(section.key)} onChange={() => toggleSection(section.key)} />{section.label}</label>
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
                  <ul className="interactive-hero-list interactive-hero-light-list">
                    {lights.map((light) => (
                      <li key={light.key}>
                        <label>
                          <input type="checkbox" checked={!lightsOff.has(light.key)} onChange={() => toggleLight(light.key)} />
                          <span>{light.label}</span>
                          <span className="interactive-hero-origin">{light.origin === "glb" ? scene.sourceGlb : scene.sourceThree}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {activeTab === "cameras" && cameras !== null && (
                <>
                  <div className="interactive-hero-camera-head">
                    <span>{replaceValue(scene.camerasCount, { count: cameras.length })}</span>
                    <button type="button" onClick={() => requestCamera(null, "home")}>{scene.homeView}</button>
                  </div>
                  <ul className="interactive-hero-list interactive-hero-camera-list">
                    {cameras.map((camera) => (
                      <li key={camera.key}>
                        <span>{camera.label}</span>
                        <button type="button" onClick={() => requestCamera(camera.key, "view")}>{scene.viewFrom}</button>
                      </li>
                    ))}
                  </ul>
                </>
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
