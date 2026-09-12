"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Video, MonitorPlay } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { openDossierModal } from "@/lib/config";
import { trackSchedule } from "@/lib/tracking";

export default function VideoVisit() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative bg-[#0E0D0B] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Texte */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#D6A84A]">
              Visite à distance
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl">
              Visitez la villa sans vous déplacer
            </h2>
            <div className="hairline-gold mt-7 w-40" aria-hidden />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#A7A7A7] sm:text-lg">
              Découvrez les espaces, les finitions et l'environnement avant de
              programmer une visite physique. Visite vidéo guidée par notre
              équipe, en direct ou en replay.
            </p>

            <ul className="mt-7 grid gap-3 text-sm text-[#F5F5F5]/85">
              <li className="flex items-center gap-3">
                <Video className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
                Visite vidéo personnalisée en visioconférence
              </li>
              <li className="flex items-center gap-3">
                <MonitorPlay className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
                Reels, visite 360° et vidéos des villas en préparation
              </li>
            </ul>

            <button
              type="button"
              onClick={() => {
                trackSchedule("video_section_cta");
                openDossierModal();
              }}
              className="mt-9 inline-flex min-h-[52px] items-center rounded-md bg-[#D6A84A] px-8 text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_32px_rgba(214,168,74,0.4)]"
            >
              Je souhaite visiter
            </button>
          </div>

          {/* Lecteur vertical */}
          <div className="mx-auto w-full max-w-sm">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl border border-[rgba(214,168,74,0.25)] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              aria-label="Lire la présentation vidéo de la villa"
            >
              <Image
                src="/images/video-poster.png"
                alt="Aperçu vidéo — intérieur haut de gamme de la villa"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                aria-hidden
              />
              <span className="absolute left-1/2 top-1/2 flex h-18 w-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#D6A84A]/95 p-5 text-[#0B0B0B] shadow-[0_0_40px_rgba(214,168,74,0.5)] transition-transform duration-300 group-hover:scale-110">
                <Play className="h-7 w-7 fill-current" aria-hidden />
              </span>
              <span className="absolute bottom-4 left-0 w-full text-center text-sm font-semibold text-white">
                Découvrir la villa en vidéo
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Dialog vidéo — remplacer par l'embed réel (Reel, YouTube non répertorié, 360°) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-[rgba(214,168,74,0.25)] bg-[#0B0B0B] p-6 text-center">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl text-[#F5F5F5]">
              Visite vidéo — bientôt disponible
            </DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed text-[#A7A7A7]">
              La visite vidéo complète est en cours de préparation. Demandez
              dès maintenant une visite vidéo personnalisée en direct avec
              notre équipe : nous vous présentons la villa et réponsons à vos
              questions en temps réel.
            </DialogDescription>
          </DialogHeader>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              trackSchedule("video_dialog_cta");
              openDossierModal();
            }}
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-md bg-[#D6A84A] text-base font-semibold text-[#0B0B0B] transition-colors hover:bg-[#e8c982]"
          >
            Programmer ma visite vidéo
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
