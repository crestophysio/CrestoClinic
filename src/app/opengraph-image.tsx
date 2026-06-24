import { ImageResponse } from "next/og";

// Dynamically generated 1200x630 social card. Replaces the missing static
// /hero-logo-desktop.jpg so link previews (WhatsApp, Facebook, X, Google,
// iMessage) render an on-brand image instead of a blank box. Satori only
// supports flexbox + inline styles — no grid, every multi-child div needs
// display:'flex'.

export const runtime = "edge";
export const alt = "Cresto Physiotherapy Clinic — Bengaluru";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TEAL = "#1B3A6B";
const TEAL_DARK = "#142d54";
const PINK = "#F0581E";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(135deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: logo mark + eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 999,
              background: "white",
              color: TEAL,
              fontSize: 46,
              fontWeight: 800,
            }}
          >
            C
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#9EB3D6",
            }}
          >
            Physiotherapy · Rehab · Sports Injury
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, lineHeight: 1.05 }}>
            Cresto Physiotherapy
          </div>
          <div style={{ display: "flex", fontSize: 104, fontWeight: 800, lineHeight: 1.05 }}>
            Clinic
          </div>
          {/* Pink accent bar */}
          <div style={{ display: "flex", width: 220, height: 12, background: PINK, borderRadius: 999, marginTop: 28 }} />
          <div style={{ display: "flex", fontSize: 30, color: "#C9D5EC", marginTop: 28, maxWidth: 900 }}>
            Expert manual therapy, neuro rehabilitation & sports injury care.
          </div>
        </div>

        {/* Bottom row: location + domain */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#9EB3D6" }}>
            Bannerghatta Road, Bengaluru
          </div>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, color: PINK }}>
            crestophysio.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
