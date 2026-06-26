import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const SITE = "https://martinclay21-boop.github.io/clay-portfolio";
const TITLE = "Clay Martin, UX & Product Designer";
const DESCRIPTION =
  "Portfolio of Clay Martin, a UX and product designer who starts with the root need and solves the rest like a puzzle: research, iteration, and care for the details.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE}/`),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/`,
    siteName: "Clay Martin",
    type: "website",
    images: [
      { url: `${SITE}/images/og.png`, width: 1200, height: 630, alt: TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE}/images/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-geist-sans)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-[200] focus:top-3 focus:left-3 focus:bg-slate-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
