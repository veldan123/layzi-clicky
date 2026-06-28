export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/store/AnimatedSection";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse all Layzi Clicky collections.",
};

export default async function CollectionsPage() {
  const collections = await db.collection.findMany({
    where: { active: true },
    include: { products: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <AnimatedSection className="mb-16 border-b border-[--color-border] pb-10">
        <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-3">Browse</p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1
            className="text-5xl md:text-6xl font-black text-[--color-foreground] leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Collections
          </h1>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-[--color-foreground] border border-[--color-border] px-6 py-3 hover:border-[--color-foreground] hover:bg-[--color-foreground] hover:text-white transition-colors self-start md:self-auto"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </AnimatedSection>

      {collections.length === 0 ? (
        <AnimatedSection className="text-center py-32 border border-[--color-border]">
          <h2 className="text-2xl font-black mb-3">Coming Soon</h2>
          <p className="text-[--color-muted-foreground] text-sm">Collections are being curated. Check back soon.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 mt-6 text-sm font-bold text-[--color-primary] hover:underline">
            Browse all products <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <StaggerItem key={col.id}>
              <Link href={`/collections/${col.slug}`} className="group block">
                <div className="relative aspect-square bg-[#E2E1DC] overflow-hidden mb-4">
                  <Image
                    src={col.heroImage || "/placeholder.svg"}
                    alt={col.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-4 right-4 bg-white text-[#111111] px-3 py-2 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                    View <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#111111] group-hover:text-[#FF3D00] transition-colors">
                    {col.name}
                  </h2>
                  {col.description && (
                    <p className="text-sm text-[#666660] mt-1 leading-relaxed line-clamp-2">{col.description}</p>
                  )}
                  <p className="text-xs font-bold text-[#A0A09A] mt-2 uppercase tracking-wider">
                    {col.products.length} {col.products.length === 1 ? "product" : "products"}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
