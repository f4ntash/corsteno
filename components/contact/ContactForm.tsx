"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CONTACT_LIMITS, validateContactPayload, type ContactErrors } from "@/lib/contactForm";
import { withBasePath } from "@/lib/assetPath";

type FormStatus = "idle" | "validating" | "sending" | "error" | "success";

const endpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT?.trim() ?? "";

type FormspreeResponse = {
  errors?: Array<{ message?: string }>;
};

export default function ContactForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitError, setSubmitError] = useState("");
  const isSubmitting = status === "validating" || status === "sending";

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
      message: formData.get("message"),
      _gotcha: formData.get("_gotcha"),
    });

    if (!validation.success) {
      setErrors(validation.errors);
      setStatus("error");
      return;
    }

    setErrors({});
    if (!endpoint) {
      setSubmitError("El formulario no está disponible en este momento. Podés contactarnos por los canales alternativos.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const submission = new FormData();
      submission.set("name", validation.data.name);
      submission.set("email", validation.data.email);
      submission.set("company", validation.data.company);
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
          ? "Se alcanzó el límite de envíos. Esperá un momento e intentá nuevamente."
          : providerMessage || "No se pudo enviar la consulta. Intentá nuevamente.";
        throw new Error(message);
      }

      setStatus("success");
      formRef.current?.reset();
      router.push(withBasePath("/solicitud-enviada/"));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "No se pudo enviar la consulta. Intentá nuevamente.");
      setStatus("error");
    }
  }

  return (
    <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
      <div className="contact-form-grid">
        <div className="contact-field">
          <label htmlFor="contact-name">Nombre</label>
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
          <label htmlFor="contact-email">Email</label>
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
          <label htmlFor="contact-company">Empresa <span>(opcional)</span></label>
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
          <label htmlFor="contact-message">Mensaje</label>
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
      <div className="contact-honeypot" aria-hidden="true">
        <label htmlFor="contact-gotcha">Sitio web</label>
        <input id="contact-gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      {submitError ? <p className="contact-submit-error" role="alert">{submitError}</p> : null}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar consulta"}
      </button>
      <p className="contact-form-reassurance">
        Contanos qué querés hacer. Evaluamos la idea y te respondemos con los próximos pasos.
        <span>Respuesta habitual: 24–48 h.</span>
      </p>
    </form>
  );
}
