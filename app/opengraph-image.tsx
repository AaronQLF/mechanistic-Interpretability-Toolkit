import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mech Interp Toolkit — interactive math for mechanistic interpretability";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#fafaf5",
          padding: "72px",
          justifyContent: "space-between",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#b45309",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#b45309",
            }}
          />
          MECH INTERP TOOLKIT
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#1f1f23",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Look inside the
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: "#b45309",
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            neural network.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#52525b",
            fontSize: 24,
          }}
        >
          <div>An interactive textbook — starting with linear algebra.</div>
          <div style={{ fontFamily: "monospace" }}>v0.1</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
