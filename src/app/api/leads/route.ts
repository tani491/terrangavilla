import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

/**
 * Enregistrement des prospects.
 * - Si Supabase est configuré → insertion dans la table `leads` (RLS : insert only).
 * - Sinon → fallback local (Prisma/SQLite) pour que le site fonctionne partout
 *   (local, preview, production) même avant la connexion de Supabase.
 * - Le champ `requested_document` = true quand le prospect demande le dossier PDF.
 */

const leadSchema = z.object({
  // Formulaire modale "Recevoir le dossier" (full_name) OU formulaire complet (name)
  fullName: z.string().trim().min(2, "Nom complet requis").max(120).optional(),
  name: z.string().trim().min(2, "Nom complet requis").max(120).optional(),
  phone: z
    .string()
    .trim()
    .min(6, "Numéro WhatsApp requis")
    .max(30)
    .regex(/^[+0-9 ()-]+$/, "Numéro invalide"),
  country: z.string().trim().min(1, "Pays requis").max(80),
  requestedDocument: z.boolean().optional().default(false),
  // Champs du formulaire de qualification complet (tous optionnels)
  projectType: z
    .enum(["Résidence principale", "Résidence secondaire", "Investissement"])
    .optional(),
  budget: z.enum(["Moins de 100 M", "100–150 M", "150–200 M", "200 M+"]).optional(),
  purchaseTimeline: z
    .enum(["Immédiatement", "Dans moins de 3 mois", "3–6 mois", "Plus tard"])
    .optional(),
  financing: z
    .enum(["Fonds propres", "Financement bancaire", "Les deux", "À déterminer"])
    .optional(),
  visitPreference: z
    .enum([
      "Visite physique",
      "Visite vidéo",
      "Appel WhatsApp",
      "Recevoir uniquement le dossier",
    ])
    .optional(),
  message: z.string().trim().max(2000).optional().nullable(),
  // Tracking des sources (calculé côté client via lib/tracking)
  source: z.string().trim().max(80).optional().nullable(),
  utmSource: z.string().trim().max(120).optional().nullable(),
  utmMedium: z.string().trim().max(120).optional().nullable(),
  utmCampaign: z.string().trim().max(120).optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: z.flattenError(parsed.error).fieldErrors,
        },
        { status: 400 }
      );
    }

    const d = parsed.data;
    const fullName = (d.fullName ?? d.name ?? "").trim();

    if (fullName.length < 2) {
      return NextResponse.json(
        { error: "Données invalides", details: { fullName: ["Nom requis"] } },
        { status: 400 }
      );
    }

    // ── 1. Insertion Supabase (production) ──────────────────────────────────
    if (isSupabaseConfigured) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from("leads").insert({
          full_name: fullName,
          phone: d.phone,
          country: d.country,
          requested_document: d.requestedDocument ?? false,
          source: d.source ?? "direct",
          utm_source: d.utmSource ?? null,
          utm_medium: d.utmMedium ?? null,
          utm_campaign: d.utmCampaign ?? null,
          project_type: d.projectType ?? null,
          budget: d.budget ?? null,
          purchase_timeline: d.purchaseTimeline ?? null,
          financing: d.financing ?? null,
          visit_preference: d.visitPreference ?? null,
        });

        if (error) {
          console.error("[/api/leads] Erreur Supabase :", error.message);
          // On tente le fallback local ci-dessous plutôt que d'échouer.
        } else {
          return NextResponse.json({ ok: true, storage: "supabase" }, { status: 201 });
        }
      }
    }

    // ── 2. Fallback local Prisma/SQLite ─────────────────────────────────────
    const lead = await db.lead.create({
      data: {
        name: fullName,
        phone: d.phone,
        country: d.country,
        projectType: d.projectType ?? "",
        budget: d.budget ?? "",
        purchaseTimeline: d.purchaseTimeline ?? "",
        financing: d.financing ?? "",
        visitPreference: d.visitPreference ?? "",
        requestedDocument: d.requestedDocument ?? false,
        message: d.message ?? null,
        source: d.source ?? "direct",
        utmSource: d.utmSource ?? null,
        utmMedium: d.utmMedium ?? null,
        utmCampaign: d.utmCampaign ?? null,
        status: "new",
      },
    });

    return NextResponse.json(
      { ok: true, id: lead.id, storage: "local" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[/api/leads] Erreur :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Merci de réessayer." },
      { status: 500 }
    );
  }
}
