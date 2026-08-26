import type { Metadata, Viewport } from "next";
import Analytics from "@/components/analytics/Analytics";
import { assetUrl, canonicalUrl, homeSeo, site } from "@/lib/seo";
import favicon from "./favicon.icon.webp";
import "../styles/globals.css";

const HOME_SOCIAL_IMAGE = assetUrl("/og/corsteno-og.webp");

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: homeSeo.title,
  description: homeSeo.description,
  icons: {
    icon: [{ url: favicon.src, type: "image/webp", sizes: "2000x2000" }],
  },
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    title: homeSeo.title,
    description: homeSeo.description,
    url: canonicalUrl("/"),
    siteName: site.name,
    locale: site.locale,
    type: "website",
    images: [{ url: HOME_SOCIAL_IMAGE, alt: "Experiencias web y 3D desarrolladas por Corsteno" }],
  },
  twitter: {
    card: "summary_large_image",
    title: homeSeo.title,
    description: homeSeo.description,
    images: [HOME_SOCIAL_IMAGE],
  },
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#f6f6f3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body>
        <a className="skip-link" href="#main-content">Saltar al contenido</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
