export type AnalyticsEventName =
  | "contact_click" | "contact_form_start" | "generate_lead" | "contact_form_error"
  | "view_project" | "project_contact_click" | "language_switch" | "configurator_start"
  | "contact_method_click";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("corsteno:analytics", { detail: { name, payload } }));
}
