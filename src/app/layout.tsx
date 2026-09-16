import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SITE_URL } from "@/lib/config";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Teranga Park Villas | Villas haut de gamme sur la Petite Côte",
  description:
    "Découvrez Teranga Park Villas, un projet immobilier haut de gamme situé à Nguerigne Peulh, à proximité de Ngaparou sur la Petite Côte du Sénégal.",
  keywords: [
    "Teranga Park Villas",
    "villa Sénégal",
    "Petite Côte",
    "Ngaparou",
    "Nguerigne Peulh",
    "immobilier Sénégal",
    "villa haut de gamme",
    "investissement immobilier Sénégal",
    "diaspora",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Teranga Park Villas | Villas haut de gamme sur la Petite Côte",
    description:
      "Découvrez Teranga Park Villas, un projet immobilier haut de gamme situé à Nguerigne Peulh, à proximité de Ngaparou sur la Petite Côte du Sénégal.",
    url: SITE_URL,
    siteName: "Teranga Park Villas",
    type: "website",
    locale: "fr_SN",
    images: [
      {
        url: "/images/hero-villa.png",
        width: 1440,
        height: 720,
        alt: "Villa contemporaine Teranga Park Villas avec piscine à la tombée du jour",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teranga Park Villas | Villas haut de gamme sur la Petite Côte",
    description:
      "Découvrez Teranga Park Villas, un projet immobilier haut de gamme situé à Nguerigne Peulh, à proximité de Ngaparou sur la Petite Côte du Sénégal.",
    images: ["/images/hero-villa.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  width: "device-width",
  initialScale: 1,
};

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased bg-background text-foreground font-sans`}
      >
        {children}
        <Toaster />

        {/* Meta Pixel — activé dès le départ pour le retargeting */}
        {META_PIXEL_ID ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');`}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              />
            </noscript>
          </>
        ) : null}

        {/* Google Analytics 4 */}
        {GA4_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
