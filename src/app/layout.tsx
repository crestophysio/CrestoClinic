import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { unstable_cache } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";
import { KEYWORDS } from "@/lib/seo";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  // 300 dropped — no `font-light` usage in the app. Fewer weights = fewer files.
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  // Space Grotesk only ships 300–700; 800 (font-extrabold) is synthesised by the
  // browser. next/font's adjustFontFallback keeps the metric delta small.
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://crestophysio.com").replace(/\/+$/, "");
const siteTitle = "Cresto Physiotherapy Clinic";
// Homepage <title> — top commercial + local terms, kept under ~50 chars so it
// never truncates in the SERP (from the local SEO keyword pack).
const homeTitle = "Best Physiotherapy in Bengaluru | Cresto Clinic";
const siteDescription =
  "Expert physiotherapy in Bengaluru. Cresto Physiotherapy Clinic on Bannerghatta Road offers pain relief, rehab & sports therapy. Book your visit today!";
// Question-led variant — higher click-through on social shares.
const siteSocialDescription =
  "Looking for a physiotherapist in Bengaluru? Cresto Physiotherapy Clinic on Bannerghatta Road offers expert manual therapy, neuro rehab, sports injury treatment, post-surgical recovery, and posture care. Book your consultation today.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: homeTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  applicationName: siteTitle,
  // Composed from the keyword pack: brand/local + top conditions + "near me" +
  // commercial intent. De-duped so repeated terms across groups appear once.
  keywords: Array.from(
    new Set([
      ...KEYWORDS.brandLocal,
      ...KEYWORDS.conditions.slice(0, 10),
      ...KEYWORDS.local.slice(0, 8),
      ...KEYWORDS.commercial.slice(0, 6),
    ])
  ),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: siteTitle,
    description: siteSocialDescription,
    siteName: siteTitle,
    images: [
      {
        url: "/hero-logo-desktop.jpg",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteSocialDescription,
    images: ["/hero-logo-desktop.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, email: true, address: true },
};

const getLayoutSettings = unstable_cache(
  async () => {
    try {
      await connectToDatabase();
      return await ClinicSettings.findOne()
        .select("clinicName logo favicon phone whatsapp email address workingHours facebook instagram youtube linkedin createdAt updatedAt")
        .lean();
    } catch (err) {
      console.error("Layout settings load err:", err);
      return null;
    }
  },
  ["public-layout-settings"],
  // Tagged so an admin settings save can bust this immediately via
  // revalidateTag(); without the tag, revalidatePath() leaves this
  // unstable_cache entry stale (footer/navbar show old info until the 300s TTL).
  { revalidate: 300, tags: ["public-layout-settings"] }
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings: any = await getLayoutSettings();
  // Favicon: prefer an explicit favicon, else reuse the header logo, else the
  // static fallback. Keeps the tab icon in sync with the brand logo by default.
  const faviconUrl = settings?.favicon || settings?.logo || "/favicon.ico";
  const serializedSettings = settings ? JSON.parse(JSON.stringify(settings)) : null;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href={faviconUrl} />
      </head>
      <body className={`${outfit.variable} ${spaceGrotesk.variable} antialiased`}>
        <Providers>
          <PublicLayoutWrapper settings={serializedSettings}>
            {children}
          </PublicLayoutWrapper>
          {/* Vercel injects /_vercel/speed-insights/script.js only on Vercel.
              Off-Vercel (local dev, self-host) that route 404s and the client
              logs a "Failed to load script" error — so only mount on Vercel. */}
          {process.env.VERCEL && <SpeedInsights />}
        </Providers>
      </body>
    </html>
  );
}
