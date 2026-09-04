"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/assetPath";
import logoCorsteno from "./logoSombreado.png";
import { esHome, type HomeDictionary, type Locale } from "@/lib/i18n";
import { homePath } from "@/lib/i18n/routes";
import { trackEvent } from "@/lib/analytics";

const navItems = [
  { href: "#inicio", key: "inicio" },
  { href: "#proyectos", key: "proyectos" },
  { href: "#demo", key: "demo" },
  { href: "#soluciones", key: "soluciones" },
  { href: "#contacto", key: "contacto" },
];

type ChromeState = {
  dark?: boolean;
  compact?: boolean;
};

type NavigationProps = {
  home?: boolean;
  locale?: Locale;
  dictionary?: HomeDictionary;
  languageHref?: string;
  homePathPrefix?: string;
};

export default function Navigation({ home = false, locale = "es", dictionary = esHome, languageHref, homePathPrefix }: NavigationProps) {
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
  const navigationHref = (anchor: string) => home ? anchor : withBasePath(`${homePathPrefix ?? ""}/${anchor}`);

  return (
    <nav
      className={`workspace-nav${compact ? " compact" : ""}${dark ? " dark" : ""}`}
      aria-label={dictionary.nav.aria}
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
        {menuOpen ? dictionary.nav.close : dictionary.nav.open}
      </button>
      <div className={`nav-links${menuOpen ? " open" : ""}`} id="nav-links">
        {navItems.map((item, index) => (
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
            {dictionary.nav.items[index]}
          </a>
        ))}
        {home || languageHref ? (
          <div className="nav-language" aria-label={dictionary.nav.language}>
            <a aria-current={locale === "es" ? "page" : undefined} href={withBasePath(home ? homePath("es") : languageHref!)} onClick={() => { localStorage.setItem("corsteno-locale", "es"); if (locale !== "es") trackEvent("language_switch", { from_language: "en", to_language: "es", page_path: location.pathname }); }}>ES</a>
            <span aria-hidden="true">/</span>
            <a aria-current={locale === "en" ? "page" : undefined} aria-label={dictionary.nav.switchLabel} href={withBasePath(home ? homePath("en") : languageHref!)} onClick={() => { localStorage.setItem("corsteno-locale", "en"); if (locale !== "en") trackEvent("language_switch", { from_language: "es", to_language: "en", page_path: location.pathname }); }}>EN</a>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
