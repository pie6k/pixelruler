import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Pixel Ruler — Online Screen Ruler & Grid Overlay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  const spacing = 60;
  const subSpacing = spacing / 4;

  const mainLinesV = Array.from(
    { length: Math.ceil(size.width / spacing) + 1 },
    (_, i) => i * spacing
  );
  const mainLinesH = Array.from(
    { length: Math.ceil(size.height / spacing) + 1 },
    (_, i) => i * spacing
  );
  const subLinesV = Array.from(
    { length: Math.ceil(size.width / subSpacing) + 1 },
    (_, i) => i * subSpacing
  ).filter((x) => x % spacing !== 0);
  const subLinesH = Array.from(
    { length: Math.ceil(size.height / subSpacing) + 1 },
    (_, i) => i * subSpacing
  ).filter((y) => y % spacing !== 0);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(180deg, #68B7E8 0%, #4373B8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Sub-lines */}
        {subLinesV.map((x) => (
          <div
            key={`sv${x}`}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 1,
              height: "100%",
              background: "rgba(255,255,255,0.25)",
            }}
          />
        ))}
        {subLinesH.map((y) => (
          <div
            key={`sh${y}`}
            style={{
              position: "absolute",
              top: y,
              left: 0,
              height: 1,
              width: "100%",
              background: "rgba(255,255,255,0.25)",
            }}
          />
        ))}

        {/* Main lines */}
        {mainLinesV.map((x) => (
          <div
            key={`mv${x}`}
            style={{
              position: "absolute",
              left: x,
              top: 0,
              width: 1,
              height: "100%",
              background: "rgba(255,255,255,0.6)",
            }}
          />
        ))}
        {mainLinesH.map((y) => (
          <div
            key={`mh${y}`}
            style={{
              position: "absolute",
              top: y,
              left: 0,
              height: 1,
              width: "100%",
              background: "rgba(255,255,255,0.6)",
            }}
          />
        ))}

      </div>
    ),
    { ...size }
  );
}
