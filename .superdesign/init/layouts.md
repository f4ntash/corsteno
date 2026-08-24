# Layouts

## Root layout
Source: `app/layout.tsx`

```tsx
import type { Metadata, Viewport } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Corsteno — Workspace interactivo",
  description: "Corsteno — 3D interactivo, web y sistemas digitales.",
};

export const viewport: Viewport = { themeColor: "#f6f6f3" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-AR"><body>{children}</body></html>;
}
```

## Navigation
Source: `components/Navigation.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";

const navItems = [
  { href: "#trabajo", key: "trabajo", label: "Trabajo" },
  { href: "#capacidades", key: "capacidades", label: "Capacidades" },
  { href: "#contacto", key: "contacto", label: "Contacto" },
];

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
      const detail = (event as CustomEvent<{ dark?: boolean; compact?: boolean }>).detail;
      if (typeof detail.dark === "boolean") setDark(detail.dark);
      if (typeof detail.compact === "boolean") setCompact(detail.compact);
    };
    window.addEventListener("forma3d:chrome", onChrome);
    return () => window.removeEventListener("forma3d:chrome", onChrome);
  }, []);
  useEffect(() => {
    const sections = ["trabajo", "capacidades", "contacto"]
      .map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      setActiveNav(entry.target.id);
      if (entry.target.id === "capacidades") setDark(false);
      if (entry.target.id === "contacto") setDark(true);
    }), { rootMargin: "-35% 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const closeMenu = () => setMenuOpen(false);
  return (
    <nav className={`workspace-nav${compact ? " compact" : ""}${dark ? " dark" : ""}`} aria-label="Navegación principal">
      <a className="brand" href="#trabajo" onClick={closeMenu}>Corsteno</a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="nav-links"
        onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "Cerrar" : "Menú"}</button>
      <div className={`nav-links${menuOpen ? " open" : ""}`} id="nav-links">
        {navItems.map((item) => <a key={item.key} href={item.href} aria-current={activeNav === item.key ? "true" : undefined}
          onClick={closeMenu}>{item.label}</a>)}
      </div>
    </nav>
  );
}
```
