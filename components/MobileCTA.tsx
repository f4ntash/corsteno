"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/seo";

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroActions = document.querySelector(".commercial-actions");
    const demo = document.getElementById("demo");
    const projects = document.getElementById("proyectos");
    const contact = document.getElementById("contacto");
    if (!heroActions || !demo || !projects || !contact) return;

    let heroActionsVisible = true;
    let demoVisible = false;
    let projectsVisible = false;
    let contactVisible = false;
    const updateVisibility = () => setVisible(!heroActionsVisible && !demoVisible && !projectsVisible && !contactVisible);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroActions) heroActionsVisible = entry.isIntersecting;
        if (entry.target === demo) demoVisible = entry.isIntersecting;
        if (entry.target === projects) projectsVisible = entry.isIntersecting;
        if (entry.target === contact) contactVisible = entry.isIntersecting;
      });
      updateVisibility();
    });

    observer.observe(heroActions);
    observer.observe(demo);
    observer.observe(projects);
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      className="mobile-sticky-cta"
      href={`${site.basePath}/#contacto`}
      data-analytics="cta"
      data-visible={visible ? "true" : "false"}
    >
      Contanos sobre tu producto
    </a>
  );
}
