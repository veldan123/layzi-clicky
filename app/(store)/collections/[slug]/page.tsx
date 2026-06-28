export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/store/AnimatedSection";
import { ArrowRight, ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await db.collection.findUnique({ where: { slug, active: true } });
  if (!collection) return { title: "Not Found" };
  return { title: collection.name, description: collection.description ?? undefined };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const collection = await db.collection.findUnique({
    where: { slug, active: true },
    include: {
      products: {
        include: { product: { include: { variants: true } } },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!collection) notFound();

  const products = collection.products
    .map(cp => cp.product)
    .filter(p => p.active);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      {/* Header */}
      <AnimatedSection className="mb-16 border-b border-[--color-border] pb-10">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[--color-muted-foreground] uppercase tracking-wider hover:text-[--color-primary] transition-colors mb-6"
        >
          <ArrowLeft className="w-3 h-3" /> All Collections
        </Link>
        <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-3">Collection</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1
              className="text-5xl md:text-6xl font-black text-[--color-foreground] leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {collection.name}
            </h1>
            {collection.description && (
              <p className="text-[--color-muted-foreground] mt-4 text-base max-w-xl leading-relaxed">
                {collection.description}
              </p>
            )}
          </div>
          {products.length > 0 && (
            <p className="text-sm text-[--color-muted-foreground] flex-shrink-0">
              {products.length} {products.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>
      </AnimatedSection>

      {/* Products */}
      {products.length === 0 ? (
        <AnimatedSection className="text-center py-32 border border-[--color-border]">
          <h2 className="text-2xl font-black mb-3">Coming Soon</h2>
          <p className="text-[--color-muted-foreground] text-sm">Products for this collection are on the printer.</p>
        </AnimatedSection>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                image={product.images[0] ?? "/placeholder.svg"}
                variantCount={product.variants.length}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* Footer CTA — view other collections */}
      <AnimatedSection className="mt-24 pt-16 border-t border-[--color-border] text-center">
        <p className="text-xs font-bold tracking-[0.25em] text-[--color-muted-foreground] uppercase mb-4">Explore More</p>
        <h2 className="text-3xl font-black text-[--color-foreground] mb-6" style={{ fontFamily: "var(--font-display)" }}>
          See what else we make
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-4 font-bold text-sm tracking-wide uppercase hover:bg-[#FF3D00] transition-colors"
          >
            View Other Collections
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 border border-[--color-border] text-[--color-foreground] px-8 py-4 font-bold text-sm tracking-wide uppercase hover:border-[--color-foreground] transition-colors"
          >
            All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
