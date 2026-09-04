import InteractiveHeroDemo from "./home/InteractiveHeroDemo";
import ProcessComparisonSection from "./home/ProcessComparisonSection";
import ActionButton from "./atoms/ActionButton";
import Eyebrow from "./atoms/Eyebrow";
import ActionGroup from "./molecules/ActionGroup";
import type { HomeDictionary, Locale } from "@/lib/i18n";

export default function CommercialIntro({ dictionary: t, locale }: { dictionary: HomeDictionary; locale: Locale }) {
  return (
    <>
      <section className="commercial-hero" id="inicio" data-od-id="que-hacemos" data-navbar-theme="light" data-nav-section="inicio">
        <div className="commercial-hero-copy">
          <Eyebrow className="label">{t.hero.eyebrow}</Eyebrow>
          <h1>
            {t.hero.title.slice(0, -1).map((line) => <span key={line}>{line}<br /></span>)}
            <em>{t.hero.title.at(-1)}</em>
          </h1>
          <p>{t.hero.body}</p>
          <ul className="commercial-hero-metrics" aria-label={t.hero.metricsAria}>
            {t.hero.metrics.map((metric) => <li key={metric.value}><strong>{metric.value}</strong><span>{metric.label}</span></li>)}
          </ul>
          <ActionGroup className="commercial-actions">
            <ActionButton className="commercial-action-primary" href="#contacto">{t.hero.primaryCta}</ActionButton>
            <ActionButton className="commercial-action-secondary" href="#proyectos">{t.hero.secondaryCta}</ActionButton>
          </ActionGroup>
          <div className="commercial-proof" aria-label={t.hero.proofAria}>
            {t.hero.proof.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <div className="commercial-hero-visual">
          <InteractiveHeroDemo dictionary={t} locale={locale} />
        </div>
      </section>

      <ProcessComparisonSection dictionary={t} />
    </>
  );
}
