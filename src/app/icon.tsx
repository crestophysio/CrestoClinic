import { ImageResponse } from "next/og";

// Generated favicon — replaces the missing /favicon.ico fallback. A white "C"
// on the brand teal disc, matching the navbar logo fallback. Used only when the
// admin hasn't set a custom favicon in Settings (layout.tsx prefers that).

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B3A6B",
          borderRadius: 7,
          color: "white",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        C
      </div>
    ),
    { ...size }
  );
}
