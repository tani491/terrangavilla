"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, openDossierModal } from "@/lib/config";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloque le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[rgba(214,168,74,0.18)]"
          : "bg-gradient-to-b from-black/70 to-transparent border-b border-transparent"
      )}
    >
      <nav
        aria-label="Navigation principale"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:h-[72px]"
      >
        {/* Logo */}
        <Link
          href="#hero"
          className="font-display text-xl md:text-2xl font-semibold tracking-wide text-[#F5F5F5]"
          onClick={() => setOpen(false)}
        >
          Teranga Park{" "}
          <span className="text-gold-gradient">Villas</span>
        </Link>

        {/* Liens desktop */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#A7A7A7] transition-colors hover:text-[#D6A84A]"
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={openDossierModal}
            className="rounded-md bg-[#D6A84A] px-4 py-2.5 text-sm font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_24px_rgba(214,168,74,0.35)]"
          >
            Recevoir le dossier
          </button>
        </div>

        {/* Burger mobile */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          className="flex h-11 w-11 items-center justify-center rounded-md text-[#F5F5F5] lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-[rgba(214,168,74,0.14)] bg-[#0B0B0B]/98 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-medium text-[#F5F5F5] transition-colors hover:bg-[#141414] hover:text-[#D6A84A]"
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openDossierModal();
              }}
              className="mt-3 rounded-md bg-[#D6A84A] px-4 py-3.5 text-center text-base font-semibold text-[#0B0B0B] transition-colors hover:bg-[#e8c982]"
            >
              Recevoir le dossier
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
