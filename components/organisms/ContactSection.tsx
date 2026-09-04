import ContactForm from "@/components/contact/ContactForm";
import { contactChannels, socialLinks } from "@/lib/contact";
import { site } from "@/lib/seo";
import Eyebrow from "@/components/atoms/Eyebrow";
import { esHome, type HomeDictionary, type Locale } from "@/lib/i18n";
import { localizedRoutes } from "@/lib/i18n/routes";

export default function ContactSection({ dictionary: t = esHome, locale = "es" }: { dictionary?: HomeDictionary; locale?: Locale } = {}) {
  const hasContactChannel = Boolean(contactChannels.whatsappUrl || contactChannels.email);

  return (
    <section className="contact dark" id="contacto" data-od-id="contacto" data-navbar-theme="dark" data-nav-section="contacto">
      <div className="contact-copy">
        <Eyebrow className="label">{t.contact.eyebrow}</Eyebrow>
        <h2 data-od-id="contacto-titulo">
          {t.contact.title[0]}
          <br />
          {t.contact.title[1]}
        </h2>
        <p>
          {t.contact.body[0]}
          <br />
          {t.contact.body[1]}
        </p>
        <div className="contact-quote-info" aria-labelledby="contact-quote-title">
          <h3 id="contact-quote-title">{t.contact.quoteTitle}</h3>
          <p>{t.contact.quoteBody}</p>
          <ul>
            {t.contact.factors.map((factor) => <li key={factor}>{factor}</li>)}
          </ul>
          <p>{t.contact.quoteClosing}</p>
        </div>
      </div>
      <div className="contact-action">
        <p className="contact-commercial-copy">
          {t.contact.commercial}
        </p>
        <span className="contact-support-copy">{t.contact.support}</span>
        <ContactForm dictionary={t} locale={locale} />
        {hasContactChannel ? (
          <div className="contact-channels" aria-label={t.contact.channelsAria}>
            {contactChannels.whatsappUrl ? (
              <a href={contactChannels.whatsappUrl} data-cursor="Abrir" data-od-id="contacto-iniciar">
                {t.contact.whatsapp}
              </a>
            ) : null}
            {contactChannels.email ? (
              <a href={`mailto:${contactChannels.email}`} data-cursor="Abrir">
                {t.contact.email}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
      <footer className="contact-footer">
        <span className="meta">{t.contact.location}</span>
        <nav className="contact-footer-links" aria-label={t.contact.footerAria}>
          <a href={`${site.basePath}${locale === "en" ? localizedRoutes.services["configuradores-3d"].en : localizedRoutes.services["configuradores-3d"].es}`}>{t.contact.links[0]}</a>
          <a href={`${site.basePath}${locale === "en" ? localizedRoutes.services["visualizacion-3d"].en : localizedRoutes.services["visualizacion-3d"].es}`}>{t.contact.links[1]}</a>
          <a href={`${site.basePath}${locale === "en" ? localizedRoutes.services["desarrollo-web"].en : localizedRoutes.services["desarrollo-web"].es}`}>{t.contact.links[2]}</a>
          <a href={`${site.basePath}/${locale === "en" ? "en/" : ""}#proyectos`}>{t.contact.links[3]}</a>
          <a href={`${site.basePath}/${locale === "en" ? "en/" : ""}#contacto`}>{t.contact.links[4]}</a>
          <a href={`${site.basePath}${locale === "en" ? "/en/privacy/" : "/privacidad/"}`}>{t.contact.links[5]}</a>
          {socialLinks.instagramUrl ? (
            <a href={socialLinks.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
          ) : null}
          {socialLinks.linkedinUrl ? (
            <a href={socialLinks.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
          ) : null}
        </nav>
        <span className="meta">{t.contact.motto}</span>
      </footer>
    </section>
  );
}
