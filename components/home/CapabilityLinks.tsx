"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { withBasePath } from "@/lib/assetPath";
import styles from "./homeExperience.module.css";

type Capability = { id: string; number: string; href: string; priority: "primary" | "secondary" };
type Copy = { readonly title: string; readonly description: string; readonly action: string };

export default function CapabilityLinks({ capabilities, copy }: { capabilities: Capability[]; copy: readonly Copy[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        trackEvent("home_capabilities_view", { location: "home_selected_work" });
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const interact = (id: string, type: "hover" | "focus" | "tap") => trackEvent("capability_interaction", { capability: id, location: "home_selected_work", interaction_type: type });
  return <div ref={ref} className={styles.capabilityGrid}>
    {capabilities.map((capability, index) => {
      const item = copy[index];
      return <article className={`${styles.capabilityItem} ${styles[`capability${capability.priority === "primary" ? "Primary" : "Secondary"}`]}`} key={capability.id}>
        <span className={styles.capabilityNumber}>{capability.number}</span>
        <div className={styles.capabilityBody}>
          <h3>{item.title}</h3><p>{item.description}</p>
          <a href={withBasePath(capability.href)} onMouseEnter={() => interact(capability.id, "hover")} onFocus={() => interact(capability.id, "focus")} onClick={() => { interact(capability.id, "tap"); trackEvent("capability_cta_click", { capability: capability.id, cta_label: item.action, destination: capability.href, location: "home_capabilities" }); }}>{item.action} <span aria-hidden="true">→</span></a>
        </div>
      </article>;
    })}
  </div>;
}
