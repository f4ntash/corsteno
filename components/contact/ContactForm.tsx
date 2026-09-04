"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_LIMITS, validateContactPayload, type ContactErrors } from "@/lib/contactForm";
import { withBasePath } from "@/lib/assetPath";
import { trackEvent } from "@/lib/analytics";
import type { HomeDictionary, Locale } from "@/lib/i18n";

type FormStatus = "idle" | "validating" | "sending" | "error" | "success";

const endpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim() ?? "";

type FormspreeResponse = {
  errors?: Array<{ message?: string }>;
};

export default function ContactForm({ dictionary: t, locale }: { dictionary: HomeDictionary; locale: Locale }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const contactStartedRef = useRef(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitError, setSubmitError] = useState("");
  const isSubmitting = status === "validating" || status === "sending";

  useEffect(() => {
    const prefillContact = (event: Event) => {
      const detail = (event as CustomEvent<{ interest?: string; message?: string }>).detail;
      const form = formRef.current;
      if (!form) return;
      const interest = form.elements.namedItem("interest") as HTMLSelectElement | null;
      const message = form.elements.namedItem("message") as HTMLTextAreaElement | null;
      if (interest && detail?.interest) interest.value = detail.interest;
      if (message && detail?.message && !message.value) message.value = detail.message;
    };
    window.addEventListener("corsteno:prefill-contact", prefillContact);
    return () => window.removeEventListener("corsteno:prefill-contact", prefillContact);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setStatus("validating");
    setSubmitError("");

    const formData = new FormData(event.currentTarget);
    const validation = validateContactPayload({
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      interest: formData.get("interest"),
      projectStage: formData.get("projectStage"),
      message: formData.get("message"),
      _gotcha: formData.get("_gotcha"),
    }, t.contact.form.errors);

    if (!validation.success) {
      setErrors(validation.errors);
      setStatus("error");
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      });
      return;
    }

    setErrors({});
    if (!endpoint) {
      setSubmitError(t.contact.form.unavailable);
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const submission = new FormData();
      submission.set("name", validation.data.name);
      submission.set("email", validation.data.email);
      submission.set("company", validation.data.company);
      submission.set("interest", validation.data.interest);
      submission.set("projectStage", validation.data.projectStage);
      submission.set("message", validation.data.message);
      submission.set("_gotcha", validation.data._gotcha);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: submission,
      });
      const result = (await response.json().catch(() => null)) as FormspreeResponse | null;

      if (!response.ok) {
        const providerMessage = result?.errors?.find((item) => item.message)?.message;
        const message = response.status === 429
          ? t.contact.form.rateLimit
          : providerMessage || t.contact.form.sendError;
        throw new Error(message);
      }

      setStatus("success");
      trackEvent("contact_submitted", { source: "contact-form", language: locale });
      formRef.current?.reset();
      router.push(withBasePath(locale === "en" ? "/en/request-sent/" : "/solicitud-enviada/"));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t.contact.form.sendError);
      setStatus("error");
    }
  }

  return (
    <form
      className="contact-form"
      ref={formRef}
      onSubmit={handleSubmit}
      onFocusCapture={() => {
        if (contactStartedRef.current) return;
        contactStartedRef.current = true;
        trackEvent("contact_started", { source: "contact-form", language: locale });
      }}
      noValidate
      aria-busy={isSubmitting}
    >
      <div className="contact-form-grid">
        <div className="contact-field">
          <label htmlFor="contact-name">{t.contact.form.name}</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={CONTACT_LIMITS.name}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name ? <span id="contact-name-error" className="contact-field-error">{errors.name}</span> : null}
        </div>
        <div className="contact-field">
          <label htmlFor="contact-email">{t.contact.form.email}</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={CONTACT_LIMITS.email}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email ? <span id="contact-email-error" className="contact-field-error">{errors.email}</span> : null}
        </div>
        <div className="contact-field contact-field-wide">
          <label htmlFor="contact-company">{t.contact.form.company} <span>({t.contact.form.optional})</span></label>
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "contact-company-error" : undefined}
          />
          {errors.company ? <span id="contact-company-error" className="contact-field-error">{errors.company}</span> : null}
        </div>
        <div className="contact-field contact-field-wide">
          <label htmlFor="contact-interest">{t.contact.form.interest}</label>
          <select
            id="contact-interest"
            name="interest"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={errors.interest ? "contact-interest-error" : undefined}
          >
            <option value="" disabled>{t.contact.form.select}</option>
            {t.contact.form.interests.map((label, index) => <option key={label} value={["configurador-3d", "experiencia-interactiva", "desarrollo-web", "integracion-software-conectado", "no-estoy-seguro"][index]}>{label}</option>)}
          </select>
          {errors.interest ? <span id="contact-interest-error" className="contact-field-error">{errors.interest}</span> : null}
        </div>
        <div className="contact-field contact-field-wide">
          <label htmlFor="contact-project-stage">{t.contact.form.stage}</label>
          <select
            id="contact-project-stage"
            name="projectStage"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.projectStage)}
            aria-describedby={errors.projectStage ? "contact-project-stage-error" : undefined}
          >
            <option value="" disabled>{t.contact.form.select}</option>
            {t.contact.form.stages.map((label, index) => <option key={label} value={["explorando-idea", "evaluando-alternativas", "proyecto-definido", "implementacion-pronta"][index]}>{label}</option>)}
          </select>
          {errors.projectStage ? (
            <span id="contact-project-stage-error" className="contact-field-error">{errors.projectStage}</span>
          ) : null}
        </div>
        <div className="contact-field contact-field-wide">
          <label htmlFor="contact-message">{t.contact.form.message}</label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            maxLength={CONTACT_LIMITS.message}
            required
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {errors.message ? <span id="contact-message-error" className="contact-field-error">{errors.message}</span> : null}
        </div>
      </div>
      {Object.keys(errors).length > 0 ? (
        <p className="contact-validation-summary" role="alert">{t.contact.form.validationSummary}</p>
      ) : null}
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-gotcha">{t.contact.form.website}</label>
        <input id="contact-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {submitError ? <p className="contact-submit-error" role="alert">{submitError}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t.contact.form.sending : t.contact.form.submit}
      </button>
      <p className="contact-form-reassurance">
        {t.contact.form.reassurance}
        <span>{t.contact.form.responseTime}</span>
      </p>
      <p className="contact-form-privacy">
        {t.contact.form.privacy} <a href={withBasePath(locale === "en" ? "/en/privacy/" : "/privacidad/")}>{t.contact.form.privacyLink}</a>
      </p>
    </form>
  );
}
