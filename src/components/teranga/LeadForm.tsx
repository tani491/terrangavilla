"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildDirectWhatsAppLink, submitLeadInBackground } from "@/lib/config";
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

const formSchema = z.object({
  name: z.string().trim().min(2, "Veuillez indiquer votre nom complet."),
  phone: z
    .string()
    .trim()
    .min(6, "Veuillez indiquer votre numéro WhatsApp.")
    .regex(/^[+0-9 ()-]+$/, "Numéro invalide."),
  country: z.string().min(1, "Veuillez sélectionner votre pays."),
  projectType: z.enum(
    ["Résidence principale", "Résidence secondaire", "Investissement"],
    { message: "Veuillez sélectionner votre projet." }
  ),
  budget: z.enum(["Moins de 100 M", "100–150 M", "150–200 M", "200 M+"], {
    message: "Veuillez sélectionner votre budget.",
  }),
  purchaseTimeline: z.enum(
    ["Immédiatement", "Dans moins de 3 mois", "3–6 mois", "Plus tard"],
    { message: "Veuillez sélectionner votre échéance." }
  ),
  financing: z.enum(
    ["Fonds propres", "Financement bancaire", "Les deux", "À déterminer"],
    { message: "Veuillez sélectionner votre mode de financement." }
  ),
  visitPreference: z.enum(
    [
      "Visite physique",
      "Visite vidéo",
      "Appel WhatsApp",
      "Recevoir uniquement le dossier",
    ],
    { message: "Veuillez sélectionner votre préférence." }
  ),
});

type FormValues = z.infer<typeof formSchema>;

const SELECT_STYLES =
  "h-12 border-[rgba(214,168,74,0.25)] bg-[#101010] text-[#F5F5F5] data-[placeholder]:text-[#A7A7A7]/70 hover:border-[rgba(214,168,74,0.5)] focus:ring-[rgba(214,168,74,0.4)]";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="mb-2 block text-sm font-medium text-[#F5F5F5]/90">
      {children}
    </Label>
  );
}

export default function LeadForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      country: "",
    },
  });

  // react-hook-form n'est pas compatible React Compiler : seule son optimisation
  // memo est ignorée ici (aucun impact fonctionnel ni sur le build).
  // eslint-disable-next-line react-hooks/incompatible-library
  const projectType = watch("projectType");
  const budget = watch("budget");
  const purchaseTimeline = watch("purchaseTimeline");
  const financing = watch("financing");
  const visitPreference = watch("visitPreference");
  const country = watch("country");

  function onSubmit(values: FormValues) {
    setStatus("sending");
    const utm = getUtmPayload();
    const message = [
      "Bonjour, je souhaite recevoir le dossier Teranga Park Villas.",
      `Nom : ${values.name.trim()}`,
      `WhatsApp : ${values.phone.trim()}`,
      `Pays : ${values.country}`,
      `Projet : ${values.projectType}`,
      `Budget : ${values.budget}`,
      `Délai : ${values.purchaseTimeline}`,
      `Financement : ${values.financing}`,
    ].join("\n");

    submitLeadInBackground({ ...values, ...utm });
    trackLead(values.budget, values.projectType);
    setStatus("success");
    reset();
    window.location.href = buildDirectWhatsAppLink(message);
  }

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#D6A84A]">
            Votre projet
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl">
            Recevez le dossier complet
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#A7A7A7] sm:text-lg">
            Quelques informations nous permettent de vous transmettre les
            détails du projet, les disponibilités et les modalités adaptées à
            votre situation.
          </p>
          <div className="hairline-gold mx-auto mt-8 w-40" aria-hidden />
        </div>

        <div className="card-luxury rounded-xl p-5 sm:p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="mb-5 h-14 w-14 text-[#D6A84A]" aria-hidden />
              <h3 className="font-display text-2xl font-semibold text-[#F5F5F5] sm:text-3xl">
                Merci.
              </h3>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[#A7A7A7]">
                Votre demande a bien été prise en compte. Nous vous
                contacterons prochainement.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Nom complet */}
                <div className="sm:col-span-1">
                  <FieldLabel>Nom complet *</FieldLabel>
                  <Input
                    type="text"
                    placeholder="Ex : Fatou Ndiaye"
                    autoComplete="name"
                    className="h-12 border-[rgba(214,168,74,0.25)] bg-[#101010] text-[#F5F5F5] placeholder:text-[#A7A7A7]/50 focus-visible:ring-[rgba(214,168,74,0.4)]"
                    aria-invalid={!!errors.name}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="sm:col-span-1">
                  <FieldLabel>WhatsApp *</FieldLabel>
                  <Input
                    type="tel"
                    placeholder="Ex : +221 77 123 45 67"
                    autoComplete="tel"
                    className="h-12 border-[rgba(214,168,74,0.25)] bg-[#101010] text-[#F5F5F5] placeholder:text-[#A7A7A7]/50 focus-visible:ring-[rgba(214,168,74,0.4)]"
                    aria-invalid={!!errors.phone}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Pays de résidence */}
                <div className="sm:col-span-2">
                  <FieldLabel>Pays de résidence *</FieldLabel>
                  <Select
                    value={country || undefined}
                    onValueChange={(v) => setValue("country", v, { shouldValidate: true })}
                  >
                    <SelectTrigger className={SELECT_STYLES} aria-label="Pays de résidence">
                      <SelectValue placeholder="Sélectionnez votre pays" />
                    </SelectTrigger>
                    <SelectContent className="border-[rgba(214,168,74,0.25)] bg-[#141414] text-[#F5F5F5]">
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c} className="focus:bg-[rgba(214,168,74,0.12)] focus:text-[#D6A84A]">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Projet */}
                <div>
                  <FieldLabel>Quel est votre projet ? *</FieldLabel>
                  <Select
                    value={projectType || undefined}
                    onValueChange={(v) => setValue("projectType", v as FormValues["projectType"], { shouldValidate: true })}
                  >
                    <SelectTrigger className={SELECT_STYLES} aria-label="Votre projet">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent className="border-[rgba(214,168,74,0.25)] bg-[#141414] text-[#F5F5F5]">
                      {["Résidence principale", "Résidence secondaire", "Investissement"].map((o) => (
                        <SelectItem key={o} value={o} className="focus:bg-[rgba(214,168,74,0.12)] focus:text-[#D6A84A]">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.projectType && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.projectType.message}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <FieldLabel>Votre budget immobilier ? *</FieldLabel>
                  <Select
                    value={budget || undefined}
                    onValueChange={(v) => setValue("budget", v as FormValues["budget"], { shouldValidate: true })}
                  >
                    <SelectTrigger className={SELECT_STYLES} aria-label="Votre budget">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent className="border-[rgba(214,168,74,0.25)] bg-[#141414] text-[#F5F5F5]">
                      {["Moins de 100 M", "100–150 M", "150–200 M", "200 M+"].map((o) => (
                        <SelectItem key={o} value={o} className="focus:bg-[rgba(214,168,74,0.12)] focus:text-[#D6A84A]">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.budget && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.budget.message}
                    </p>
                  )}
                </div>

                {/* Échéance */}
                <div>
                  <FieldLabel>Quand souhaitez-vous acheter ? *</FieldLabel>
                  <Select
                    value={purchaseTimeline || undefined}
                    onValueChange={(v) => setValue("purchaseTimeline", v as FormValues["purchaseTimeline"], { shouldValidate: true })}
                  >
                    <SelectTrigger className={SELECT_STYLES} aria-label="Échéance d'achat">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent className="border-[rgba(214,168,74,0.25)] bg-[#141414] text-[#F5F5F5]">
                      {["Immédiatement", "Dans moins de 3 mois", "3–6 mois", "Plus tard"].map((o) => (
                        <SelectItem key={o} value={o} className="focus:bg-[rgba(214,168,74,0.12)] focus:text-[#D6A84A]">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.purchaseTimeline && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.purchaseTimeline.message}
                    </p>
                  )}
                </div>

                {/* Financement */}
                <div>
                  <FieldLabel>Mode de financement *</FieldLabel>
                  <Select
                    value={financing || undefined}
                    onValueChange={(v) => setValue("financing", v as FormValues["financing"], { shouldValidate: true })}
                  >
                    <SelectTrigger className={SELECT_STYLES} aria-label="Mode de financement">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent className="border-[rgba(214,168,74,0.25)] bg-[#141414] text-[#F5F5F5]">
                      {["Fonds propres", "Financement bancaire", "Les deux", "À déterminer"].map((o) => (
                        <SelectItem key={o} value={o} className="focus:bg-[rgba(214,168,74,0.12)] focus:text-[#D6A84A]">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.financing && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.financing.message}
                    </p>
                  )}
                </div>

                {/* Préférence */}
                <div className="sm:col-span-2">
                  <FieldLabel>Votre préférence *</FieldLabel>
                  <Select
                    value={visitPreference || undefined}
                    onValueChange={(v) => setValue("visitPreference", v as FormValues["visitPreference"], { shouldValidate: true })}
                  >
                    <SelectTrigger className={SELECT_STYLES} aria-label="Votre préférence de contact">
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent className="border-[rgba(214,168,74,0.25)] bg-[#141414] text-[#F5F5F5]">
                      {[
                        "Visite physique",
                        "Visite vidéo",
                        "Appel WhatsApp",
                        "Recevoir uniquement le dossier",
                      ].map((o) => (
                        <SelectItem key={o} value={o} className="focus:bg-[rgba(214,168,74,0.12)] focus:text-[#D6A84A]">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.visitPreference && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.visitPreference.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={status === "sending"}
                className="mt-7 h-14 w-full bg-[#D6A84A] text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_32px_rgba(214,168,74,0.4)] disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4.5 w-4.5" aria-hidden />
                    Recevoir le dossier Teranga Park Villas
                  </>
                )}
              </Button>

              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-[#A7A7A7]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-[#D6A84A]/70" aria-hidden />
                Vos informations restent confidentielles et ne sont jamais
                partagées.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
