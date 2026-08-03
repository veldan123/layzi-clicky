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
    default: "Layzi Clicky — 3D Printed Fidget Clickers Made in Singapore",
    template: "%s | Layzi Clicky",
  },
  description:
    "Handcrafted 3D printed fidget clickers made fresh in Singapore. Cute, satisfying, and pocket-sized. Shop the Dim Sum collection and more — free shipping on orders over $50.",
  keywords: [
    "fidget clicker", "3D printed fidget toy", "fidget clicker Singapore",
    "cute fidget toy", "handmade fidget", "dim sum clicker", "satisfying clicker",
    "3D printed toy Singapore", "fidget toy Singapore", "layzi clicky",
  ],
  metadataBase: new URL("https://layziclicky.com"),
  alternates: { canonical: "https://layziclicky.com" },
  openGraph: {
    siteName: "Layzi Clicky",
    type: "website",
    url: "https://layziclicky.com",
    title: "Layzi Clicky — 3D Printed Fidget Clickers Made in Singapore",
    description: "Handcrafted 3D printed fidget clickers made fresh in Singapore. Cute, satisfying, and pocket-sized.",
    locale: "en_SG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Layzi Clicky — 3D Printed Fidget Clickers",
    description: "Handcrafted 3D printed fidget clickers made in Singapore. Shop the Dim Sum collection.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#F8F7F3] text-[--color-foreground]">
        {children}
      </body>
    </html>
  );
}
