import type { Metadata } from "next";
// DM Sans e IBM Plex Mono via @fontsource — ficheiros locais, sem fetch externo
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

// ─── Cabinet Grotesk — Fontshare (local) ────────────────────────────
// ⚠ Necessita dos ficheiros em public/fonts/cabinet-grotesk/
// Ver instruções em: public/fonts/cabinet-grotesk/README.md
// Enquanto não existirem, o site usa o fallback system-ui

// TODO: quando Cabinet Grotesk estiver em public/fonts/cabinet-grotesk/
// adicionar aqui o next/font/local e passar a variável para o <html>
// Ver instruções em: public/fonts/cabinet-grotesk/README.md

// ─── SEO Metadata ────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://rodrigoalarcao.pt"
  ),
  title: "Rodrigo Alarcão — Product Designer & Builder",
  description:
    "Projeto, estruturo e construo produtos digitais com AI — da ideia ao MVP em semanas.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rodrigo Alarcão — Product Designer & Builder",
    description:
      "Projeto, estruturo e construo produtos digitais com AI — da ideia ao MVP em semanas.",
    url: "https://rodrigoalarcao.pt",
    siteName: "Rodrigo Alarcão",
    locale: "pt_PT",
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
      "Projeto, estruturo e construo produtos digitais com AI — da ideia ao MVP em semanas.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // dark class: dark mode exclusivo (PRD secção 2.1)
    <html lang="pt" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
