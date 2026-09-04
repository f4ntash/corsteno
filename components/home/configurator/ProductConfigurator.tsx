"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import ProductConfiguratorControls from "./ProductConfiguratorControls";
import ProductConfiguratorSummary from "./ProductConfiguratorSummary";
import { DEFAULT_WINDOW_CONFIGURATION, type WindowConfiguration } from "./types";
import { trackEvent } from "@/lib/analytics";
import styles from "./productConfigurator.module.css";
import type { HomeDictionary, Locale } from "@/lib/i18n";

type ProductConfiguratorProps = {
  className?: string;
  constrained?: boolean;
  dictionary: HomeDictionary;
  locale: Locale;
};

type ConfiguratorCanvas = ComponentType<{ configuration: WindowConfiguration }>;

export default function ProductConfigurator({ className = "", constrained = false, dictionary, locale }: ProductConfiguratorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [configuration, setConfiguration] = useState<WindowConfiguration>({ ...DEFAULT_WINDOW_CONFIGURATION });
  const [ConfiguratorCanvas, setConfiguratorCanvas] = useState<ConfiguratorCanvas | null>(null);
  const demoStartedRef = useRef(false);

  const updateConfiguration = useCallback(
    <Key extends keyof WindowConfiguration,>(key: Key, value: WindowConfiguration[Key]) => {
      if (!demoStartedRef.current) {
        demoStartedRef.current = true;
        trackEvent("configurator_start", { location: "home", language: locale, page_path: window.location.pathname });
      }
      setConfiguration((current) => ({ ...current, [key]: value }));
    },
    [locale],
  );

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void import("./ProductConfiguratorCanvas").then((module) => {
          setConfiguratorCanvas(() => module.default);
        });
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
        {ConfiguratorCanvas ? (
          <ConfiguratorCanvas configuration={configuration} />
        ) : (
          <span className={styles.configuratorPlaceholder} role="status" aria-live="polite">
            {dictionary.demo.loading}
          </span>
        )}
      </div>
      <div className={styles.configuratorPanel}>
        <ProductConfiguratorControls configuration={configuration} onChange={updateConfiguration} dictionary={dictionary} />
        <ProductConfiguratorSummary
          configuration={configuration}
          contactHref={constrained ? "#contacto" : "#configurator-contact"}
          dictionary={dictionary}
          locale={locale}
        />
      </div>
    </div>
  );
}
