import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import PublicLayoutWrapper from "@/components/PublicLayoutWrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { unstable_cache } from "next/cache";
import { connectToDatabase } from "@/lib/db";
import ClinicSettings from "@/models/ClinicSettings";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://crestophysio.com").replace(/\/+$/, "");
const siteTitle = "Cresto Physiotherapy Clinic";
// Homepage <title> — leads with top commercial + local keywords.
const homeTitle =
  "Physiotherapy in Bengaluru | Cresto Physiotherapy Clinic – Bannerghatta Road";
const siteDescription =
  "Expert physiotherapy, manual therapy, neurological rehabilitation, and sports injury treatment in Bengaluru. Book your appointment at Cresto Physiotherapy Clinic on Bannerghatta Road.";
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
  keywords: [
    "Cresto Physiotherapy Bengaluru",
    "physiotherapist in Bengaluru",
    "physiotherapy Bannerghatta Road",
    "manual therapy Bengaluru",
    "neurological rehabilitation Bengaluru",
    "sports injury treatment Bengaluru",
    "post-surgical rehab Bengaluru",
    "electrotherapy Bengaluru",
    "back pain treatment Bengaluru",
    "neck pain physiotherapy Bengaluru",
    "stroke rehabilitation Bengaluru",
    "Parkinson physiotherapy Bengaluru",
    "physiotherapy near me Bengaluru",
    "ACL rehab Bengaluru",
    "knee replacement rehab Bengaluru",
    "posture correction Bengaluru",
    "Cresto physio Doddakammanahalli",
    "physio Begur Hobli",
    "physiotherapy clinic Bengaluru",
  ],
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
  const faviconUrl = settings?.favicon || "/favicon.ico";
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
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
