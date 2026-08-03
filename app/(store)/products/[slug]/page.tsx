export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetail } from "@/components/store/ProductDetail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: `${product.name} — 3D Printed Fidget Clicker Made in Singapore`,
    description: `${product.description.slice(0, 110)} Handcrafted in Singapore using premium PLA+ filament. Tactile, satisfying, pocket-sized.`,
    openGraph: {
      title: `${product.name} | Layzi Clicky`,
      description: product.description.slice(0, 155),
      images: product.images[0] ? [{ url: product.images[0], alt: `${product.name} — 3D printed fidget clicker by Layzi Clicky Singapore` }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, active: true },
    include: { variants: true },
  });

  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Layzi Clicky" },
    material: "Premium PLA+ Filament",
    countryOfOrigin: "SG",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "SGD",
      availability: "https://schema.org/InStock",
      url: `https://layziclicky.com/products/${product.slug}`,
      seller: { "@type": "Organization", name: "Layzi Clicky" },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} />
    </>
  );
}
