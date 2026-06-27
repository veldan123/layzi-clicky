export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/store/AnimatedSection";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all Layzi Clicky 3D printed fidget clickers.",
};

export default async function ShopPage() {
  const products = await db.product.findMany({
    where: { active: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <AnimatedSection className="mb-16 border-b border-[--color-border] pb-10">
        <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-3">All Products</p>
        <h1
          className="text-5xl md:text-6xl font-black text-[--color-foreground] leading-none"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The Shop
        </h1>
        {products.length > 0 && (
          <p className="text-[--color-muted-foreground] mt-4 text-sm">
            {products.length} {products.length === 1 ? "product" : "products"} — handcrafted, limited runs
          </p>
        )}
      </AnimatedSection>

      {products.length === 0 ? (
        <AnimatedSection className="text-center py-32 border border-[--color-border]">
          <h2 className="text-2xl font-black mb-3">Coming Soon</h2>
          <p className="text-[--color-muted-foreground] text-sm">
            New products are on the printer. Check back soon.
          </p>
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
    </div>
  );
}
