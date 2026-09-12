"use client";

import { BadgeCheck, CalendarClock, FileText } from "lucide-react";
import { openDossierModal } from "@/lib/config";

const INCLUDED = [
  "Villa de 5 chambres avec suite parentale",
  "Piscine privée et terrasse",
  "Terrain de 300 m²",
  "Résidence privée sécurisée 24h/24",
];

interface PricingProps {
  price: string;
  availabilityText: string;
}

export default function Pricing({ price, availabilityText }: PricingProps) {
  return (
    <section id="prix" className="relative overflow-hidden py-20 sm:py-28">
      {/* Halo doré discret */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(214,168,74,0.05)] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#D6A84A]">
          Offre de lancement
        </p>

        <h2 className="font-display text-3xl font-semibold leading-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl">
          {price.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-gold-gradient">
            {price.split(" ").slice(-1)[0] ?? "FCFA"}
          </span>
        </h2>

        <p className="mt-4 text-base font-medium text-[#F5F5F5]/85 sm:text-lg">
          {availabilityText}
        </p>

        <ul className="mx-auto mt-10 grid max-w-2xl gap-3 text-left sm:grid-cols-2">
          {INCLUDED.map((item) => (
            <li
              key={item}
              className="card-luxury flex items-start gap-3 rounded-lg px-4 py-3.5 text-sm text-[#F5F5F5]/90"
            >
              <BadgeCheck
                className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#D6A84A]"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            type="button"
            onClick={openDossierModal}
            className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-[#D6A84A] px-8 text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_32px_rgba(214,168,74,0.4)]"
          >
            Recevoir les modalités de paiement
          </button>
          <p className="flex items-center gap-2 text-xs leading-relaxed text-[#A7A7A7] sm:text-sm">
            <FileText className="h-4 w-4 shrink-0 text-[#D6A84A]/70" aria-hidden />
            Les conditions, modalités de paiement et disponibilités peuvent être
            communiquées sur demande.
          </p>
        </div>
      </div>
    </section>
  );
}
