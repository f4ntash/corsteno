"use client";

import { useEffect, useState } from "react";
import logoCorsteno from "./logoSombreado.png";

const navItems = [
  { href: "#que-hacemos", key: "que-hacemos", label: "Qué hacemos" },
  { href: "#proyectos", key: "proyectos", label: "Proyectos" },
  { href: "#capacidades", key: "capacidades", label: "Capacidades" },
  { href: "#contacto", key: "contacto", label: "Contacto" },
];

type ChromeState = {
  dark?: boolean;
  compact?: boolean;
};

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("trabajo");
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const onChrome = (event: Event) => {
      const detail = (event as CustomEvent<ChromeState>).detail;
      if (typeof detail.dark === "boolean") setDark(detail.dark);
      if (typeof detail.compact === "boolean") setCompact(detail.compact);
    };

    window.addEventListener("forma3d:chrome", onChrome);
    return () => window.removeEventListener("forma3d:chrome", onChrome);
  }, []);

  useEffect(() => {
    const sections = ["que-hacemos", "proyectos", "capacidades", "contacto"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          setActiveNav(id);
          if (id === "capacidades") setDark(false);
          if (id === "contacto") setDark(true);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`workspace-nav${compact ? " compact" : ""}${dark ? " dark" : ""}`}
      aria-label="Navegación principal"
      data-od-id="navegacion-principal"
    >
      <a className="brand" href="#que-hacemos" data-od-id="marca-corsteno" onClick={closeMenu}>
        {/* CORSTENO_LOGO_HERE — Logo oficial de Corsteno */}
        <img
          className="brand-logo"
          src={logoCorsteno.src}
          width={logoCorsteno.width}
          height={logoCorsteno.height}
          alt=""
          aria-hidden="true"
        />
        <span className="brand-copy">
          <span className="brand-name">Corsteno</span>
          <span className="brand-tagline">Interactive Technologies</span>
        </span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="nav-links"
        data-od-id="abrir-navegacion"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "Cerrar" : "Menú"}
      </button>
      <div className={`nav-links${menuOpen ? " open" : ""}`} id="nav-links">
        {navItems.map((item) => (
          <a
            key={item.key}
            href={item.href}
            data-nav={item.key}
            data-od-id={`nav-${item.key}`}
            aria-current={activeNav === item.key ? "true" : undefined}
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
