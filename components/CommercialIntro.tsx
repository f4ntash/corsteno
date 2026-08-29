"use client";

import { useState } from "react";
import { withBasePath } from "@/lib/assetPath";
import DigitalLayerSection from "./home/DigitalLayerSection";
import ProcessComparisonSection from "./home/ProcessComparisonSection";

const INTERIOR_IMAGE_URL = withBasePath("/projects/revestimientos-interactivos.png");
const finishOptions = ["Pared", "Barra", "Piso", "Abertura"] as const;

export default function CommercialIntro() {
  const [comparison, setComparison] = useState(50);
  const [activeFinish, setActiveFinish] = useState<(typeof finishOptions)[number]>("Pared");

  return (
    <>
      <section className="commercial-hero" id="inicio" data-od-id="que-hacemos" data-navbar-theme="light">
        <div className="commercial-hero-copy">
          <span className="label">Experiencias digitales para productos, marcas y negocios</span>
          <h1>
            Hacemos que tus productos
            <br />
            se puedan ver, probar y
            <br />
            entender antes de comprarlos.
          </h1>
          <p>
            Creamos configuradores 3D, experiencias interactivas y productos web que transforman cómo las empresas
            presentan, personalizan y venden.
          </p>
          <ul className="commercial-hero-services" aria-label="Servicios principales">
            <li>Configuradores 3D</li>
            <li>Experiencias digitales</li>
            <li>Desarrollo web</li>
          </ul>
          <div className="commercial-actions">
            <a className="commercial-action-primary" href="#contacto">Contanos sobre tu producto</a>
            <a className="commercial-action-secondary" href="#proyectos">Ver proyectos</a>
          </div>
          <div className="commercial-proof" aria-label="Áreas de trabajo">
            <span>3D</span>
            <span>Interacción</span>
            <span>Web</span>
          </div>
        </div>
        <div className="commercial-hero-visual">
          <div className="hero-comparison" data-finish={activeFinish.toLowerCase()}>
            <div className="hero-comparison-stage">
              <img
                className="hero-comparison-after"
                src={INTERIOR_IMAGE_URL}
                alt="Ambiente interior presentado como experiencia visual interactiva"
              />
              <div
                className="hero-comparison-before"
                style={{ clipPath: `inset(0 ${100 - comparison}% 0 0)` }}
                aria-hidden="true"
              >
                <img src={INTERIOR_IMAGE_URL} alt="" />
              </div>
              <span className="hero-comparison-badge hero-comparison-badge-before">Antes</span>
              <span className="hero-comparison-badge hero-comparison-badge-after">Después: experiencia interactiva</span>
              <span className="hero-comparison-divider" style={{ left: `${comparison}%` }} aria-hidden="true">
                <span>↔</span>
              </span>
              <input
                className="hero-comparison-range"
                type="range"
                min="8"
                max="92"
                value={comparison}
                aria-label="Comparar imagen estática y experiencia interactiva"
                onChange={(event) => setComparison(Number(event.currentTarget.value))}
              />
              <div className="hero-comparison-options" aria-label="Opciones de la experiencia">
                <span>Configuración</span>
                {finishOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    aria-pressed={activeFinish === option}
                    onClick={() => setActiveFinish(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="hero-comparison-toolbar" aria-label="Controles disponibles en una experiencia interactiva">
              <span>Rotar</span>
              <span>Zoom</span>
              <span>Vista</span>
              <span>Pantalla completa</span>
            </div>
            <p>De una imagen estática a una experiencia que tu cliente puede explorar.</p>
          </div>
        </div>
      </section>

      <ProcessComparisonSection />
      <DigitalLayerSection />
    </>
  );
}
