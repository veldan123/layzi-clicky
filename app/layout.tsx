import type { Metadata } from "next";
import { Nunito, Space_Grotesk } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Layzi Clicky — Cute 3D Printed Fidget Clickers",
    template: "%s | Layzi Clicky",
  },
  description:
    "Handcrafted 3D printed fidget clickers designed to be irresistibly cute and satisfying. Shop Layzi Clicky's collection of premium fidget toys.",
  keywords: ["fidget clicker", "3D printed", "fidget toy", "cute", "handmade"],
  openGraph: {
    siteName: "Layzi Clicky",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[--color-background] text-[--color-foreground]">
        {children}
      </body>
    </html>
  );
}
