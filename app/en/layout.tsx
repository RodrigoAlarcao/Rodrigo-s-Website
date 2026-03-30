import type { Metadata } from "next";
import localFont from "next/font/local";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/ibm-plex-mono/400.css";
import "../globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import HeroPreload from "@/components/HeroPreload";

const cabinetGrotesk = localFont({
  src: [
    { path: "../../public/fonts/cabinet-grotesk/CabinetGrotesk-Regular.woff2",    weight: "400", style: "normal" },
    { path: "../../public/fonts/cabinet-grotesk/CabinetGrotesk-Medium.woff2",     weight: "500", style: "normal" },
    { path: "../../public/fonts/cabinet-grotesk/CabinetGrotesk-Bold.woff2",       weight: "700", style: "normal" },
    { path: "../../public/fonts/cabinet-grotesk/CabinetGrotesk-Extrabold.woff2",  weight: "800", style: "normal" },
    { path: "../../public/fonts/cabinet-grotesk/CabinetGrotesk-Black.woff2",      weight: "900", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rodrigoalarcao.pt"
  ),
  title: "Rodrigo Alarcão — Product Designer & Builder",
  description:
    "I design, structure and build digital products with AI — from idea to MVP in weeks.",
  alternates: {
    canonical: "/en",
  },
  openGraph: {
    title: "Rodrigo Alarcão — Product Designer & Builder",
    description:
      "I design, structure and build digital products with AI — from idea to MVP in weeks.",
    url: "https://rodrigoalarcao.pt/en",
    siteName: "Rodrigo Alarcão",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rodrigo Alarcão — Product Designer & Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rodrigo Alarcão — Product Designer & Builder",
    description:
      "I design, structure and build digital products with AI — from idea to MVP in weeks.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${cabinetGrotesk.variable}`}>
      <body className="antialiased">
        <HeroPreload />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
