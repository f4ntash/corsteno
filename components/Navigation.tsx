"use client";

import { useEffect, useRef, useState } from "react";
import logoCorsteno from "./logoSombreado.png";

const navItems = [
  { href: "#que-hacemos", key: "que-hacemos", label: "Qué hacemos" },
  { href: "#proyectos", key: "proyectos", label: "Proyectos" },
  { href: "#capacidades", key: "capacidades", label: "Capacidades" },
  { href: "#contacto", key: "contacto", label: "Contacto" },
];

const navKeys = new Set(navItems.map((item) => item.key));

type ChromeState = {
  dark?: boolean;
  compact?: boolean;
};

export default function Navigation() {
  const activeThemeSectionRef = useRef("");
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
      if (typeof detail.dark === "boolean" && activeThemeSectionRef.current === "showroom-3d") {
        setDark(detail.dark);
      }
      if (typeof detail.compact === "boolean") setCompact(detail.compact);
    };

    window.addEventListener("forma3d:chrome", onChrome);
    return () => window.removeEventListener("forma3d:chrome", onChrome);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-navbar-theme]"));
    const syncTheme = () => {
      const section = document
        .elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.35)
        ?.closest<HTMLElement>("[data-navbar-theme]");

      if (!section) return;
      activeThemeSectionRef.current = section.id;
      setDark(section.dataset.navbarTheme === "dark");
    };
    const requestThemeSync = () => window.requestAnimationFrame(syncTheme);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target as HTMLElement;
          if (navKeys.has(section.id)) setActiveNav(section.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );

    const themeObserver = new MutationObserver(syncTheme);

    sections.forEach((section) => {
      observer.observe(section);
      themeObserver.observe(section, { attributes: true, attributeFilter: ["data-navbar-theme"] });
    });
    window.addEventListener("scroll", requestThemeSync, { passive: true });
    window.addEventListener("resize", requestThemeSync);
    syncTheme();
    return () => {
      observer.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("scroll", requestThemeSync);
      window.removeEventListener("resize", requestThemeSync);
    };
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
