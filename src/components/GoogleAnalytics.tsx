import Script from "next/script";

// Google Analytics 4 (gtag.js). Only mounts when NEXT_PUBLIC_GA_ID is set, so
// it's a no-op locally and a one-line switch in production (set the env var to
// your GA4 Measurement ID, e.g. G-XXXXXXXXXX). Addresses the SEO audit's
// "no analytics tool detected" finding without adding an npm dependency.
export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
