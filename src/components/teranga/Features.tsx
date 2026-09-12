import {
  LandPlot,
  BedDouble,
  Waves,
  Building,
  Ruler,
  ChefHat,
  Car,
  Lock,
  Dumbbell,
} from "lucide-react";
import SectionTitle from "./SectionTitle";

const FEATURES = [
  { icon: LandPlot, label: "Terrain", value: "300 m²" },
  { icon: BedDouble, label: "Chambres", value: "5 chambres" },
  { icon: Waves, label: "Piscine", value: "Piscine privée" },
  { icon: Building, label: "Suite parentale", value: "Avec balcon" },
  { icon: Ruler, label: "Hauteur sous plafond", value: "Jusqu'à 3,60 m" },
  {
    icon: ChefHat,
    label: "Cuisine",
    value: "Équipée avec îlot central",
  },
  { icon: Car, label: "Stationnement", value: "Parking privatif" },
  { icon: Lock, label: "Résidence", value: "Privée et sécurisée" },
  {
    icon: Dumbbell,
    label: "Salle de sport",
    value: "Réservée aux résidents",
  },
];

export default function Features() {
  return (
    <section id="caracteristiques" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Caractéristiques"
          title="Une villa pensée dans les moindres détails"
          subtitle="Chaque espace a été conçu pour allier confort quotidien, luminosité et prestations haut de gamme."
        />

        <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="card-luxury rounded-lg p-5 transition-colors duration-300 hover:border-[rgba(214,168,74,0.45)] sm:p-6"
            >
              <dt className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#A7A7A7]">
                <Icon className="h-4.5 w-4.5 shrink-0 text-[#D6A84A]" aria-hidden />
                {label}
              </dt>
              <dd className="mt-3 font-display text-xl font-semibold text-[#F5F5F5] sm:text-2xl">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
