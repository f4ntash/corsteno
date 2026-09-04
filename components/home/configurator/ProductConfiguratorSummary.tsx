"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { WindowConfiguration } from "./types";
import { trackEvent } from "@/lib/analytics";
import {
  buildProductDemoPayload,
  sendProductDemo,
} from "@/lib/productDemo";
import { withBasePath } from "@/lib/assetPath";
import styles from "./productConfigurator.module.css";
import type { HomeDictionary, Locale } from "@/lib/i18n";

export default function ProductConfiguratorSummary({
  configuration,
  contactHref,
  dictionary: t,
  locale,
}: {
  configuration: WindowConfiguration;
  contactHref: string;
  dictionary: HomeDictionary;
  locale: Locale;
}) {
  const [step, setStep] = useState<"summary" | "email" | "success">("summary");
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "email") emailRef.current?.focus();
  }, [step]);

  const extras = [
    configuration.mosquitoNet ? t.configurator.labels.extras.mosquitoNet : null,
    configuration.blind ? t.configurator.labels.extras.blind : null,
    configuration.security ? t.configurator.labels.extras.security : null,
  ].filter((item): item is string => Boolean(item));

  const openEmailStep = () => {
    setStep("email");
    setStatus("idle");
    setMessage("");
    trackEvent("demo_email_opened", { source: "configurator-demo", language: locale });
  };

  const submitDemo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("error");
      setMessage(t.configurator.summary.invalidEmail);
      emailRef.current?.focus();
      return;
    }

    const payload = buildProductDemoPayload(
      normalizedEmail,
      marketingConsent,
      window.location.pathname,
      configuration,
      t,
    );
    setStatus("sending");
    setMessage("");

    const result = await sendProductDemo(payload, t.contact.form.sendError);
    if (result.status === "error") {
      setStatus("error");
      setMessage(result.message);
      return;
    }

    trackEvent("demo_email_submitted", {
      source: payload.source,
      marketing_consent: marketingConsent,
      language: locale,
    });
    setStatus("idle");
    setStep("success");
  };

  if (step === "success") {
    return (
      <aside className={`${styles.configuratorSummary} ${styles.demoFlow}`} aria-live="polite">
        <span>{t.configurator.summary.sent}</span>
        <h3>{t.configurator.summary.sentTitle}</h3>
        <p>{t.configurator.summary.sentBody}</p>
        <a
          className={styles.demoFlowCta}
          href={contactHref}
          onClick={() => {
            if (contactHref !== "#contacto") return;
            window.dispatchEvent(new CustomEvent("corsteno:prefill-contact", {
              detail: {
                interest: "configurador-3d",
                message: t.configurator.summary.prefill,
              },
            }));
          }}
        >
          {t.configurator.summary.productCta}
        </a>
      </aside>
    );
  }

  if (step === "email") {
    return (
      <aside className={`${styles.configuratorSummary} ${styles.demoFlow}`} aria-labelledby="demo-email-title">
        <button className={styles.demoBack} type="button" onClick={() => setStep("summary")}>← {t.configurator.summary.back}</button>
        <h3 id="demo-email-title">{t.configurator.summary.emailTitle}</h3>
        <p>{t.configurator.summary.emailBody}</p>
        <form className={styles.demoEmailForm} onSubmit={submitDemo} noValidate>
          <label htmlFor="demo-work-email">{t.configurator.summary.emailLabel}</label>
          <input
            ref={emailRef}
            id="demo-work-email"
            name="email"
            type="email"
            value={email}
            placeholder={t.configurator.summary.emailPlaceholder}
            autoComplete="email"
            required
            aria-describedby={message ? "demo-email-status" : "demo-email-privacy"}
            aria-invalid={status === "error"}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className={styles.demoConsent}>
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(event) => {
                const checked = event.target.checked;
                setMarketingConsent(checked);
                if (checked) trackEvent("demo_marketing_consent", { source: "configurator-demo", language: locale });
              }}
            />
            <span>{t.configurator.summary.consent}</span>
          </label>
          <p id="demo-email-privacy" className={styles.demoPrivacy}>
            {t.configurator.summary.privacy} <a href={withBasePath(locale === "en" ? "/en/privacy/" : "/privacidad/")}>{t.configurator.summary.privacyLink}</a>
          </p>
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? t.configurator.summary.preparing : t.configurator.summary.send}
          </button>
        </form>
        {message ? (
          <div
            id="demo-email-status"
            className={status === "error" ? styles.demoError : styles.demoPrepared}
            role={status === "error" ? "alert" : "status"}
          >
            <span>{message}</span>
          </div>
        ) : null}
      </aside>
    );
  }

  return (
    <aside className={styles.configuratorSummary} aria-live="polite">
      <span>{t.configurator.summary.estimated}</span>
      <dl>
        <div><dt>{t.configurator.fields.model}</dt><dd>{t.configurator.labels.model[configuration.model]}</dd></div>
        <div><dt>{t.configurator.fields.dimensions}</dt><dd>{configuration.width} × {configuration.height} mm</dd></div>
        <div><dt>{t.configurator.fields.frame}</dt><dd>{t.configurator.labels.frameColor[configuration.frameColor]}</dd></div>
        <div><dt>{t.configurator.fields.glass}</dt><dd>{t.configurator.labels.glassType[configuration.glassType]}</dd></div>
        <div><dt>{t.configurator.fields.opening}</dt><dd>{t.configurator.labels.opening[configuration.opening]}</dd></div>
        <div><dt>{t.configurator.fields.extras}</dt><dd>{extras.length > 0 ? extras.join(", ") : t.configurator.labels.extras.none}</dd></div>
      </dl>
      <div className={styles.demoPrice}>
        <strong>USD 1.840</strong>
        <small>{t.configurator.summary.price}</small>
      </div>
      <button type="button" onClick={openEmailStep}>{t.configurator.summary.tryOrder}</button>
      <p>{t.configurator.summary.caption}</p>
    </aside>
  );
}
