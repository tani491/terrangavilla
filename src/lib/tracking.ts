"use client";

/**
 * Tracking Teranga Park Villas
 * — Capture automatique des paramètres UTM (persistés 30 jours en localStorage)
 * — Meta Pixel : PageView, ViewContent, Lead, Contact, Schedule
 * — Google Analytics 4 : mêmes événements
 *
 * Activation : renseigner NEXT_PUBLIC_META_PIXEL_ID et/ou NEXT_PUBLIC_GA4_ID
 * dans .env.local. Sans ID, les appels sont silencieux (no-op).
 */

export type TrackedEvent = "PageView" | "ViewContent" | "Lead" | "Contact" | "Schedule";

const UTM_KEY = "tpv_utm";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
const UTM_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 jours

export interface UtmData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  capturedAt: number;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function isBrowser() {
  return typeof window !== "undefined";
}

/** Lit les UTM de l'URL courante et les persiste (localStorage, 30 jours). */
export function captureUtm(): UtmData | null {
  if (!isBrowser()) return null;

  const stored = readStoredUtm();
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Partial<UtmData> = {};
  let hasUrlUtm = false;

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      fromUrl[key] = value;
      hasUrlUtm = true;
    }
  }

  if (hasUrlUtm) {
    const fresh: UtmData = {
      utm_source: fromUrl.utm_source ?? "direct",
      utm_medium: fromUrl.utm_medium ?? "none",
      utm_campaign: fromUrl.utm_campaign ?? "none",
      capturedAt: Date.now(),
    };
    try {
      localStorage.setItem(UTM_KEY, JSON.stringify(fresh));
    } catch {
      /* stockage indisponible — on ignore */
    }
    return fresh;
  }

  return stored;
}

function readStoredUtm(): UtmData | null {
  try {
    const raw = localStorage.getItem(UTM_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UtmData;
    if (!parsed?.capturedAt || Date.now() - parsed.capturedAt > UTM_TTL_MS) {
      localStorage.removeItem(UTM_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/** UTM à envoyer avec le lead (source par défaut : direct). */
export function getUtmPayload(): {
  source: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
} {
  const utm = readStoredUtm();
  return {
    source: utm?.utm_source ?? "direct",
    utmSource: utm?.utm_source ?? null,
    utmMedium: utm?.utm_medium ?? null,
    utmCampaign: utm?.utm_campaign ?? null,
  };
}

/** Événement unifié Meta Pixel + GA4. */
export function trackEvent(event: TrackedEvent, params: Record<string, unknown> = {}) {
  if (!isBrowser()) return;

  try {
    window.fbq?.("track", event, params);
  } catch {
    /* pixel non chargé */
  }

  try {
    window.gtag?.("event", event.toLowerCase(), params);
  } catch {
    /* gtag non chargé */
  }
}

/** PageView + capture UTM — appelé une fois au montage de la page. */
export function initPageTracking() {
  if (!isBrowser()) return;
  captureUtm();
  trackEvent("PageView", { page: "landing_teranga" });
}

/** Clic sur un lien WhatsApp. */
export function trackContact(location: string) {
  trackEvent("Contact", { contact_location: location, channel: "whatsapp" });
}

/** Envoi du formulaire de qualification. */
export function trackLead(budget?: string, projectType?: string) {
  trackEvent("Lead", { value: 1, currency: "XOF", budget, project_type: projectType });
}

/** Intention de visite (physique ou vidéo). */
export function trackSchedule(mode: string) {
  trackEvent("Schedule", { visit_mode: mode });
}
