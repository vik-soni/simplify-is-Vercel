declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

export const GTM_CONTAINER_ID = "GTM-XXXXXXX";

type GTMEventName =
  | "page_view"
  | "cta_click"
  | "form_start"
  | "form_submit"
  | "form_error"
  | "theme_toggle"
  | "nav_click"
  | "signup_started"
  | "signup_completed"
  | "login_attempted"
  | "login_success"
  | "mfa_completed"
  | "password_reset_requested"
  | "password_reset_completed"
  | "logout";

export function trackEvent(event: GTMEventName, payload: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload, ts: Date.now() });
}

