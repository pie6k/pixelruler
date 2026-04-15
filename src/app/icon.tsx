import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  const r = 112;
  const spacing = 170; // ~3x3 grid — reads well at 16px

  const lines = Array.from(
    { length: Math.ceil(512 / spacing) },
    (_, i) => (i + 1) * spacing
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          borderRadius: r,
          background: "linear-gradient(180deg, #68B7E8 0%, #4373B8 100%)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {lines.map((v) => (
          <div
            key={`v${v}`}
            style={{
              position: "absolute",
              left: v,
              top: 0,
              width: 6,
              height: 512,
              background: "rgba(255,255,255,0.7)",
            }}
          />
        ))}
        {lines.map((v) => (
          <div
            key={`h${v}`}
            style={{
              position: "absolute",
              top: v,
              left: 0,
              height: 6,
              width: 512,
              background: "rgba(255,255,255,0.7)",
            }}
          />
        ))}
      </div>
    ),
    { ...size }
  );
}
