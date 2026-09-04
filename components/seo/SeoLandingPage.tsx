import ActionButton from "@/components/atoms/ActionButton";
import Eyebrow from "@/components/atoms/Eyebrow";
import ActionGroup from "@/components/molecules/ActionGroup";
import JsonLd from "@/components/seo/JsonLd";
import ShareButton from "@/components/seo/ShareButton";
import Navigation from "@/components/Navigation";
import { enHome } from "@/lib/i18n/en/home";
import type { Locale } from "@/lib/i18n";
import { localizedRoutes } from "@/lib/i18n/routes";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  faqJsonLd,
  organizationJsonLd,
  serviceJsonLd,
  site,
  type SeoPage,
} from "@/lib/seo";

type SeoLandingPageProps = {
  page: SeoPage & Partial<{ spanishPath: string; englishPath: string }>;
  locale?: Locale;
};

const categoryLabels: Record<SeoPage["category"], string> = {
  home: "Inicio",
  servicio: "Servicios",
  sector: "Sectores",
  proyecto: "Proyectos",
};

const categoryLabelsEn: Record<SeoPage["category"], string> = {
  home: "Home",
  servicio: "Services",
  sector: "Sectors",
  proyecto: "Projects",
};

const categoryAnchors: Record<SeoPage["category"], string> = {
  home: "#inicio",
  servicio: "#soluciones",
  sector: "#soluciones",
  proyecto: "#proyectos",
};

export default function SeoLandingPage({ page, locale = "es" }: SeoLandingPageProps) {
  const english = locale === "en";
  const routeMap: Record<string, { es: string; en: string }> = page.category === "servicio" ? localizedRoutes.services : localizedRoutes.sectors;
  const mappedRoute = routeMap[page.slug as keyof typeof routeMap];
  const spanishPath = page.spanishPath ?? mappedRoute?.es ?? page.path;
  const englishPath = page.englishPath ?? mappedRoute?.en;
  const languageHref = english ? spanishPath : englishPath;
  const breadcrumbItems = [
    { label: english ? "Home" : "Inicio", href: `${site.basePath}/${english ? "en/" : ""}` },
    { label: english ? categoryLabelsEn[page.category] : categoryLabels[page.category], href: `${site.basePath}/${english ? "en/" : ""}${categoryAnchors[page.category]}` },
    { label: page.h1, href: `${site.basePath}${page.path}/` },
  ];

  return (
    <>
      {languageHref ? (english ? <Navigation locale="en" dictionary={enHome} languageHref={languageHref} homePathPrefix="/en" /> : <Navigation languageHref={languageHref} />) : null}
      <JsonLd data={organizationJsonLd(locale)} />
      <JsonLd data={serviceJsonLd(page)} />
      <JsonLd data={faqJsonLd(page.faqs)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <main className="seo-page" id="main-content">
        <nav className="seo-breadcrumbs" aria-label={english ? "Breadcrumb" : "Migas de pan"}>
          {breadcrumbItems.map((item, index) => (
            <span key={item.href}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {index === breadcrumbItems.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </span>
          ))}
        </nav>

        <section className="seo-hero">
          <div className="seo-hero-copy">
            <Eyebrow className="label">{page.eyebrow}</Eyebrow>
            <h1>{page.h1}</h1>
            <p>{page.intro}</p>
            <ActionGroup className="seo-actions">
              <ActionButton href={`${site.basePath}/${english ? "en/" : ""}#contacto`} data-analytics="cta">
                {page.cta}
              </ActionButton>
              <ShareButton title={page.title} text={page.description} url={canonicalUrl(page.path)} />
            </ActionGroup>
          </div>
          {page.image && (
            <figure className="seo-hero-media">
              <img
                src={`${site.basePath}${page.image}`}
                alt={page.imageAlt ?? page.h1}
                width="1600"
                height="1200"
                decoding="async"
              />
            </figure>
          )}
        </section>

        <section className="seo-section">
          <h2>{english ? "In a nutshell" : "En pocas palabras"}</h2>
          <ul className="seo-takeaways">
            {page.takeaways.map((takeaway) => (
              <li key={takeaway}>{takeaway}</li>
            ))}
          </ul>
        </section>

        <section className="seo-section seo-content-grid">
          {page.sections.map((section) => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.items && (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>

        <section className="seo-section">
          <h2>{english ? "Frequently asked questions" : "Preguntas frecuentes"}</h2>
          <div className="seo-faqs">
            {page.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="seo-section seo-related" aria-label={english ? "Related links" : "Enlaces relacionados"}>
          <h2>{english ? "You may also find useful" : "También puede servirte"}</h2>
          <div>
            {page.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
