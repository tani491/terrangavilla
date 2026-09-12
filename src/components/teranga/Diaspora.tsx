"use client";

import { Globe2, Video } from "lucide-react";
import { openDossierModal } from "@/lib/config";
import { trackSchedule } from "@/lib/tracking";

const COUNTRIES = [
  { flag: "🇫🇷", name: "France" },
  { flag: "🇮🇹", name: "Italie" },
  { flag: "🇧🇪", name: "Belgique" },
  { flag: "🇪🇸", name: "Espagne" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇺🇸", name: "États-Unis" },
];

export default function Diaspora() {
  return (
    <section
      id="diaspora"
      className="relative overflow-hidden py-20 sm:py-28"
    >
      {/* Halo doré */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-[360px] w-[520px] translate-x-1/3 rounded-full bg-[rgba(214,168,74,0.06)] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(214,168,74,0.4)] bg-[rgba(214,168,74,0.08)]">
          <Globe2 className="h-6.5 w-6.5 text-[#D6A84A]" aria-hidden />
        </div>

        <h2 className="font-display text-3xl font-semibold leading-tight text-[#F5F5F5] sm:text-4xl lg:text-5xl">
          Vous vivez à l'étranger ?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#A7A7A7] sm:text-lg">
          Découvrez Teranga Park Villas à distance, recevez toutes les
          informations du projet et programmez une visite vidéo personnalisée
          avant votre déplacement au Sénégal.
        </p>

        <ul
          className="mt-9 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
          aria-label="Pays de résidence de notre clientèle"
        >
          {COUNTRIES.map(({ flag, name }) => (
            <li
              key={name}
              className="card-luxury flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[#F5F5F5]"
            >
              <span aria-hidden>{flag}</span>
              {name}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-[#A7A7A7]/70">
          Et partout ailleurs : notre équipe s'adapte à votre fuseau horaire.
        </p>

        <button
          type="button"
          onClick={() => {
            trackSchedule("diaspora_video_visit");
            openDossierModal();
          }}
          className="mt-9 inline-flex min-h-[52px] items-center gap-2.5 rounded-md bg-[#D6A84A] px-8 text-base font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_32px_rgba(214,168,74,0.4)]"
        >
          <Video className="h-5 w-5" aria-hidden />
          Programmer une visite vidéo
        </button>
      </div>
    </section>
  );
}
