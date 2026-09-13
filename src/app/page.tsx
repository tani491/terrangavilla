import Navbar from "@/components/teranga/Navbar";
import Hero from "@/components/teranga/Hero";
import Benefits from "@/components/teranga/Benefits";
import Gallery from "@/components/teranga/Gallery";
import Features from "@/components/teranga/Features";
import Location from "@/components/teranga/Location";
import InvestorProfiles from "@/components/teranga/InvestorProfiles";
import Pricing from "@/components/teranga/Pricing";
import PetiteCote from "@/components/teranga/PetiteCote";
import Diaspora from "@/components/teranga/Diaspora";
import VideoVisit from "@/components/teranga/VideoVisit";
import LeadForm from "@/components/teranga/LeadForm";
import FAQ from "@/components/teranga/FAQ";
import CTA from "@/components/teranga/CTA";
import Footer from "@/components/teranga/Footer";
import WhatsAppButton from "@/components/teranga/WhatsAppButton";
import DossierModal from "@/components/teranga/DossierModal";
import TrackingInit from "@/components/teranga/TrackingInit";

import { getSiteSettings } from "@/lib/site-settings";
import { SITE } from "@/lib/config";

// Revalidation ISR : site_setting est relu au maximum toutes les 60 secondes,
// et React cache déduplique l'appel dans un même rendu (une seule requête Supabase).
export const revalidate = 60;

/**
 * Landing page Teranga Park Villas
 * Tunnel de conversion : HERO → INTÉRÊT → GALERIE → CARACTÉRISTIQUES
 * → PRIX → CONFIANCE → FORMULAIRE → WHATSAPP → VISITE → VENTE
 *
 * Les contenus modifiables (images, prix, WhatsApp, PDF, textes clés) proviennent
 * de la table Supabase `site_setting` via getSiteSettings() — avec valeurs par
 * défaut si Supabase n'est pas configuré ou indisponible.
 */
export default async function Home() {
  const settings = await getSiteSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: SITE.name,
    description:
      "Villas haut de gamme à Nguerigne Peulh, à proximité de Ngaparou — résidence privée, moderne et sécurisée. 5 chambres, piscine privée, 300 m² de terrain.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nguerigne Peulh",
      addressRegion: "Thiès",
      addressCountry: "SN",
    },
    offers: {
      "@type": "Offer",
      price: settings.price.replace(/[^0-9]/g, ""),
      priceCurrency: "XOF",
      availability: "https://schema.org/LimitedAvailability",
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0B0B0B] text-[#F5F5F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackingInit />
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO — première impression : produit, lieu, prix, action */}
        <Hero
          heroImageUrl={settings.heroImageUrl}
          heroTitle={settings.heroTitle}
          heroSubtitle={settings.heroSubtitle}
          price={settings.price}
          whatsappNumber={settings.whatsappNumber}
        />

        {/* 2. INTÉRÊT — pourquoi ce projet */}
        <Benefits />

        {/* 3. GALERIE — vendre le rêve (images dynamiques) */}
        <Gallery images={settings.galleryImages} />

        {/* 4. CARACTÉRISTIQUES — lisibilité premium */}
        <Features />

        {/* 5. LOCALISATION — cœur de la Petite Côte */}
        <Location />

        {/* 6. PROFILS — "c'est exactement mon cas" */}
        <InvestorProfiles />

        {/* 7. PRIX — transparence, 2e point de conversion (prix dynamique) */}
        <Pricing price={settings.price} availabilityText={settings.availabilityText} />

        {/* 8. CONFIANCE — la Petite Côte, zone attractive (qualitatif) */}
        <PetiteCote />

        {/* 9. DIASPORA — connexion immédiate avec l'étranger */}
        <Diaspora />

        {/* 10. VISITE VIDÉO — visiter sans se déplacer */}
        <VideoVisit />

        {/* 11. FORMULAIRE — cœur commercial (qualification complète) */}
        <LeadForm />

        {/* 12. FAQ — lever les objections */}
        <FAQ whatsappNumber={settings.whatsappNumber} />

        {/* 13. CTA FINAL — finir par une vraie décision */}
        <CTA whatsappNumber={settings.whatsappNumber} />
      </main>

      <Footer whatsappNumber={settings.whatsappNumber} />
      <WhatsAppButton whatsappNumber={settings.whatsappNumber} />

      {/* Modale "Recevoir le dossier" : 3 champs → lead → PDF immédiat */}
      <DossierModal
        pdfUrl={settings.pdfUrl}
        whatsappNumber={settings.whatsappNumber}
      />
    </div>
  );
}
