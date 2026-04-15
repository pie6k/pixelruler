import type { Metadata } from "next";
import { StyledComponentsRegistry } from "./registry";

export const metadata: Metadata = {
  title: "Pixel Ruler — Online Screen Ruler & Grid Overlay",
  description:
    "Free online pixel ruler and screen grid overlay. Measure spacing, align elements, and visualize pixel grids directly in your browser.",
  keywords: [
    "pixel ruler",
    "pixel ruler online",
    "screen ruler",
    "screen ruler online",
    "pixel grid",
    "grid overlay",
    "screen grid",
    "measure pixels",
    "web ruler",
    "css grid tool",
  ],
  metadataBase: new URL("https://pixelruler.dev"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pixel Ruler — Online Screen Ruler & Grid Overlay",
    description:
      "Free online pixel ruler and screen grid overlay. Measure spacing, align elements, and visualize pixel grids directly in your browser.",
    url: "https://pixelruler.dev",
    siteName: "pixelruler",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Ruler — Online Screen Ruler & Grid Overlay",
    description:
      "Free online pixel ruler and screen grid overlay. Measure spacing and visualize pixel grids in your browser.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
