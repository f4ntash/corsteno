"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assetPath";
import logoCorsteno from "./logoSombreado.png";

const navItems = [
  { href: "#inicio", key: "inicio", label: "Inicio" },
  { href: "#proyectos", key: "proyectos", label: "Proyectos" },
  { href: "#demo", key: "demo", label: "Demo" },
  { href: "#soluciones", key: "soluciones", label: "Soluciones" },
  { href: "#contacto", key: "contacto", label: "Contacto" },
];

type ChromeState = {
  dark?: boolean;
  compact?: boolean;
};

type NavigationProps = {
  home?: boolean;
};

export default function Navigation({ home = false }: NavigationProps) {
  const activeThemeSectionRef = useRef("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("inicio");
  const [dark, setDark] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
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
    const themedSections = Array.from(document.querySelectorAll<HTMLElement>("[data-navbar-theme]"));
    const syncChrome = () => {
      const point = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.35);
      const section = point?.closest<HTMLElement>("[data-navbar-theme]");
      const navSection = point?.closest<HTMLElement>("[data-nav-section]");

      if (section) {
        activeThemeSectionRef.current = section.id;
        setDark(section.dataset.navbarTheme === "dark");
      }
      if (navSection?.dataset.navSection) setActiveNav(navSection.dataset.navSection);
    };
    const requestChromeSync = () => window.requestAnimationFrame(syncChrome);

    const themeObserver = new MutationObserver(syncChrome);

    themedSections.forEach((section) => {
      themeObserver.observe(section, { attributes: true, attributeFilter: ["data-navbar-theme"] });
    });
    window.addEventListener("scroll", requestChromeSync, { passive: true });
    window.addEventListener("resize", requestChromeSync);
    syncChrome();
    return () => {
      themeObserver.disconnect();
      window.removeEventListener("scroll", requestChromeSync);
      window.removeEventListener("resize", requestChromeSync);
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const navigationHref = (anchor: string) => home ? anchor : withBasePath(`/${anchor}`);

  return (
    <nav
      className={`workspace-nav${compact ? " compact" : ""}${dark ? " dark" : ""}`}
      aria-label="Navegación principal"
      data-od-id="navegacion-principal"
    >
      <a
        className="brand"
        href={navigationHref("#inicio")}
        data-od-id="marca-corsteno"
        onClick={() => {
          setActiveNav("inicio");
          closeMenu();
        }}
      >
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
        ref={menuButtonRef}
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
            href={navigationHref(item.href)}
            data-nav={item.key}
            data-od-id={`nav-${item.key}`}
            aria-current={activeNav === item.key ? "location" : undefined}
            onClick={() => {
              setActiveNav(item.key);
              closeMenu();
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
