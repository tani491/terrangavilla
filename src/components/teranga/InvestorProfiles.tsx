import { Home, Palmtree, LineChart } from "lucide-react";
import SectionTitle from "./SectionTitle";

const PROFILES = [
  {
    icon: Home,
    title: "Résidence principale",
    text: "Pour les familles qui souhaitent vivre dans un environnement moderne, sécurisé et calme.",
  },
  {
    icon: Palmtree,
    title: "Résidence secondaire",
    text: "Pour profiter de la Petite Côte lors des séjours, vacances et retours au Sénégal.",
  },
  {
    icon: LineChart,
    title: "Investissement immobilier",
    text: "Pour les investisseurs souhaitant acquérir un bien haut de gamme dans une zone en développement.",
  },
];

export default function InvestorProfiles() {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Pour qui ?"
          title="Un projet adapté à plusieurs profils"
          subtitle="Résider, profiter ou investir : Teranga Park Villas répond à trois projets de vie distincts."
        />

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {PROFILES.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="card-luxury group relative overflow-hidden rounded-lg p-7 transition-all duration-300 hover:border-[rgba(214,168,74,0.5)] hover:shadow-[0_8px_40px_rgba(214,168,74,0.1)] sm:p-8"
            >
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[rgba(214,168,74,0.06)] blur-2xl"
                aria-hidden
              />
              <div className="mb-6 inline-flex h-13 w-13 items-center justify-center rounded-full border border-[rgba(214,168,74,0.35)] bg-[rgba(214,168,74,0.08)] p-3">
                <Icon className="h-6 w-6 text-[#D6A84A]" aria-hidden />
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#F5F5F5]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#A7A7A7] sm:text-base">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
