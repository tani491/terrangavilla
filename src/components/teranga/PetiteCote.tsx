import {
  Construction,
  Plane,
  Umbrella,
  KeyRound,
  MapPinned,
} from "lucide-react";
import SectionTitle from "./SectionTitle";

const POINTS = [
  {
    icon: Construction,
    title: "Développement résidentiel",
    text: "La Petite Côte connaît une croissance continue de ses programmes résidentiels, portée par une demande locale et internationale.",
  },
  {
    icon: Plane,
    title: "Proximité de Dakar",
    text: "À quelques heures de la capitale et reliée aux grands axes, la zone attire aussi bien les résidents que les visiteurs.",
  },
  {
    icon: Umbrella,
    title: "Attractivité touristique",
    text: "Plages, lagunes et stations balnéaires font de la Petite Côte l'une des destinations les plus prisées du Sénégal.",
  },
  {
    icon: KeyRound,
    title: "Demande en résidences secondaires",
    text: "La demande de villas de vacances progresse, portée par les familles résidentes et la diaspora.",
  },
];

export default function PetiteCote() {
  return (
    <section className="relative bg-[#0E0D0B] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="La zone"
          title="Pourquoi la Petite Côte attire autant de projets immobiliers ?"
          subtitle="Un territoire en plein essor, où résider devient aussi un choix patrimonial. Un aperçu qualitatif des dynamiques de la zone."
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="card-luxury rounded-lg p-6 transition-colors duration-300 hover:border-[rgba(214,168,74,0.45)] sm:p-7"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-md border border-[rgba(214,168,74,0.35)] bg-[rgba(214,168,74,0.08)]">
                <Icon className="h-5 w-5 text-[#D6A84A]" aria-hidden />
              </div>
              <h3 className="mb-2 font-display text-xl font-semibold text-[#F5F5F5]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[#A7A7A7]">{text}</p>
            </article>
          ))}
        </div>

        <div className="card-luxury mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 rounded-lg p-6 text-center sm:flex-row sm:text-left">
          <MapPinned className="h-8 w-8 shrink-0 text-[#D6A84A]" aria-hidden />
          <p className="text-sm leading-relaxed text-[#A7A7A7]">
            Des pôles comme{" "}
            <span className="font-semibold text-[#F5F5F5]">
              Saly, Ngaparou, Somone et Nguerigne
            </span>{" "}
            se développent continûment : commerces, restaurants, écoles et
            services renforcent l'attractivité résidentielle de ces zones année
            après année.
          </p>
        </div>
      </div>
    </section>
  );
}
