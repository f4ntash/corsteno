"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { WindowConfiguration } from "./types";
import { WINDOW_LABELS } from "./types";
import { trackEvent } from "@/lib/analytics";
import {
  buildProductDemoPayload,
  sendProductDemo,
} from "@/lib/productDemo";
import { withBasePath } from "@/lib/assetPath";
import styles from "./productConfigurator.module.css";

export default function ProductConfiguratorSummary({
  configuration,
  contactHref,
}: {
  configuration: WindowConfiguration;
  contactHref: string;
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
    configuration.mosquitoNet ? "Mosquitero" : null,
    configuration.blind ? "Persiana" : null,
    configuration.security ? "Seguridad" : null,
  ].filter((item): item is string => Boolean(item));

  const openEmailStep = () => {
    setStep("email");
    setStatus("idle");
    setMessage("");
    trackEvent("demo_email_opened", { source: "configurator-demo" });
  };

  const submitDemo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Ingresá un email de trabajo válido.");
      emailRef.current?.focus();
      return;
    }

    const payload = buildProductDemoPayload(
      normalizedEmail,
      marketingConsent,
      window.location.pathname,
      configuration,
    );
    setStatus("sending");
    setMessage("");

    const result = await sendProductDemo(payload);
    if (result.status === "error") {
      setStatus("error");
      setMessage(result.message);
      return;
    }

    trackEvent("demo_email_submitted", {
      source: payload.source,
      marketing_consent: marketingConsent,
    });
    setStatus("idle");
    setStep("success");
  };

  if (step === "success") {
    return (
      <aside className={`${styles.configuratorSummary} ${styles.demoFlow}`} aria-live="polite">
        <span>Pedido de prueba enviado</span>
        <h3>Así podría llegar cada configuración de tus clientes.</h3>
        <p>El configurador puede convertirse en una entrada directa al proceso comercial de tu empresa.</p>
        <a
          className={styles.demoFlowCta}
          href={contactHref}
          onClick={() => {
            if (contactHref !== "#contacto") return;
            window.dispatchEvent(new CustomEvent("corsteno:prefill-contact", {
              detail: {
                interest: "configurador-3d",
                message: "Me interesa una experiencia como el configurador demo.",
              },
            }));
          }}
        >
          Hablemos de tu producto
        </a>
      </aside>
    );
  }

  if (step === "email") {
    return (
      <aside className={`${styles.configuratorSummary} ${styles.demoFlow}`} aria-labelledby="demo-email-title">
        <button className={styles.demoBack} type="button" onClick={() => setStep("summary")}>← Volver</button>
        <h3 id="demo-email-title">Probá también el otro lado de la experiencia.</h3>
        <p>Ingresá tu email y te enviamos esta configuración como si fueras la empresa que recibe la solicitud de un cliente.</p>
        <form className={styles.demoEmailForm} onSubmit={submitDemo} noValidate>
          <label htmlFor="demo-work-email">Email de trabajo</label>
          <input
            ref={emailRef}
            id="demo-work-email"
            name="email"
            type="email"
            value={email}
            placeholder="nombre@empresa.com"
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
                if (checked) trackEvent("demo_marketing_consent", { source: "configurator-demo" });
              }}
            />
            <span>Quiero recibir novedades, demos y casos de Corsteno.</span>
          </label>
          <p id="demo-email-privacy" className={styles.demoPrivacy}>
            El pedido demo no te suscribe a comunicaciones. <a href={withBasePath("/privacidad/")}>Privacidad</a>
          </p>
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Preparando..." : "Enviarme pedido de prueba"}
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
      <span>Configuración estimada</span>
      <dl>
        <div><dt>Modelo</dt><dd>{WINDOW_LABELS.model[configuration.model]}</dd></div>
        <div><dt>Medidas</dt><dd>{configuration.width} × {configuration.height} mm</dd></div>
        <div><dt>Marco</dt><dd>{WINDOW_LABELS.frameColor[configuration.frameColor]}</dd></div>
        <div><dt>Vidrio</dt><dd>{WINDOW_LABELS.glassType[configuration.glassType]}</dd></div>
        <div><dt>Apertura</dt><dd>{WINDOW_LABELS.opening[configuration.opening]}</dd></div>
        <div><dt>Extras</dt><dd>{extras.length > 0 ? extras.join(", ") : "Sin extras"}</dd></div>
      </dl>
      <div className={styles.demoPrice}>
        <strong>USD 1.840</strong>
        <small>Precio ilustrativo del producto</small>
      </div>
      <button type="button" onClick={openEmailStep}>Probar cómo recibiría este pedido</button>
      <p>Demo del flujo comercial de una configuración.</p>
    </aside>
  );
}
