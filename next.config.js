const path = require('path');

// Content-Security-Policy locked to the third parties this site actually uses:
// ImageKit (images + uploads) and Vercel Speed Insights (vitals beacon). Fonts
// are self-hosted by next/font (font-src 'self'). 'unsafe-inline' is needed for
// Next's inline bootstrap + framer-motion inline styles; 'unsafe-eval' is kept
// only because Next's dev HMR evals (production code does not eval). No Google /
// gstatic / Translate origins — that integration does not exist in this app.
// `frame-ancestors 'self'` mirrors X-Frame-Options for modern browsers.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://ik.imagekit.io",
  "font-src 'self' data:",
  "connect-src 'self' https://ik.imagekit.io https://upload.imagekit.io https://vitals.vercel-insights.com",
  "frame-src 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join('; ');

// Security headers applied to every response.
const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to THIS project. A stray lockfile in the home dir
  // (C:\Users\tamil\package-lock.json) made Next infer the wrong root.
  outputFileTracingRoot: path.join(__dirname),
  poweredByHeader: false,
  compress: true,
  // Tree-shake large icon/animation/chart libs so only used exports ship.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Quality values actually used across components (hero/gallery 75, blog 76, cards 70/72, migrated 90).
    qualities: [70, 72, 75, 76, 90],
    // Cache optimized variants at the edge for 1 year (the source asset is
    // content-addressed by ImageKit, so a long TTL is safe).
    minimumCacheTTL: 31536000,
    // 384 backs the doctor/team cards so they never pull a 640 candidate at DPR1.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      // Long-lived immutable cache for static media in /public (stable names).
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|gif|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  // Force a single canonical host: 301 www → apex (non-www). Prevents the
  // duplicate-content / split-PageRank flagged by the audits (www and non-www
  // both resolving). Apex is the canonical version used in metadataBase.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.crestophysio.com' }],
        destination: 'https://crestophysio.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
