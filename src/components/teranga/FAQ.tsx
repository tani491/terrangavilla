import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SectionTitle from "./SectionTitle";
import { buildWhatsAppLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/config";

const FAQ_ITEMS = [
  {
    question: "Où se situe exactement Teranga Park Villas ?",
    answer:
      "Teranga Park Villas est situé à Nguerigne Peulh, sur la route de Ngaparou, sur la Petite Côte au Sénégal. La résidence se trouve dans une zone résidentielle en développement, à proximité de la lagune et des plages de la côte.",
  },
  {
    question: "Quel est le prix d'une villa ?",
    answer:
      "Le prix de lancement démarre à 157 200 000 FCFA pour les premières villas disponibles. Les conditions et modalités de paiement sont communiquées sur demande auprès de notre équipe commerciale, car elles peuvent évoluer selon les disponibilités.",
  },
  {
    question: "Quelle est la superficie du terrain ?",
    answer:
      "Chaque villa est construite sur un terrain de 300 m², avec des espaces extérieurs aménagés et une piscine privée.",
  },
  {
    question: "Combien de chambres possède la villa ?",
    answer:
      "La villa comprend 5 chambres, dont une suite parentale avec balcon. Les espaces de vie sont pensés pour le confort familial : hauteur sous plafond allant jusqu'à 3,60 m et cuisine équipée avec îlot central.",
  },
  {
    question: "La résidence est-elle sécurisée ?",
    answer:
      "Oui. Teranga Park Villas est une résidence privée fermée avec gardiennage 24h/24, afin de garantir la tranquillité des résidents, qu'ils vivent sur place ou à distance.",
  },
  {
    question: "Peut-on organiser une visite ?",
    answer:
      "Bien sûr. Notre équipe organise des visites privées sur rendez-vous, selon vos disponibilités. Vous pouvez demander une visite physique via le formulaire de la page ou directement sur WhatsApp.",
  },
  {
    question: "Je vis à l'étranger, puis-je visiter à distance ?",
    answer:
      "Oui. Nous proposons des visites vidéo personnalisées en direct avec notre équipe, idéales pour découvrir les espaces, les finitions et l'environnement avant votre déplacement au Sénégal. Les clients de la diaspora (France, Italie, Belgique, Espagne, Canada, États-Unis et ailleurs) sont accompagnés à chaque étape.",
  },
  {
    question: "Quelles sont les modalités de paiement ?",
    answer:
      "Les modalités de paiement (échéancier, conditions, options) sont communiquées sur demande et peuvent être adaptées selon les villas disponibles. Contactez notre équipe commerciale via le formulaire ou WhatsApp pour recevoir les conditions à jour.",
  },
  {
    question: "Quels documents sont disponibles concernant le projet ?",
    answer:
      "Un dossier complet du projet (plans, descriptif, informations administratives validées par le promoteur) est transmis sur demande aux prospects sérieux. Notre équipe vous accompagne pour toutes les questions juridiques et administratives.",
  },
];

interface FAQProps {
  whatsappNumber: string;
}

export default function FAQ({ whatsappNumber }: FAQProps) {
  return (
    <section id="faq" className="relative bg-[#0E0D0B] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="FAQ"
          title="Questions fréquentes"
          subtitle="Les réponses aux questions les plus posées sur Teranga Park Villas."
        />

        <Accordion type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-[rgba(214,168,74,0.16)]"
            >
              <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold text-[#F5F5F5] hover:text-[#D6A84A] hover:no-underline sm:text-xl [&[data-state=open]>svg]:text-[#D6A84A]">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm leading-relaxed text-[#A7A7A7] sm:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-8 text-center text-sm text-[#A7A7A7]">
          Une autre question ?{" "}
          <a
            href={buildWhatsAppLink(whatsappNumber, DEFAULT_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#D6A84A] underline-offset-4 hover:underline"
          >
            Posez-la sur WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
