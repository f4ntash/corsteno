"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import IndustrialConfiguratorCanvas from "./IndustrialConfiguratorCanvas";
import IndustrialConfiguratorControls from "./IndustrialConfiguratorControls";
import IndustrialConfiguratorSummary from "./IndustrialConfiguratorSummary";
import { DEFAULT_WINDOW_CONFIGURATION, type WindowConfiguration } from "./types";
import { trackEvent } from "@/lib/analytics";
import styles from "./industrial.module.css";

type IndustrialConfiguratorProps = {
  className?: string;
  constrained?: boolean;
};

export default function IndustrialConfigurator({ className = "", constrained = false }: IndustrialConfiguratorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [configuration, setConfiguration] = useState<WindowConfiguration>({ ...DEFAULT_WINDOW_CONFIGURATION });
  const [canvasReady, setCanvasReady] = useState(false);
  const demoStartedRef = useRef(false);

  const updateConfiguration = useCallback(
    <Key extends keyof WindowConfiguration,>(key: Key, value: WindowConfiguration[Key]) => {
      if (!demoStartedRef.current) {
        demoStartedRef.current = true;
        trackEvent("demo_started", { source: "configurator-demo" });
      }
      trackEvent("demo_configuration_changed", {
        category: String(key),
        option: String(value),
      });
      setConfiguration((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setCanvasReady(true);
        observer.disconnect();
      },
      { rootMargin: "320px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`${styles.configurator}${constrained ? ` ${styles.configuratorConstrained}` : ""} ${className}`.trim()}
    >
      <div ref={canvasRef} className={styles.configuratorVisual}>
        {canvasReady ? (
          <IndustrialConfiguratorCanvas configuration={configuration} />
        ) : (
          <span className={styles.configuratorPlaceholder}>Preparando configurador 3D</span>
        )}
      </div>
      <div className={styles.configuratorPanel}>
        <IndustrialConfiguratorControls configuration={configuration} onChange={updateConfiguration} />
        <IndustrialConfiguratorSummary
          configuration={configuration}
          contactHref={constrained ? "#contacto" : "#industrial-contact"}
        />
      </div>
    </div>
  );
}
