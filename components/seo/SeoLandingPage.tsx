import ActionButton from "@/components/atoms/ActionButton";
import Eyebrow from "@/components/atoms/Eyebrow";
import ActionGroup from "@/components/molecules/ActionGroup";
import JsonLd from "@/components/seo/JsonLd";
import ShareButton from "@/components/seo/ShareButton";
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
  page: SeoPage;
};

const categoryLabels: Record<SeoPage["category"], string> = {
  home: "Inicio",
  servicio: "Servicios",
  sector: "Sectores",
  proyecto: "Proyectos",
};

const categoryAnchors: Record<SeoPage["category"], string> = {
  home: "#inicio",
  servicio: "#soluciones",
  sector: "#soluciones",
  proyecto: "#proyectos",
};

export default function SeoLandingPage({ page }: SeoLandingPageProps) {
  const breadcrumbItems = [
    { label: "Inicio", href: `${site.basePath}/` },
    { label: categoryLabels[page.category], href: `${site.basePath}/${categoryAnchors[page.category]}` },
    { label: page.h1, href: `${site.basePath}${page.path}/` },
  ];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={serviceJsonLd(page)} />
      <JsonLd data={faqJsonLd(page.faqs)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbItems)} />
      <main className="seo-page" id="main-content">
        <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
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
              <ActionButton href={`${site.basePath}/#contacto`} data-analytics="cta">
                {page.cta}
              </ActionButton>
              <ShareButton title={page.title} text={page.description} url={canonicalUrl(page.path)} />
            </ActionGroup>
          </div>
          {page.image && (
            <figure className="seo-hero-media">
              <img src={`${site.basePath}${page.image}`} alt={page.imageAlt ?? page.h1} />
            </figure>
          )}
        </section>

        <section className="seo-section">
          <h2>En pocas palabras</h2>
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
          <h2>Preguntas frecuentes</h2>
          <div className="seo-faqs">
            {page.faqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="seo-section seo-related" aria-label="Enlaces relacionados">
          <h2>También puede servirte</h2>
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
