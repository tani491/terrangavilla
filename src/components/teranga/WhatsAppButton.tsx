"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/config";
import { trackContact } from "@/lib/tracking";

interface WhatsAppButtonProps {
  whatsappNumber: string;
}

/**
 * Bouton WhatsApp flottant — discret et premium.
 * Numéro dynamique (site_setting.whatsapp_number) passé en prop depuis page.tsx.
 * Apparaît après un léger scroll pour ne pas polluer le Hero.
 * Un seul bouton flottant sur toute la page, conforme au brief.
 */
export default function WhatsAppButton({ whatsappNumber }: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={buildWhatsAppLink(whatsappNumber, DEFAULT_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackContact("floating_button")}
      aria-label="Discuter sur WhatsApp"
      className={cn(
        "fixed bottom-5 right-4 z-40 flex min-h-[52px] items-center gap-2.5 rounded-full border border-[rgba(214,168,74,0.35)] bg-[#141414]/95 py-3 pl-4 pr-5 text-sm font-semibold text-[#F5F5F5] shadow-[0_8px_32px_rgba(0,0,0,0.55)] backdrop-blur transition-all duration-300 hover:border-[#D6A84A] hover:bg-[#1a1a1a] sm:bottom-6 sm:right-6",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#D6A84A]/15">
        <MessageCircle className="h-4.5 w-4.5 text-[#D6A84A]" aria-hidden />
        <span
          className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#3fb950]"
          aria-hidden
        />
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
