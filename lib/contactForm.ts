export const CONTACT_LIMITS = {
  name: 100,
  email: 254,
  company: 120,
  message: 4000,
  gotcha: 200,
} as const;

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  interest: string;
  projectStage: string;
  message: string;
  _gotcha: string;
};

export type ContactField = "name" | "email" | "company" | "interest" | "projectStage" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

type ValidationResult =
  | { success: true; data: ContactPayload; errors: ContactErrors }
  | { success: false; data: null; errors: ContactErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(input: Record<string, unknown>, key: keyof ContactPayload) {
  const value = input[key];
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactPayload(value: unknown): ValidationResult {
  const input = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const data: ContactPayload = {
    name: readString(input, "name"),
    email: readString(input, "email").toLowerCase(),
    company: readString(input, "company"),
    interest: readString(input, "interest"),
    projectStage: readString(input, "projectStage"),
    message: readString(input, "message"),
    _gotcha: readString(input, "_gotcha"),
  };
  const errors: ContactErrors = {};

  if (!data.name) errors.name = "Ingresá tu nombre.";
  else if (data.name.length > CONTACT_LIMITS.name) errors.name = `Usá hasta ${CONTACT_LIMITS.name} caracteres.`;

  if (!data.email) errors.email = "Ingresá tu email.";
  else if (data.email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(data.email)) {
    errors.email = "Ingresá un email válido.";
  }

  if (data.company.length > CONTACT_LIMITS.company) {
    errors.company = `Usá hasta ${CONTACT_LIMITS.company} caracteres.`;
  }

  if (!data.interest) errors.interest = "Seleccioná el tipo de proyecto.";

  if (!data.projectStage) errors.projectStage = "Seleccioná la etapa del proyecto.";

  if (!data.message) errors.message = "Contanos brevemente sobre tu consulta.";
  else if (data.message.length > CONTACT_LIMITS.message) {
    errors.message = `Usá hasta ${CONTACT_LIMITS.message} caracteres.`;
  }

  if (data._gotcha.length > CONTACT_LIMITS.gotcha) {
    return { success: false, data: null, errors: { message: "No pudimos validar la solicitud." } };
  }

  return Object.keys(errors).length > 0
    ? { success: false, data: null, errors }
    : { success: true, data, errors };
}
