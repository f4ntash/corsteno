"use client";

import { useEffect, useState } from "react";
import { withBasePath } from "@/lib/assetPath";

const TERRAMBU_IMAGE_URL = withBasePath("/projects/terrambu-hotel-web.webp");
const MAPA_PUNILLA_IMAGE_URL = withBasePath("/projects/mapa-punilla-web.webp");
const SHOWROOM_3D_IMAGE_URL = withBasePath("/projects/corsteno-showroom-3d.webp");

const featuredProjects = [
  {
    id: "terrambu",
    title: "Terrambú",
    category: "Experiencia web",
    trustLabel: "PROYECTO REAL · HOTELERÍA",
    image: TERRAMBU_IMAGE_URL,
    alt: "Sitio web para hotel boutique Terrambú desarrollado por Corsteno",
  },
  {
    id: "mapa-punilla",
    title: "Mapa Punilla",
    category: "Plataforma interactiva",
    trustLabel: "PROYECTO REAL · TURISMO",
    image: MAPA_PUNILLA_IMAGE_URL,
    alt: "Plataforma web Mapa Punilla desarrollada por Corsteno",
  },
  {
    id: "atlas",
    title: "ATLAS",
    category: "Showroom digital",
    trustLabel: "DEMO CORSTENO · CONFIGURADOR 3D",
    image: SHOWROOM_3D_IMAGE_URL,
    alt: "Configurador 3D interactivo ATLAS desarrollado por Corsteno",
  },
];

const uses = [
  {
    number: "01",
    title: "Productos configurables",
    description:
      "Permití que tus clientes comparen materiales, colores y terminaciones directamente desde la web.",
  },
  {
    number: "02",
    title: "Proyectos en desarrollo",
    description: "Mostrá un producto, espacio o construcción antes de que esté terminado.",
  },
  {
    number: "03",
    title: "Productos complejos",
    description: "Transformá información difícil de explicar en una experiencia visual e interactiva.",
  },
];

const services = [
  {
    number: "01",
    title: "Configuradores 3D",
    description:
      "Experiencias interactivas donde el usuario puede visualizar un producto y modificar sus características en tiempo real.",
    examples: "Muebles · Arquitectura · Piscinas · Aberturas · Equipamiento",
    href: "#showroom-3d",
    cta: "Ver proyectos →",
  },
  {
    number: "02",
    title: "Desarrollo web interactivo",
    description:
      "Sitios y plataformas digitales diseñados para presentar servicios, productos y experiencias con mayor claridad.",
    examples: "Hotelería · Turismo · Empresas · Productos digitales",
    href: "#showroom-web",
    cta: "Ver proyectos →",
  },
  {
    number: "03",
    title: "Realidad aumentada y virtual",
    description:
      "Experiencias inmersivas para visualizar productos y espacios dentro de contextos reales o virtuales.",
    examples: "Arquitectura · Real Estate · Producto · Showrooms",
    href: "#showroom-inmersivo",
    cta: "Próximamente",
  },
];

const industries = [
  {
    title: "Muebles y equipamiento",
    description: "Configuración de materiales, colores y componentes.",
  },
  {
    title: "Arquitectura y construcción",
    description: "Visualización de proyectos y terminaciones.",
  },
  {
    title: "Piscinas y exteriores",
    description: "Configuración y preventa de proyectos.",
  },
  {
    title: "Real estate",
    description: "Presentación de desarrollos antes de su finalización.",
  },
  {
    title: "Hotelería y turismo",
    description: "Experiencias digitales orientadas a comunicar mejor el lugar.",
  },
  {
    title: "Industria",
    description: "Visualización de productos técnicos y configurables.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Nos mostrás tu producto",
    description: "Foto, catálogo, plano o referencia.",
  },
  {
    number: "02",
    title: "Preparamos la experiencia",
    description: "Adaptamos la solución al producto, materiales y variantes.",
  },
  {
    number: "03",
    title: "Tus clientes pueden explorarlo",
    description: "Lo integramos a una experiencia web preparada para compartir y vender.",
  },
];

export default function CommercialIntro() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featuredProject = featuredProjects[featuredIndex];
  const secondaryProjects = featuredProjects.filter((_, index) => index !== featuredIndex);

  useEffect(() => {
    setFeaturedIndex(Math.floor(Math.random() * featuredProjects.length));
  }, []);

  const openShowroomScene = (scene: number) => {
    window.dispatchEvent(new CustomEvent("forma3d:showroom-scene", { detail: { scene } }));
  };

  return (
    <>
      <section className="commercial-hero" id="que-hacemos" data-od-id="que-hacemos">
        <div className="commercial-hero-copy">
          <span className="label">Visualización digital interactiva</span>
          <h1>
            Hacemos que tus productos
            <br />
            se puedan ver, probar y
            <br />
            entender antes de comprarlos.
          </h1>
          <p>
            Creamos configuradores 3D, experiencias web y soluciones inmersivas para empresas que necesitan mostrar
            mejor lo que venden.
          </p>
          <ul className="commercial-hero-services" aria-label="Servicios principales">
            <li>Configuradores 3D</li>
            <li>Experiencias web</li>
            <li>Realidad aumentada y virtual</li>
          </ul>
          <div className="commercial-actions">
            <a href="#proyectos">Ver proyectos</a>
            <a href="#contacto">Contanos sobre tu producto</a>
          </div>
          <div className="commercial-proof" aria-label="Áreas de trabajo">
            <span>3D</span>
            <span>Web</span>
            <span>RA / RV</span>
          </div>
        </div>
        <div className="commercial-hero-visual" aria-label="Proyectos de Corsteno">
          <figure className="hero-project hero-project-primary">
            <img src={featuredProject.image} alt={featuredProject.alt} />
            <figcaption>
              <span>{featuredProject.category} · {featuredProject.title}</span>
              <span className="project-trust-label">{featuredProject.trustLabel}</span>
            </figcaption>
          </figure>
          {secondaryProjects.map((project) => (
            <figure className="hero-project hero-project-secondary" key={project.id}>
              <img src={project.image} alt={project.alt} />
              <figcaption>
                <span>{project.category} · {project.title}</span>
                <span className="project-trust-label">{project.trustLabel}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="commercial-section problem-section">
        <header className="commercial-section-head">
          <span className="label">Qué resolvemos</span>
          <h2>
            Soluciones para productos
            <br />
            que necesitan ser explicados visualmente
          </h2>
          <p>
            Ayudamos a empresas a presentar productos, espacios y proyectos de una forma más clara, interactiva y fácil
            de entender.
          </p>
        </header>
        <ol className="editorial-list">
          {uses.map((item) => (
            <li key={item.number}>
              <span className="cap-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ol>
        <p className="commercial-trust-statement">
          No empezamos de cero en cada proyecto. Adaptamos una base interactiva ya desarrollada a cada producto, sus
          materiales y variantes.
        </p>
        <div className="commercial-process" aria-labelledby="como-funciona-title">
          <header>
            <span className="label">Cómo funciona</span>
            <h3 id="como-funciona-title">Del producto a una experiencia lista para compartir.</h3>
          </header>
          <ol className="editorial-list process-list">
            {processSteps.map((step) => (
              <li key={step.number}>
                <span className="cap-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="commercial-section services-section">
        <header className="commercial-section-head">
          <span className="label">Servicios</span>
          <h2>Nuestros servicios</h2>
          <p>Tecnología aplicada a la presentación y comercialización de productos y proyectos.</p>
        </header>
        <ol className="service-list">
          {services.map((service, index) => (
            <li key={service.number} id={`servicio-${service.number}`}>
              <span className="cap-number">{service.number}</span>
              <div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className="service-examples">{service.examples}</span>
              </div>
              <a href="#showroom-3d" onClick={() => openShowroomScene(index === 0 ? 0 : index === 1 ? 1 : 3)}>
                {service.cta}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <section className="commercial-section industries-section">
        <header className="commercial-section-head">
          <span className="label">Aplicaciones</span>
          <h2>¿Dónde podemos aplicarlo?</h2>
          <p>Industrias donde la visualización interactiva ayuda a explicar, cotizar o vender mejor.</p>
        </header>
        <ol className="industry-list">
          {industries.map((industry, index) => (
            <li key={industry.title}>
              <span className="cap-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{industry.title}</h3>
              <p>{industry.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
