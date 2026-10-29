import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Atelier Nova — Objects of desire",
    template: "%s | Atelier Nova",
  },
  description:
    "Thoughtfully curated furniture and objects for elevated everyday living.",
  openGraph: {
    title: "Atelier Nova",
    description: "Designed to live beautifully.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
