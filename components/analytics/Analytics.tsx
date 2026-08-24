"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const gaId = process.env.NEXT_PUBLIC_GA_ID;

function eventNameForAnchor(anchor: HTMLAnchorElement) {
  const href = anchor.href;
  if (href.includes("wa.me") || href.includes("whatsapp")) return "whatsapp_click";
  if (href.startsWith("mailto:") || anchor.getAttribute("href") === "#contacto") return "contact_click";
  if (anchor.dataset.analytics === "external_project_visit") return "external_project_visit";
  if (anchor.dataset.analytics === "cta") return "cta_click";
  if (anchor.classList.contains("contextual-cta")) return "cta_click";
  if (anchor.closest(".commercial-actions, .service-list, .contact-actions, .seo-actions")) return "cta_click";
  return null;
}

function eventNameForButton(button: HTMLButtonElement) {
  if (button.closest(".h2o-variant-options, .exterior-variant-options, .slot-controls")) return "configurator_interaction";
  if (button.closest(".showroom-category-tabs, .showroom-project-tabs")) return "project_interaction";
  return null;
}

export default function Analytics() {
  useEffect(() => {
    if (!gaId) return;

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      const button = target?.closest("button");
      const name = anchor ? eventNameForAnchor(anchor) : button ? eventNameForButton(button) : null;

      if (!name) return;
      window.gtag?.("event", name, {
        link_url: anchor?.href,
        text: (anchor ?? button)?.textContent?.trim(),
      });
    };

    const onProjectView = (event: Event) => {
      const detail = (event as CustomEvent<{ scene?: number }>).detail;
      window.gtag?.("event", "project_view", { scene: detail.scene });
    };

    window.addEventListener("click", onClick);
    window.addEventListener("forma3d:project-view", onProjectView);
    return () => {
      window.removeEventListener("click", onClick);
      window.removeEventListener("forma3d:project-view", onProjectView);
    };
  }, []);

  if (!gaId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
