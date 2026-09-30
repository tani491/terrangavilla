import { MapPin, Compass, Home, Waves } from "lucide-react";
import SectionTitle from "./SectionTitle";

const PROXIMITIES = [
  { icon: MapPin, label: "Proximité de Ngaparou" },
  { icon: Compass, label: "Accès rapide à la Petite Côte" },
  { icon: Home, label: "Environnement résidentiel" },
  { icon: Waves, label: "À proximité de la lagune" },
];

const MAP_LATITUDE = "14.4777";
const MAP_LONGITUDE = "-17.03697";
const MAPS_URL =
  `https://www.google.com/maps/search/?api=1&query=${MAP_LATITUDE}%2C${MAP_LONGITUDE}`;
const MAP_EMBED_URL =
  `https://www.google.com/maps?q=${MAP_LATITUDE},${MAP_LONGITUDE}&z=16&output=embed`;

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

          <div className="card-luxury relative min-h-[320px] overflow-hidden rounded-lg sm:min-h-[400px]">
            <iframe
              title="Localisation Teranga Park Villas à Nguerigne Peulh, route de Ngaparou"
              src={MAP_EMBED_URL}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
