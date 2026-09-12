"use client";

import { FileText, MessageCircle } from "lucide-react";
import {
  buildWhatsAppLink,
  DEFAULT_WHATSAPP_MESSAGE,
  openDossierModal,
} from "@/lib/config";
import { trackContact } from "@/lib/tracking";

interface CTAProps {
  whatsappNumber: string;
}

export default function CTA({ whatsappNumber }: CTAProps) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      {/* Halo doré */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(214,168,74,0.07)] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-semibold leading-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl">
          Vous souhaitez découvrir{" "}
          <span className="text-gold-gradient">Teranga Park Villas</span> ?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#A7A7A7] sm:text-lg">
          Recevez le dossier complet, les disponibilités et les modalités de
          visite.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={openDossierModal}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md bg-[#D6A84A] px-8 text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_32px_rgba(214,168,74,0.4)] sm:w-auto"
          >
            <FileText className="h-4.5 w-4.5" aria-hidden />
            Recevoir le dossier
          </button>
          <a
            href={buildWhatsAppLink(whatsappNumber, DEFAULT_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackContact("final_cta")}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-md border border-[rgba(214,168,74,0.5)] px-8 text-base font-semibold text-[#F5F5F5] transition-all hover:border-[#D6A84A] hover:bg-[rgba(214,168,74,0.1)] sm:w-auto"
          >
            <MessageCircle className="h-4.5 w-4.5 text-[#D6A84A]" aria-hidden />
            Parler sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
