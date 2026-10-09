import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { SiteFooter } from "@/app/components/site-footer";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://techcontraflaviobolsonaro.dev/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Vira Voto",
  title: {
    default: "Vira Voto — ideias em movimento",
    template: "%s | Vira Voto",
  },
  description:
    "Um hub de ferramentas e conteúdos para colocar ideias em movimento e fortalecer a ação coletiva.",
  keywords: [
    "Vira Voto",
    "mobilização cívica",
    "ferramentas para ação",
    "conteúdos para mobilização",
    "política e participação",
  ],
  openGraph: {
    title: "Vira Voto",
    description:
      "Ferramentas e conteúdos para transformar ideias em ação coletiva.",
    url: siteUrl,
    siteName: "Vira Voto",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vira Voto",
    description:
      "Ferramentas e conteúdos para transformar ideias em ação coletiva.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${barlowCondensed.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Vira Voto" />
      </head>
      <body id="top" className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
