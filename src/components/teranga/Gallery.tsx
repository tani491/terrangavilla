"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import SectionTitle from "./SectionTitle";

export interface GalleryImage {
  src: string;
  label: string;
  alt: string;
}

interface GalleryProps {
  images: GalleryImage[];
}

/**
 * Galerie immersive — images dynamiques (site_settings.gallery_image_1..6).
 * Seules les images disponibles sont affichées (pas de bloc vide).
 * Mobile : slider horizontal — Desktop : grille. Lightbox simple au clic.
 */
export default function Gallery({ images }: GalleryProps) {
  const photos = images.filter((img) => !!img.src);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [allOpen, setAllOpen] = useState(false);

  const close = useCallback(() => {
    setLightboxIndex(null);
    setAllOpen(false);
  }, []);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }, [photos.length]);

  // Navigation clavier
  useEffect(() => {
    if (lightboxIndex === null && !allOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (lightboxIndex !== null) {
        if (e.key === "ArrowLeft") prev();
        if (e.key === "ArrowRight") next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, allOpen, close, prev, next]);

  if (photos.length === 0) return null;

  return (
    <section id="galerie" className="relative bg-[#0E0D0B] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Galerie"
          title="Découvrez votre future villa"
          subtitle="Extérieurs, intérieurs, espaces de détente : plongez dans l'ambiance de Teranga Park Villas."
        />

        {/* Mobile : slider horizontal — Desktop : grille */}
        <div
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0"
          role="list"
          aria-label="Photos de la villa"
        >
          {photos.map((photo, index) => (
            <figure
              key={photo.src}
              role="listitem"
              className={`group relative shrink-0 snap-center overflow-hidden rounded-lg border border-[rgba(214,168,74,0.14)] h-72 w-[78vw] sm:w-[55vw] md:aspect-[4/3] md:h-auto md:w-full ${
                index >= 4 ? "hidden md:block" : ""
              }`}
            >
              <button
                type="button"
                className="absolute inset-0 h-full w-full cursor-zoom-in"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Agrandir la photo : ${photo.label}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 78vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                <span className="absolute bottom-0 left-0 flex w-full items-center justify-between px-4 pb-3.5">
                  <span className="text-sm font-semibold text-white">
                    {photo.label}
                  </span>
                  <span className="text-[11px] uppercase tracking-widest text-[#D6A84A] opacity-0 transition-opacity group-hover:opacity-100">
                    Agrandir
                  </span>
                </span>
              </button>
            </figure>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setAllOpen(true)}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-md border border-[rgba(214,168,74,0.5)] px-6 text-sm font-semibold text-[#F5F5F5] transition-all hover:border-[#D6A84A] hover:bg-[rgba(214,168,74,0.1)]"
          >
            <Images className="h-4.5 w-4.5 text-[#D6A84A]" aria-hidden />
            Voir toutes les photos
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null || allOpen}
        onOpenChange={(o) => {
          if (!o) close();
        }}
      >
        <DialogContent className="max-w-5xl border-[rgba(214,168,74,0.25)] bg-[#0B0B0B] p-3 sm:p-4">
          <DialogTitle className="sr-only">
            {allOpen ? "Toutes les photos" : photos[lightboxIndex ?? 0]?.label}
          </DialogTitle>

          {allOpen && lightboxIndex === null ? (
            <div className="grid max-h-[75vh] grid-cols-2 gap-2 overflow-y-auto p-1 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  className="relative aspect-[4/3] overflow-hidden rounded-md border border-[rgba(214,168,74,0.14)]"
                  onClick={() => {
                    setAllOpen(false);
                    setLightboxIndex(index);
                  }}
                  aria-label={`Voir la photo : ${photo.label}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 45vw, 22vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : (
            lightboxIndex !== null && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md sm:aspect-[16/10]">
                <Image
                  src={photos[lightboxIndex].src}
                  alt={photos[lightboxIndex].alt}
                  fill
                  sizes="(max-width: 1024px) 95vw, 1000px"
                  className="object-cover"
                  priority
                />
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur">
                  {photos[lightboxIndex].label} — {lightboxIndex + 1} /{" "}
                  {photos.length}
                </span>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Photo précédente"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-[#D6A84A] hover:text-black"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Photo suivante"
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-[#D6A84A] hover:text-black"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )
          )}

          <button
            type="button"
            onClick={close}
            aria-label="Fermer"
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-[#D6A84A] hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
