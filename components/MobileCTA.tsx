"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/seo";

export default function MobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroActions = document.querySelector(".commercial-actions");
    const workspace = document.querySelector(".workspace");
    const contact = document.getElementById("contacto");
    if (!heroActions || !workspace || !contact) return;

    let heroActionsVisible = true;
    let workspaceVisible = false;
    let contactVisible = false;
    const updateVisibility = () => setVisible(!heroActionsVisible && !workspaceVisible && !contactVisible);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === heroActions) heroActionsVisible = entry.isIntersecting;
        if (entry.target === workspace) workspaceVisible = entry.isIntersecting;
        if (entry.target === contact) contactVisible = entry.isIntersecting;
      });
      updateVisibility();
    });

    observer.observe(heroActions);
    observer.observe(workspace);
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
