import { cache } from "react";
import { getSupabaseClient, isSupabaseConfigured } from "./supabase";

/**
 * Source unique de vérité pour les contenus modifiables depuis Supabase.
 *
 * Fonctionnement :
 * 1. Valeurs par défaut = contenu actuel du site (le site ne casse jamais).
 * 2. Si Supabase est configuré, on lit la 1ère ligne de `site_settings`
 *    et on applique uniquement les valeurs non vides (merge).
 * 3. Si Supabase est absent, lent (>3s) ou en erreur → on retourne les défauts.
 *
 * Appelée UNE FOIS par rendu dans page.tsx (React cache + revalidate 60s),
 * puis distribuée aux composants via props. Aucun composant ne requête Supabase.
 */

export interface SiteSettings {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  galleryImages: { src: string; label: string; alt: string }[];
  pdfUrl: string;
  whatsappNumber: string;
  price: string;
  availabilityText: string;
}

/** Défauts = contenu actuel de la landing (design inchangé sans Supabase). */
export const DEFAULT_SETTINGS: SiteSettings = {
  heroImageUrl: "/images/hero-villa.png",
  heroTitle: "Teranga Park Villas",
  heroSubtitle:
    "À Nguerigne Peulh, à proximité de Ngaparou — résidence privée, moderne et sécurisée.",
  galleryImages: [
    {
      src: "/images/gallery-exterieur.png",
      label: "Extérieur",
      alt: "Façade extérieure contemporaine de la villa Teranga Park Villas",
    },
    {
      src: "/images/gallery-salon.png",
      label: "Salon",
      alt: "Salon lumineux avec finitions haut de gamme",
    },
    {
      src: "/images/gallery-suite.png",
      label: "Suite parentale",
      alt: "Suite parentale avec balcon privé",
    },
    {
      src: "/images/gallery-piscine.png",
      label: "Piscine",
      alt: "Piscine privée de la villa au coucher du soleil",
    },
    {
      src: "/images/gallery-terrasse.png",
      label: "Terrasse / Balcon",
      alt: "Terrasse avec vue sur l'environnement tropical",
    },
    {
      src: "/images/gallery-vue.png",
      label: "Vue générale",
      alt: "Vue générale de la résidence Teranga Park Villas",
    },
  ],
  pdfUrl: "",
  whatsappNumber: "221773615944", // +221 77 361 59 44
  price: "157 200 000 FCFA",
  availabilityText: "Prix de lancement pour les premières villas disponibles.",
};

/** Libellés de la galerie — l'ordre correspond à gallery_image_1..6. */
const GALLERY_LABELS = [
  { label: "Extérieur", alt: "Photo 1 — extérieur de la villa Teranga Park Villas" },
  { label: "Salon", alt: "Photo 2 — salon de la villa" },
  { label: "Suite parentale", alt: "Photo 3 — suite parentale" },
  { label: "Piscine", alt: "Photo 4 — piscine privée" },
  { label: "Terrasse / Balcon", alt: "Photo 5 — terrasse / balcon" },
  { label: "Vue générale", alt: "Photo 6 — vue générale" },
];

interface RawSettings {
  hero_image_url: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  gallery_image_1: string | null;
  gallery_image_2: string | null;
  gallery_image_3: string | null;
  gallery_image_4: string | null;
  gallery_image_5: string | null;
  gallery_image_6: string | null;
  pdf_url: string | null;
  whatsapp_number: string | null;
  price: string | null;
  availability_text: string | null;
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T | null> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

async function fetchFromSupabase(): Promise<Partial<SiteSettings> | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const result = await withTimeout(
      supabase.from("site_settings").select("*").limit(1).maybeSingle(),
      3000
    );
    if (!result || result.error || !result.data) return null;

    const raw = result.data as unknown as RawSettings;

    // Galerie : on ne garde que les URLs non vides (pas de bloc vide affiché)
    const galleryUrls = [
      raw.gallery_image_1,
      raw.gallery_image_2,
      raw.gallery_image_3,
      raw.gallery_image_4,
      raw.gallery_image_5,
      raw.gallery_image_6,
    ]
      .map((url) => (typeof url === "string" ? url.trim() : ""))
      .filter((url) => url.length > 0)
      .map((url, i) => ({
        src: url,
        label: GALLERY_LABELS[i]?.label ?? `Photo ${i + 1}`,
        alt: GALLERY_LABELS[i]?.alt ?? `Photo ${i + 1} — Teranga Park Villas`,
      }));

    const merged: Partial<SiteSettings> = {};
    if (raw.hero_image_url?.trim()) merged.heroImageUrl = raw.hero_image_url.trim();
    if (raw.hero_title?.trim()) merged.heroTitle = raw.hero_title.trim();
    if (raw.hero_subtitle?.trim()) merged.heroSubtitle = raw.hero_subtitle.trim();
    if (galleryUrls.length > 0) merged.galleryImages = galleryUrls;
    if (raw.pdf_url?.trim()) merged.pdfUrl = raw.pdf_url.trim();
    // Numéro WhatsApp normalisé : chiffres uniquement (format wa.me)
    if (raw.whatsapp_number?.trim()) {
      merged.whatsappNumber = raw.whatsapp_number.replace(/[^0-9]/g, "");
    }
    if (raw.price?.trim()) merged.price = raw.price.trim();
    if (raw.availability_text?.trim()) merged.availabilityText = raw.availability_text.trim();

    return merged;
  } catch {
    // Supabase indisponible → valeurs par défaut, le site continue de fonctionner
    return null;
  }
}

/**
 * getSiteSettings — à appeler uniquement côté serveur (page.tsx).
 * `cache()` de React déduplique les appels dans un même rendu.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const fromSupabase = await fetchFromSupabase();
  return { ...DEFAULT_SETTINGS, ...fromSupabase };
});
