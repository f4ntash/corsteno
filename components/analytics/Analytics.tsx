"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const productionAnalyticsEnabled = process.env.NODE_ENV === "production" && Boolean(measurementId);

function eventNameForAnchor(anchor: HTMLAnchorElement) {
  const href = anchor.href;
  if (href.includes("wa.me") || href.includes("whatsapp")) return "whatsapp_click";
  if (href.startsWith("mailto:") || anchor.getAttribute("href") === "#contacto") return "contact_click";
  if (anchor.dataset.analytics === "external_project_visit") return "project_external_opened";
  if (anchor.dataset.analytics === "project_opened") return "project_opened";
  if (anchor.dataset.analytics === "cta") return "cta_click";
  if (anchor.classList.contains("contextual-cta")) return "cta_click";
  if (anchor.closest(".commercial-actions, .service-list, .contact-actions, .seo-actions")) return "cta_click";
  return null;
}

function eventNameForButton(button: HTMLButtonElement) {
  if (button.dataset.analytics === "project_opened") return "project_opened";
  if (button.closest(".interior-finishes-variant-options, .exterior-variant-options, .slot-controls")) return "configurator_interaction";
  if (button.closest(".showroom-category-tabs, .showroom-project-tabs")) return "project_interaction";
  return null;
}

function analyticsPayloadForElement(
  name: string,
  element: HTMLAnchorElement | HTMLButtonElement,
) {
  if (name === "project_opened") {
    return {
      project_slug: element.dataset.project,
      project_type: element.dataset.projectType,
    };
  }

  if (name === "project_external_opened") {
    return { project_slug: element.dataset.project };
  }

  return element instanceof HTMLAnchorElement ? { link_url: element.href } : {};
}

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export default function Analytics() {
  const pathname = usePathname();
  const [runtimeEnabled, setRuntimeEnabled] = useState(false);
  const [analyticsReady, setAnalyticsReady] = useState(false);
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!productionAnalyticsEnabled) return;
    setRuntimeEnabled(!isLocalHostname(window.location.hostname));
  }, []);

  useEffect(() => {
    if (!runtimeEnabled || !measurementId) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
    setAnalyticsReady(true);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      const button = target?.closest("button");
      const element = anchor ?? button;
      const name = anchor ? eventNameForAnchor(anchor) : button ? eventNameForButton(button) : null;

      if (!name || !element) return;
      window.gtag?.("event", name, analyticsPayloadForElement(name, element));
    };

    const onAnalyticsEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ name?: string; payload?: Record<string, unknown> }>).detail;
      if (!detail?.name) return;
      window.gtag?.("event", detail.name, detail.payload ?? {});
    };

    const onProjectView = (event: Event) => {
      const detail = (event as CustomEvent<{ scene?: number }>).detail;
      window.gtag?.("event", "project_view", { scene: detail.scene });
    };

    window.addEventListener("click", onClick);
    window.addEventListener("forma3d:project-view", onProjectView);
    window.addEventListener("corsteno:analytics", onAnalyticsEvent);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("forma3d:project-view", onProjectView);
      window.removeEventListener("corsteno:analytics", onAnalyticsEvent);
    };
  }, [runtimeEnabled]);

  useEffect(() => {
    if (!analyticsReady || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_title: document.title,
    });
  }, [analyticsReady, pathname]);

  if (!runtimeEnabled || !measurementId) return null;

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
    />
  );
}
