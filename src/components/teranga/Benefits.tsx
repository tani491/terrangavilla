import { MapPin, ShieldCheck, Building2, TrendingUp } from "lucide-react";
import SectionTitle from "./SectionTitle";

const BENEFITS = [
  {
    icon: MapPin,
    title: "Emplacement stratégique",
    text: "Nguerigne Peulh, à proximité de Ngaparou et de la Petite Côte.",
  },
  {
    icon: ShieldCheck,
    title: "Résidence sécurisée",
    text: "Résidence privée avec gardiennage 24h/24.",
  },
  {
    icon: Building2,
    title: "Architecture contemporaine",
    text: "Villas modernes, lumineuses et conçues avec des prestations haut de gamme.",
  },
  {
    icon: TrendingUp,
    title: "Potentiel immobilier",
    text: "Un projet situé dans une zone en plein développement.",
  },
];

export default function Benefits() {
  return (
    <section id="projet" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Le projet"
          title="Un projet pensé pour vivre et investir"
          subtitle="Teranga Park Villas conjugue confort de vie quotidien et potentiel patrimonial, dans l'une des zones les plus dynamiques de la Petite Côte."
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="card-luxury group rounded-lg p-6 transition-all duration-300 hover:border-[rgba(214,168,74,0.45)] hover:shadow-[0_8px_40px_rgba(214,168,74,0.08)]"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md border border-[rgba(214,168,74,0.35)] bg-[rgba(214,168,74,0.08)]">
                <Icon className="h-5.5 w-5.5 text-[#D6A84A]" aria-hidden />
              </div>
              <h3 className="mb-2.5 font-display text-xl font-semibold text-[#F5F5F5]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[#A7A7A7]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
