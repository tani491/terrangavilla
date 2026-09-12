"use client";

import Link from "next/link";
import { Instagram, MessageCircle, Music2, Phone } from "lucide-react";
import { buildWhatsAppLink, DEFAULT_WHATSAPP_MESSAGE, SITE } from "@/lib/config";
import { trackContact } from "@/lib/tracking";

interface FooterProps {
  whatsappNumber: string;
}

export default function Footer({ whatsappNumber }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-[rgba(214,168,74,0.16)] bg-[#080808]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
          {/* Marque */}
          <div className="max-w-sm text-center md:text-left">
            <p className="font-display text-2xl font-semibold text-[#F5F5F5]">
              Teranga Park <span className="text-gold-gradient">Villas</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[#A7A7A7]">
              Projet immobilier sur la Petite Côte.
              <br />
              Nguerigne Peulh — route de Ngaparou, Sénégal.
            </p>
          </div>

          {/* Contacts */}
          <div className="flex flex-col items-center gap-3 md:items-start">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#D6A84A]">
              Contact
            </p>
            <a
              href={buildWhatsAppLink(whatsappNumber, DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContact("footer")}
              className="flex min-h-[44px] items-center gap-2.5 text-sm text-[#A7A7A7] transition-colors hover:text-[#D6A84A]"
            >
              <MessageCircle className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
              WhatsApp
            </a>
            <a
              href={SITE.phoneHref}
              className="flex min-h-[44px] items-center gap-2.5 text-sm text-[#A7A7A7] transition-colors hover:text-[#D6A84A]"
            >
              <Phone className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
              {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-2.5 text-sm text-[#A7A7A7] transition-colors hover:text-[#D6A84A]"
            >
              <Instagram className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
              Ikhlass Construction · my_immobilier_senegal
            </a>
            <a
              href={SITE.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-2.5 text-sm text-[#A7A7A7] transition-colors hover:text-[#D6A84A]"
            >
              <Music2 className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
              TikTok · @ikhlass.construction
            </a>
          </div>

          {/* Navigation rapide */}
          <nav
            aria-label="Navigation de pied de page"
            className="flex flex-col items-center gap-3 md:items-start"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#D6A84A]">
              Le projet
            </p>
            {[
              { label: "Galerie", href: "#galerie" },
              { label: "Caractéristiques", href: "#caracteristiques" },
              { label: "Prix", href: "#prix" },
              { label: "Localisation", href: "#localisation" },
              { label: "FAQ", href: "#faq" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex min-h-[44px] items-center text-sm text-[#A7A7A7] transition-colors hover:text-[#D6A84A]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 border-t border-[rgba(214,168,74,0.12)] pt-7">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-[#A7A7A7]/70 sm:text-left">
            Les informations, prix et disponibilités sont susceptibles
            d'évoluer. Veuillez confirmer les conditions auprès de l'équipe
            commerciale.
          </p>
          <p className="mt-4 text-center text-xs text-[#A7A7A7]/50 sm:text-left">
            © {new Date().getFullYear()} Teranga Park Villas. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
