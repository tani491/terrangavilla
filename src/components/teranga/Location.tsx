import { MapPin, Compass, Home, Waves } from "lucide-react";
import SectionTitle from "./SectionTitle";

const PROXIMITIES = [
  { icon: MapPin, label: "Proximité de Ngaparou" },
  { icon: Compass, label: "Accès rapide à la Petite Côte" },
  { icon: Home, label: "Environnement résidentiel" },
  { icon: Waves, label: "À proximité de la lagune" },
];

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Nguerigne+Peulh+Ngaparou+S%C3%A9n%C3%A9gal";

export default function Location() {
  return (
    <section id="localisation" className="relative bg-[#0E0D0B] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Localisation"
          title="Un emplacement au cœur de la Petite Côte"
        />

        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-base leading-relaxed text-[#A7A7A7] sm:text-lg">
              <span className="font-semibold text-[#F5F5F5]">
                Teranga Park Villas
              </span>{" "}
              est situé à Nguerigne Peulh, sur la route de Ngaparou, dans une
              zone résidentielle en développement.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {PROXIMITIES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="card-luxury flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium text-[#F5F5F5]"
                >
                  <Icon className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-md bg-[#D6A84A] px-6 text-sm font-semibold text-[#0B0B0B] transition-all hover:bg-[#e8c982] hover:shadow-[0_0_28px_rgba(214,168,74,0.35)]"
            >
              <MapPin className="h-4.5 w-4.5" aria-hidden />
              Voir la localisation
            </a>
          </div>

          {/* Carte — intégration Google Maps à connecter avec l'iframe officielle */}
          <div className="card-luxury relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg sm:min-h-[400px]">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(214,168,74,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(214,168,74,0.18) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
              aria-hidden
            />
            <div className="relative z-10 px-8 text-center">
              <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(214,168,74,0.4)] bg-[rgba(214,168,74,0.08)]">
                <MapPin className="h-7 w-7 text-[#D6A84A]" aria-hidden />
              </div>
              <p className="font-display text-2xl font-semibold text-[#F5F5F5]">
                Nguerigne Peulh
              </p>
              <p className="mt-2 text-sm text-[#A7A7A7]">
                Route de Ngaparou — Petite Côte, Sénégal
              </p>
              <p className="mt-4 text-xs text-[#A7A7A7]/70">
                Carte interactive Google Maps à intégrer à cette emplacement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
