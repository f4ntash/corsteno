"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

function eventNameForAnchor(anchor: HTMLAnchorElement) {
  const href = anchor.href;
  const url = new URL(href, window.location.href);

  if (href.includes("wa.me") || href.includes("whatsapp")) {
    return "whatsapp_click";
  }

  if (
    href.startsWith("mailto:") ||
    url.hash === "#contacto"
  ) {
    return "contact_click";
  }

  if (anchor.dataset.analytics === "external_project_visit") {
    return "project_external_opened";
  }

  if (anchor.dataset.analytics === "project_opened") {
    return "project_opened";
  }

  if (anchor.dataset.analytics === "cta") {
    return "cta_click";
  }

  if (anchor.classList.contains("contextual-cta")) {
    return "cta_click";
  }

  if (
    anchor.closest(
      ".commercial-actions, .service-list, .contact-actions, .seo-actions",
    )
  ) {
    return "cta_click";
  }

  return null;
}

function eventNameForButton(button: HTMLButtonElement) {
  if (button.dataset.analytics === "project_opened") {
    return "project_opened";
  }

  if (
    button.closest(
      ".interior-finishes-variant-options, .exterior-variant-options, .slot-controls",
    )
  ) {
    return "configurator_interaction";
  }

  if (
    button.closest(".showroom-category-tabs, .showroom-project-tabs")
  ) {
    return "project_interaction";
  }

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
    return {
      project_slug: element.dataset.project,
    };
  }

  return element instanceof HTMLAnchorElement
    ? { link_url: element.href }
    : {};
}

function isLocalHostname(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

export default function Analytics() {
  const pathname = usePathname();
  const language = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
  const lastTrackedPath = useRef<string | null>(null);

  const enabled =
    process.env.NODE_ENV === "production" &&
    Boolean(measurementId);

  /*
   * Page views para navegación de Next.js
   */
  useEffect(() => {
    if (!enabled || !measurementId) return;
    if (isLocalHostname(window.location.hostname)) return;

    // La primera vista ya la manda `gtag("config")`.
    // Evitamos duplicarla.
    if (lastTrackedPath.current === null) {
      lastTrackedPath.current = pathname;
      return;
    }

    if (lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;

    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      language,
    });
  }, [pathname, enabled, language]);

  /*
   * Eventos personalizados
   */
  useEffect(() => {
    if (!enabled || !measurementId) return;
    if (isLocalHostname(window.location.hostname)) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;

      const anchor = target?.closest("a");
      const button = target?.closest("button");

      const element = anchor ?? button;

      const name = anchor
        ? eventNameForAnchor(anchor)
        : button
          ? eventNameForButton(button)
          : null;

      if (!name || !element) return;

      window.gtag?.(
        "event",
        name,
        { ...analyticsPayloadForElement(name, element), language },
      );
    };

    const onAnalyticsEvent = (event: Event) => {
      const detail = (
        event as CustomEvent<{
          name?: string;
          payload?: Record<string, unknown>;
        }>
      ).detail;

      if (!detail?.name) return;

      window.gtag?.(
        "event",
        detail.name,
        { ...(detail.payload ?? {}), language },
      );
    };

    const onProjectView = (event: Event) => {
      const detail = (
        event as CustomEvent<{ scene?: number }>
      ).detail;

      window.gtag?.("event", "project_view", {
        scene: detail.scene,
        language,
      });
    };

    window.addEventListener("click", onClick);
    window.addEventListener(
      "forma3d:project-view",
      onProjectView,
    );
    window.addEventListener(
      "corsteno:analytics",
      onAnalyticsEvent,
    );

    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener(
        "forma3d:project-view",
        onProjectView,
      );
      window.removeEventListener(
        "corsteno:analytics",
        onAnalyticsEvent,
      );
    };
  }, [enabled, language]);

  if (!enabled || !measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];

            function gtag(){
              dataLayer.push(arguments);
            }

            window.gtag = gtag;

            gtag('js', new Date());

            gtag('config', '${measurementId}', {
              send_page_view: true
            });
          `,
        }}
      />
    </>
  );
}
