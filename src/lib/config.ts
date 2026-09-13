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

export const SITE = {
  name: "Teranga Park Villas",
  tagline: "Villas haut de gamme sur la Petite Côte",
  location: "Nguerigne Peulh, route de Ngaparou — Petite Côte, Sénégal",
  price: "157 200 000 FCFA",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "221773615944", // +221 77 361 59 44
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "+221 77 361 59 44",
  phoneHref: "tel:" + (process.env.NEXT_PUBLIC_PHONE_HREF ?? "+221773615944"),
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
    "https://www.instagram.com/my_immobilier_senegal/",
  tiktokUrl:
    process.env.NEXT_PUBLIC_TIKTOK_URL ??
    "https://www.tiktok.com/@ikhlass.construction",
};

/** Messages WhatsApp préremplis (une seule source). */
export const DEFAULT_WHATSAPP_MESSAGE =
  "Bonjour, je souhaite avoir plus d'informations sur Teranga Park Villas.";

export const DOSSIER_WHATSAPP_MESSAGE =
  "Bonjour, je souhaite recevoir le dossier complet de Teranga Park Villas.";

/**
 * Helper unique pour construire un lien WhatsApp.
 * Le numéro vient de site_setting (Supabase) et est passé en prop depuis page.tsx.
 * Fallback sur SITE.whatsappNumber si absent.
 */
export function buildWhatsAppLink(
  number?: string | null,
  message: string = DEFAULT_WHATSAPP_MESSAGE
): string {
  const clean = (number ?? SITE.whatsappNumber).replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

/** Alias conservé pour compatibilité (utilise le numéro par défaut). */
export const WHATSAPP_LINK = (message?: string) =>
  buildWhatsAppLink(SITE.whatsappNumber, message);

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
