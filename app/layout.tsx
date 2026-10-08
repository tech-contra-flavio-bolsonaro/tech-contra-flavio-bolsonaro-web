import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Vira Voto" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
