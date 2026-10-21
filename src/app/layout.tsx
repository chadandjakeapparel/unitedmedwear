import type { Metadata, Viewport } from "next";
import {
  Dancing_Script,
  Hanken_Grotesk,
  Instrument_Serif,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const script = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://unitedmedwear.com",
  ),
  title: "United Medwear | Custom Lab Coats & Scrubs for Medical Teams",
  description:
    "Custom embroidered lab coats, scrubs and outfitting programs for physician practices, hospitals, health systems and university medical programs.",
  openGraph: {
    type: "website",
    siteName: "United Medwear",
    title: "United Medwear | Every coat carries a name",
    description:
      "Custom embroidered lab coats, scrubs and outfitting programs for practices, hospitals and medical schools.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f1d2e",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${sans.variable} ${serif.variable} ${mono.variable} ${script.variable}`}
      data-scroll-behavior="smooth"
      lang="en"
    >
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
