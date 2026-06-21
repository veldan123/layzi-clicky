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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatedSection className="mb-12">
        <h1 className="text-5xl font-black text-[--color-foreground] mb-3">
          The Shop 🛍️
        </h1>
        <p className="text-[--color-muted-foreground] text-lg">
          {products.length === 0
            ? "New products dropping soon — stay tuned!"
            : `${products.length} ${products.length === 1 ? "product" : "products"} handcrafted with love`}
        </p>
      </AnimatedSection>

      {products.length === 0 ? (
        <AnimatedSection className="text-center py-24">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-2xl font-black mb-3">Coming Soon!</h2>
          <p className="text-[--color-muted-foreground]">
            We&apos;re printing something special. Check back soon!
          </p>
        </AnimatedSection>
      ) : (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
