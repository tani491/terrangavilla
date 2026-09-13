"use client";

import Image from "next/image";
import { ShieldCheck, Waves, LandPlot, BedDouble } from "lucide-react";
import {
  buildDirectWhatsAppLink,
  openDossierModal,
  VISIT_WHATSAPP_MESSAGE,
} from "@/lib/config";
import { trackContact } from "@/lib/tracking";

const REASSURANCE = [
  { icon: BedDouble, label: "5 chambres" },
  { icon: Waves, label: "Piscine" },
  { icon: LandPlot, label: "300 m² de terrain" },
  { icon: ShieldCheck, label: "Sécurité 24h/24" },
];

interface HeroProps {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  price: string;
  whatsappNumber: string;
}

export default function Hero({
  heroImageUrl,
  heroTitle,
  heroSubtitle,
  price,
}: HeroProps) {
  return (
    <section id="hero" className="relative min-h-[100svh] overflow-hidden">
      {/* Image de fond (dynamique — site_setting.hero_image_url) */}
      <div className="absolute inset-0">
        <Image
          src={heroImageUrl}
          alt="Villa contemporaine Teranga Park Villas avec piscine éclairée à la tombée du jour"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dégradés pour la lisibilité (renforcés en mobile) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/85 via-[#0B0B0B]/60 to-[#0B0B0B]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/80 via-transparent to-[#0B0B0B]/30" />
      </div>

      {/* Contenu */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#D6A84A] sm:text-sm">
            Nguerigne Peulh · Petite Côte · Sénégal
          </p>

          <h1 className="font-display text-4xl font-semibold leading-[1.08] text-[#F5F5F5] sm:text-6xl lg:text-7xl">
            {heroTitle}
            <span className="mt-2 block text-2xl font-medium text-gold-gradient sm:text-4xl lg:text-5xl">
              Villas haut de gamme sur la Petite Côte
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-[#A7A7A7] sm:text-lg">
            {heroSubtitle}
          </p>

          {/* Prix — visible immédiatement (dynamique — site_setting.price) */}
          <p className="mt-6 text-lg font-semibold text-[#F5F5F5] sm:text-xl">
            À partir de{" "}
            <span className="text-gold-gradient font-display text-3xl font-bold sm:text-4xl">
              {price}
            </span>
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={openDossierModal}
              className="inline-flex min-h-[52px] items-center justify-center rounded-md bg-[#D6A84A] px-8 text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_32px_rgba(214,168,74,0.4)]"
            >
              Recevoir le dossier complet
            </button>
            <a
              href={buildDirectWhatsAppLink(VISIT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact("hero_secondary_cta")}
              className="inline-flex min-h-[52px] items-center justify-center rounded-md border border-[rgba(214,168,74,0.5)] px-8 text-base font-semibold text-[#F5F5F5] transition-all hover:border-[#D6A84A] hover:bg-[rgba(214,168,74,0.1)]"
            >
              Programmer une visite privée
            </a>
          </div>

          {/* Éléments rassurants */}
          <ul className="mt-9 grid grid-cols-2 gap-x-4 gap-y-3 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6">
            {REASSURANCE.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm font-medium text-[#F5F5F5]/90"
              >
                <Icon className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
