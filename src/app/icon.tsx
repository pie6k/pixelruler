import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  const r = 112; // corner radius (~22% of 512, matches iOS)
  const spacing = 64;
  const subSpacing = spacing / 4;

  const mainLines = Array.from(
    { length: Math.ceil(512 / spacing) + 1 },
    (_, i) => i * spacing
  );
  const subLines = Array.from(
    { length: Math.ceil(512 / subSpacing) + 1 },
    (_, i) => i * subSpacing
  ).filter((v) => v % spacing !== 0);

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
        {/* Sub-lines */}
        {subLines.map((v) => (
          <div
            key={`sv${v}`}
            style={{
              position: "absolute",
              left: v,
              top: 0,
              width: 1,
              height: 512,
              background: "rgba(255,255,255,0.3)",
            }}
          />
        ))}
        {subLines.map((v) => (
          <div
            key={`sh${v}`}
            style={{
              position: "absolute",
              top: v,
              left: 0,
              height: 1,
              width: 512,
              background: "rgba(255,255,255,0.3)",
            }}
          />
        ))}

        {/* Main lines */}
        {mainLines.map((v) => (
          <div
            key={`mv${v}`}
            style={{
              position: "absolute",
              left: v,
              top: 0,
              width: 2,
              height: 512,
              background: "rgba(255,255,255,0.7)",
            }}
          />
        ))}
        {mainLines.map((v) => (
          <div
            key={`mh${v}`}
            style={{
              position: "absolute",
              top: v,
              left: 0,
              height: 2,
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
