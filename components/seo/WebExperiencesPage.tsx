import JsonLd from "@/components/seo/JsonLd";
import Image from "next/image";
import Navigation from "@/components/Navigation";
import ActionButton from "@/components/atoms/ActionButton";
import CapabilityPageTracking from "@/components/analytics/CapabilityPageTracking";
import type { Locale } from "@/lib/i18n";
import { site, canonicalUrl, breadcrumbJsonLd, organizationJsonLd, serviceJsonLd, faqJsonLd, type SeoPage } from "@/lib/seo";
import { localizedRoutes } from "@/lib/i18n/routes";
import styles from "./webExperiencesPage.module.css";

type Props = { page: SeoPage & Partial<{ spanishPath: string; englishPath: string }>; locale: Locale };

export default function WebExperiencesPage({ page, locale }: Props) {
  const en = locale === "en";
  const base = site.basePath;
  const copy = en
    ? { home: "Home", services: "Services", title: "Web experiences", intro: "A good website does not add noise. It puts what matters in order.", view: "View project", terrambu: "Terrambú", terrambuCopy: "A site that reflects the place, guides visitors and makes reservations easier.", mapa: "Mapa Punilla", mapaCopy: "A platform that helps people discover and connect with the territory.", cta: "Let's talk about your next project.", contact: "Contact us" }
    : { home: "Inicio", services: "Servicios", title: "Experiencias Web", intro: "Una buena web no agrega ruido. Ordena lo importante.", view: "Ver proyecto", terrambu: "Terrambú", terrambuCopy: "Un sitio que refleja el lugar, orienta a las personas y facilita las reservas.", mapa: "Mapa Punilla", mapaCopy: "Una plataforma para descubrir y conectar con el territorio.", cta: "Hablemos de tu próximo proyecto.", contact: "Contactanos" };
  const projectRoutes = localizedRoutes.projects;
  const terrambuHref = `${base}${projectRoutes.terrambu[locale]}`;
  const mapaHref = `${base}${projectRoutes["mapa-punilla"][locale]}`;
  const contactHref = `${base}/${en ? "en/" : ""}#contacto`;
  const breadcrumbs = [{ label: copy.home, href: `${base}/${en ? "en/" : ""}` }, { label: copy.services, href: `${base}/${en ? "en/services/" : "servicios/"}` }, { label: page.h1, href: canonicalUrl(page.path) }];

  return <>
    <div className={styles.globalNav}><Navigation locale={locale} languageHref={en ? page.spanishPath : page.englishPath} /></div>
    <JsonLd data={organizationJsonLd(locale)} /><JsonLd data={serviceJsonLd(page)} /><JsonLd data={faqJsonLd(page.faqs)} /><JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
    <CapabilityPageTracking capability="web_experiences" />
    <main id="main-content" className={styles.page}>
      <div className={styles.container}>
        <nav className={styles.breadcrumbs} aria-label={en ? "Breadcrumb" : "Migas de pan"}>
          {breadcrumbs.map((item, index) => (
            <span key={item.href}>
              {index > 0 && " / "}
              {index === breadcrumbs.length - 1 ? <span aria-current="page">{item.label}</span> : <a href={item.href}>{item.label}</a>}
            </span>
          ))}
        </nav>

        {/* ====================================================================
         * HERO — "sala de proyección": texto a la izquierda, pantalla
         * flotando (screenshot real de Terrambú) a la derecha, sobre un
         * fondo oscuro con viñeta. Reemplaza la vieja sección de
         * eyebrow+h1+intro+button seguida de "Proyectos seleccionados".
         * ================================================================= */}
        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{en ? "Web experiences" : "Experiencias Web"}</p>
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
            <ActionButton href={terrambuHref} className={styles.button}>
              {copy.view}<span aria-hidden="true">→</span>
            </ActionButton>
          </div>
          <div className={styles.heroStage}>
            <div className={styles.heroFloor} aria-hidden="true" />
            <div className={styles.heroBench} aria-hidden="true" />
            <a className={styles.heroScreen} href={terrambuHref} aria-label={copy.terrambu}>
              <Image
                unoptimized
                src={`${base}/projects/terrambu-hotel-web-960.webp`}
                alt={en ? "Terrambú website project" : "Proyecto web Terrambú"}
                fill
                sizes="(max-width: 800px) 100vw, 58vw"
              />
            </a>
            <div className={styles.heroReflection} aria-hidden="true" />
          </div>
        </header>

        {/* ==================== 01 — TERRAMBÚ ==================== */}
        <section id="terrambu" className={styles.terrambu}>
          <div className={styles.sectionCopy}>
            <span className={styles.sectionNumber}>01 —</span>
            <h2>TERRAMBÚ</h2>
            <small>HOSPITALIDAD · NATURALEZA · EXPERIENCIA</small>
            <p>{copy.terrambuCopy}</p>
            <a className={styles.textLink} href={terrambuHref}>{copy.view} <span>→</span></a>
          </div>
          <a className={styles.largeProject} href={terrambuHref}>
            <Image unoptimized src={`${base}/projects/terrambu-hotel-web-960.webp`} alt="" fill sizes="(max-width: 800px) 100vw, 64vw" />
          </a>
        </section>

        {/* ==================== PAUSA EDITORIAL — texto rotado ==================== */}
        <section className={styles.pause}>
          <div>
            <span className={styles.sectionNumber}>02 —</span>
            <small>{en ? "FOUNDATION" : "FUNDAMENTO"}</small>
          </div>
          <div className={styles.pauseText}>
            <p>{en ? "We don't start with a template. We start by understanding." : "No empezamos por una plantilla. Empezamos por entender."}</p>
          </div>
        </section>

        {/* ==================== 02 — MAPA PUNILLA (mockup apilado) ==================== */}
        <section id="mapa" className={styles.mapa}>
          <div className={styles.sectionCopy}>
            <span className={styles.sectionNumber}>02 —</span>
            <h2>MAPA<br />PUNILLA</h2>
            <small>TURISMO · TERRITORIO · CONEXIÓN</small>
            <p>{copy.mapaCopy}</p>
            <a className={styles.textLink} href={mapaHref}>{copy.view} <span>→</span></a>
          </div>
          <div className={styles.stackedWrap}>
            <a className={styles.largeProject} href={mapaHref}>
              <Image
                unoptimized
                src={`${base}/projects/mapa-punilla-web.webp`}
                alt={en ? "Mapa Punilla website project" : "Proyecto web Mapa Punilla"}
                fill
                sizes="(max-width: 800px) 100vw, 40vw"
              />
            </a>
          </div>
        </section>

        {/* ==================== 03 — CTA FINAL ==================== */}
        <section id="contacto" className={styles.contact}>
          <div>
            <span className={styles.sectionNumber}>03 —</span>
            <h2>{en ? "LET'S TALK" : "HABLEMOS"}</h2>
          </div>
          <div>
            <h3>{copy.cta}</h3>
            <p>{en ? "Tell us what you need and we will make it real." : "Contanos qué necesitás y lo hacemos realidad."}</p>
            <ActionButton href={contactHref} className={styles.button}>
              {copy.contact}<span aria-hidden="true">→</span>
            </ActionButton>
          </div>
        </section>
      </div>
    </main>
  </>;
}