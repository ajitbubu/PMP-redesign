import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0d3a63 0%, #092339 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#1a77f2",
              display: "flex",
            }}
          />
          <span style={{ fontSize: 30, fontWeight: 700 }}>ID-PRIVACY®</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>
            Privacy Management Portal
          </span>
          <span style={{ fontSize: 30, color: "#9dc3f5" }}>
            Consent · Preferences · Data Rights · PIA — powered by DataSafeguard
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
