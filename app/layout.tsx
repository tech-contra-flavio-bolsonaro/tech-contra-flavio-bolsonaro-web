import type { Metadata } from "next";
import { Barlow_Condensed, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { SiteFooter } from "@/app/components/site-footer";
import { siteOpenGraph } from "@/app/lib/page-metadata";
import { siteUrl } from "@/app/lib/site-url";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Tech Contra Bolsonaro",
  title: {
    default: "Tech Contra Bolsonaro — ideias em movimento",
    template: "%s | Tech Contra Bolsonaro",
  },
  description:
    "Um hub de ferramentas e conteúdos para colocar ideias em movimento e fortalecer a ação coletiva.",
  keywords: [
    "Tech Contra Bolsonaro",
    "mobilização cívica",
    "ferramentas para ação",
    "conteúdos para mobilização",
    "política e participação",
  ],
  openGraph: {
    title: "Tech Contra Bolsonaro",
    description:
      "Ferramentas e conteúdos para transformar ideias em ação coletiva.",
    ...siteOpenGraph,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Contra Bolsonaro",
    description:
      "Ferramentas e conteúdos para transformar ideias em ação coletiva.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${barlowCondensed.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Tech Contra Bolsonaro" />
      </head>
      <body id="top" className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
        <Toaster />
      </body>
    </html>
  );
}
