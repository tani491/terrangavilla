/**
 * Configuration centrale Teranga Park Villas.
 *
 * ⚠️ Les valeurs modifiables sans toucher au code (WhatsApp, prix, images, PDF)
 * vivent désormais dans la table Supabase `site_setting` — voir src/lib/site-settings.ts.
 * Les constantes ci-dessous servent de valeurs par défaut (fallback).
 *
 * IDs Pixel / GA4 se règlent via .env :
 *   NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX
 *   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
 */

export const DIRECT_WHATSAPP_NUMBER = "221773615944";

export const VISIT_WHATSAPP_MESSAGE =
  "Bonjour, je souhaite programmer une visite pour Teranga Park Villas.";

export const SITE = {
  name: "Teranga Park Villas",
  tagline: "Villas haut de gamme sur la Petite Côte",
  location: "Nguerigne Peulh, route de Ngaparou — Petite Côte, Sénégal",
  price: "157 200 000 FCFA",
  whatsappNumber: DIRECT_WHATSAPP_NUMBER, // +221 77 361 59 44
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+221 77 361 59 44",
  phoneHref: "tel:" + (process.env.NEXT_PUBLIC_PHONE_HREF ?? "+221773615944"),
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://www.instagram.com/my_immobilier_senegal/",
  tiktokUrl:
    process.env.NEXT_PUBLIC_TIKTOK_URL ??
    "https://www.tiktok.com/@ikhlass.construction",
};

export const SITE_URL = "https://www.terangavillas.online";

/** Messages WhatsApp préremplis (une seule source). */
export const DEFAULT_WHATSAPP_MESSAGE =
  VISIT_WHATSAPP_MESSAGE;

export const DOSSIER_WHATSAPP_MESSAGE =
  "Bonjour, je souhaite recevoir le dossier complet de Teranga Park Villas.";

/**
 * Helper unique pour construire un lien WhatsApp.
 * Le numéro de destination des CTA est fixé pour garantir la redirection directe.
 */
export function buildWhatsAppLink(
  _number?: string | null,
  message: string = DEFAULT_WHATSAPP_MESSAGE
): string {
  return `https://wa.me/${DIRECT_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildDirectWhatsAppLink(
  message: string = DEFAULT_WHATSAPP_MESSAGE
): string {
  return buildWhatsAppLink(DIRECT_WHATSAPP_NUMBER, message);
}

/** Alias conservé pour compatibilité (utilise le numéro par défaut). */
export const WHATSAPP_LINK = (message?: string) =>
  buildDirectWhatsAppLink(message);

export function openDirectWhatsApp(message: string = DEFAULT_WHATSAPP_MESSAGE) {
  if (typeof window !== "undefined") {
    window.location.href = buildDirectWhatsAppLink(message);
  }
}

export function submitLeadInBackground(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const body = JSON.stringify(payload);

  try {
    const blob = new Blob([body], { type: "application/json" });
    if (navigator.sendBeacon?.("/api/leads", blob)) return;
  } catch {
    /* l'enregistrement est optionnel : WhatsApp reste prioritaire */
  }

  void fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

export const NAV_LINKS = [
  { label: "Projet", href: "#projet" },
  { label: "Galerie", href: "#galerie" },
  { label: "Caractéristiques", href: "#caracteristiques" },
  { label: "Localisation", href: "#localisation" },
  { label: "FAQ", href: "#faq" },
];

/** Événement DOM pour ouvrir la modale "Recevoir le dossier" depuis n'importe quel bouton. */
export const OPEN_DOSSIER_MODAL_EVENT = "open-dossier-modal";

export function openDossierModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_DOSSIER_MODAL_EVENT));
  }
}
