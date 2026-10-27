import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_URL, site } from "@/lib/site";
import "./globals.css";

// Self-hosted Space Grotesk + JetBrains Mono (latin, variable weight), served by next/font.
const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-latin-wght.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono-latin-wght.woff2",
  variable: "--font-jetbrains-mono",
  weight: "100 800",
  display: "swap",
});

const defaultTitle = `${site.name}: Backend & AI/ML engineer`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: defaultTitle, template: `%s · ${site.name}` },
  description: site.tagline,
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/rss.xml", title: `${site.journal.title} · ${site.name}` }] },
  },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    url: "/",
    title: defaultTitle,
    description: site.tagline,
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.tagline },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B0D10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh bg-canvas font-sans text-fg">
        <a
          href="#main"
          className="sr-only z-50 rounded-lg bg-accent px-4 py-3 font-mono text-sm font-medium text-canvas focus:not-sr-only focus:fixed focus:top-3 focus:left-3 hover:text-canvas"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
