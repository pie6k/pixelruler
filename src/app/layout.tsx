import type { Metadata } from "next";
import { StyledComponentsRegistry } from "./registry";

export const metadata: Metadata = {
  title: "pixelruler",
  description: "Visual pixel ruler grid overlay",
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
