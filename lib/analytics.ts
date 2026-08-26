export type AnalyticsEventName =
  | "demo_started"
  | "demo_configuration_changed"
  | "demo_email_opened"
  | "demo_email_submitted"
  | "demo_marketing_consent"
  | "project_opened"
  | "project_external_opened"
  | "contact_started"
  | "contact_submitted";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("corsteno:analytics", { detail: { name, payload } }));
}
