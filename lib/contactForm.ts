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

export type ContactValidationMessages = {
  nameRequired: string; maxChars: string; emailRequired: string; emailInvalid: string;
  interestRequired: string; stageRequired: string; messageRequired: string; invalidRequest: string;
};

const defaultMessages: ContactValidationMessages = {
  nameRequired: "Ingresá tu nombre.", maxChars: "Usá hasta {count} caracteres.", emailRequired: "Ingresá tu email.",
  emailInvalid: "Ingresá un email válido.", interestRequired: "Seleccioná el tipo de proyecto.",
  stageRequired: "Seleccioná la etapa del proyecto.", messageRequired: "Contanos brevemente sobre tu consulta.",
  invalidRequest: "No pudimos validar la solicitud.",
};

function readString(input: Record<string, unknown>, key: keyof ContactPayload) {
  const value = input[key];
  return typeof value === "string" ? value.trim() : "";
}

export function validateContactPayload(value: unknown, messages: ContactValidationMessages = defaultMessages): ValidationResult {
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

  const maxChars = (count: number) => messages.maxChars.replace("{count}", String(count));
  if (!data.name) errors.name = messages.nameRequired;
  else if (data.name.length > CONTACT_LIMITS.name) errors.name = maxChars(CONTACT_LIMITS.name);

  if (!data.email) errors.email = messages.emailRequired;
  else if (data.email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(data.email)) {
    errors.email = messages.emailInvalid;
  }

  if (data.company.length > CONTACT_LIMITS.company) {
    errors.company = maxChars(CONTACT_LIMITS.company);
  }

  if (!data.interest) errors.interest = messages.interestRequired;

  if (!data.projectStage) errors.projectStage = messages.stageRequired;

  if (!data.message) errors.message = messages.messageRequired;
  else if (data.message.length > CONTACT_LIMITS.message) {
    errors.message = maxChars(CONTACT_LIMITS.message);
  }

  if (data._gotcha.length > CONTACT_LIMITS.gotcha) {
    return { success: false, data: null, errors: { message: messages.invalidRequest } };
  }

  return Object.keys(errors).length > 0
    ? { success: false, data: null, errors }
    : { success: true, data, errors };
}
