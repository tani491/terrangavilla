"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Download,
  Loader2,
  MessageCircle,
  Send,
  FileWarning,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  buildDirectWhatsAppLink,
  DOSSIER_WHATSAPP_MESSAGE,
  OPEN_DOSSIER_MODAL_EVENT,
  submitLeadInBackground,
} from "@/lib/config";
import { getUtmPayload, trackLead } from "@/lib/tracking";

const COUNTRIES = [
  "Sénégal",
  "France",
  "Italie",
  "Belgique",
  "Espagne",
  "Canada",
  "États-Unis",
  "Autre pays",
];

const PDF_UNAVAILABLE_MESSAGE =
  "Le dossier est momentanément indisponible. Contactez-nous sur WhatsApp pour le recevoir.";

interface DossierModalProps {
  pdfUrl: string;
  whatsappNumber: string;
}

type Status = "idle" | "sending" | "success" | "unavailable";

/**
 * Modale "Recevoir le dossier" — parcours ultra simple :
 * Nom complet + WhatsApp + Pays → lead enregistré → téléchargement immédiat du PDF.
 * Ouverte par les boutons "Recevoir le dossier" (événement open-dossier-modal).
 */
export default function DossierModal({ pdfUrl }: DossierModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [fields, setFields] = useState({ fullName: "", phone: "", country: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const whatsappLink = buildDirectWhatsAppLink(DOSSIER_WHATSAPP_MESSAGE);

  // Ouverture depuis n'importe quel bouton "Recevoir le dossier" de la page
  useEffect(() => {
    const handler = () => {
      setStatus("idle");
      setErrors({});
      setOpen(true);
    };
    window.addEventListener(OPEN_DOSSIER_MODAL_EVENT, handler);
    return () => window.removeEventListener(OPEN_DOSSIER_MODAL_EVENT, handler);
  }, []);

  function setField(name: "fullName" | "phone" | "country", value: string) {
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  }

  async function startDownload() {
    if (!pdfUrl) return;
    // Le lead est déjà enregistré : téléchargement immédiat, sans attente.
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1. Validation simple et rapide (mobile-first)
    const nextErrors: Record<string, string> = {};
    if (fields.fullName.trim().length < 2)
      nextErrors.fullName = "Veuillez indiquer votre nom complet.";
    if (fields.phone.trim().length < 6 || !/^[+0-9 ()-]+$/.test(fields.phone.trim()))
      nextErrors.phone = "Veuillez indiquer un numéro WhatsApp valide.";
    if (!fields.country) nextErrors.country = "Veuillez sélectionner votre pays.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("sending");

    const fullName = fields.fullName.trim();
    const phone = fields.phone.trim();
    const message = [
      "Bonjour, je souhaite recevoir le dossier complet de Teranga Park Villas.",
      `Nom : ${fullName}`,
      `Téléphone : ${phone}`,
      `Pays : ${fields.country}`,
      ...(pdfUrl ? [`Dossier PDF : ${pdfUrl}`] : []),
    ].join("\n");

    submitLeadInBackground({
      fullName,
      phone,
      country: fields.country,
      requestedDocument: true,
      ...getUtmPayload(),
    });
    trackLead(undefined, undefined);
    setFields({ fullName: "", phone: "", country: "" });
    window.location.href = buildDirectWhatsAppLink(message);
  }

  const inputClasses =
    "h-12 border-[rgba(214,168,74,0.25)] bg-[#101010] text-[#F5F5F5] placeholder:text-[#A7A7A7]/50 focus-visible:ring-[rgba(214,168,74,0.4)]";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
      }}
    >
      <DialogContent className="max-w-md border-[rgba(214,168,74,0.25)] bg-[#0B0B0B] p-5 sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold text-[#F5F5F5]">
            Recevoir le dossier
          </DialogTitle>
          <DialogDescription className="pt-1.5 text-sm leading-relaxed text-[#A7A7A7]">
            Laissez vos coordonnées et téléchargez immédiatement le dossier
            complet de Teranga Park Villas.
          </DialogDescription>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center py-4 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-[#D6A84A]" aria-hidden />
            <p className="text-base font-semibold text-[#F5F5F5]">
              Merci, votre dossier est prêt.
            </p>
            <p className="mt-2 text-sm text-[#A7A7A7]">
              Si le téléchargement n&apos;a pas démarré, utilisez le bouton
              ci-dessous.
            </p>
            <button
              type="button"
              onClick={startDownload}
              className="mt-5 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-md bg-[#D6A84A] px-6 text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_28px_rgba(214,168,74,0.4)]"
            >
              <Download className="h-5 w-5" aria-hidden />
              Télécharger le dossier (PDF)
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs font-medium text-[#D6A84A] underline-offset-4 hover:underline"
            >
              Une question ? Écrivez-nous sur WhatsApp
            </a>
          </div>
        ) : status === "unavailable" ? (
          <div className="flex flex-col items-center py-4 text-center">
            <FileWarning className="mb-4 h-12 w-12 text-[#D6A84A]" aria-hidden />
            <p className="text-base leading-relaxed text-[#F5F5F5]">
              {PDF_UNAVAILABLE_MESSAGE}
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-md bg-[#D6A84A] px-6 text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_28px_rgba(214,168,74,0.4)]"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Contacter sur WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="dossier-name" className="mb-2 block text-sm font-medium text-[#F5F5F5]/90">
                  Nom complet *
                </Label>
                <Input
                  id="dossier-name"
                  type="text"
                  placeholder="Ex : Fatou Ndiaye"
                  autoComplete="name"
                  className={inputClasses}
                  aria-invalid={!!errors.fullName}
                  value={fields.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dossier-phone" className="mb-2 block text-sm font-medium text-[#F5F5F5]/90">
                  Téléphone / WhatsApp *
                </Label>
                <Input
                  id="dossier-phone"
                  type="tel"
                  placeholder="Ex : +221 77 123 45 67"
                  autoComplete="tel"
                  className={inputClasses}
                  aria-invalid={!!errors.phone}
                  value={fields.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dossier-country" className="mb-2 block text-sm font-medium text-[#F5F5F5]/90">
                  Pays de résidence *
                </Label>
                <Select
                  value={fields.country}
                  onValueChange={(v) => setField("country", v)}
                >
                  <SelectTrigger
                    id="dossier-country"
                    aria-label="Pays de résidence"
                    className="h-12 border-[rgba(214,168,74,0.25)] bg-[#101010] text-[#F5F5F5] data-[placeholder]:text-[#A7A7A7]/70 hover:border-[rgba(214,168,74,0.5)]"
                  >
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent className="border-[rgba(214,168,74,0.25)] bg-[#141414] text-[#F5F5F5]">
                    {COUNTRIES.map((c) => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="focus:bg-[rgba(214,168,74,0.12)] focus:text-[#D6A84A]"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="mt-1.5 text-xs text-red-400">{errors.country}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md bg-[#D6A84A] text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_32px_rgba(214,168,74,0.4)] disabled:opacity-60"
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Send className="h-[18px] w-[18px]" aria-hidden />
                  Recevoir le dossier
                </>
              )}
            </button>

            <p className="mt-3.5 text-center text-xs text-[#A7A7A7]">
              Vos informations restent confidentielles et ne sont jamais
              partagées.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
