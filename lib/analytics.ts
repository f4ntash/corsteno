export type AnalyticsEventName =
  | "contact_click" | "contact_form_start" | "generate_lead" | "contact_form_error"
  | "view_project" | "project_contact_click" | "language_switch" | "configurator_start"
  | "contact_method_click" | "home_capabilities_view" | "capability_interaction" | "capability_cta_click" | "capability_page_view" | "capability_case_click" | "capability_contact_click";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("corsteno:analytics", { detail: { name, payload } }));
}
