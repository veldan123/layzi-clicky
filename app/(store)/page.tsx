import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/store/ProductCard";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/store/AnimatedSection";
import { HeroSection } from "@/components/store/HeroSection";

export default async function HomePage() {
  const products = await db.product.findMany({
    where: { active: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <HeroSection />

      {/* Features strip */}
      <AnimatedSection>
        <div className="bg-[--color-primary] text-white py-4 overflow-hidden">
          <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap w-max">
            {Array(4)
              .fill([
                "✨ Handcrafted",
                "🎯 Satisfying Click",
                "🌈 Multiple Colors",
                "📦 Fast Shipping",
                "💕 Made with Love",
              ])
              .flat()
              .map((text, i) => (
                <span key={i} className="font-bold text-sm tracking-wide">
                  {text}
                </span>
              ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <AnimatedSection className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-[--color-primary] uppercase mb-3 block">
            New Arrivals
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[--color-foreground] mb-4">
            Meet Your New
            <br />
            <span className="text-[--color-primary]">Fidget BFF</span>
          </h2>
          <p className="text-[--color-muted-foreground] max-w-lg mx-auto">
            Each clicker is carefully 3D printed and assembled by hand. No two
            are exactly alike — just like you.
          </p>
        </AnimatedSection>

        {products.length === 0 ? (
          <div className="text-center py-20 text-[--color-muted-foreground]">
            <div className="text-5xl mb-4">🎯</div>
            <p className="font-semibold">Products coming soon!</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <AnimatedSection delay={0.3} className="text-center mt-12">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </Link>
        </AnimatedSection>
      </section>

      {/* Why section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-4xl font-black">
              Why You&apos;ll Love It
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🖨️",
                title: "3D Printed Perfection",
                desc: "Every clicker is printed layer by layer, giving it a unique texture and satisfying weight that mass-produced toys just can't match.",
              },
              {
                emoji: "🎯",
                title: "That Perfect Click",
                desc: "Engineered for maximum satisfaction. The click mechanism is tuned to give you that irresistible tactile feedback every single time.",
              },
              {
                emoji: "🌈",
                title: "Your Colors, Your Vibe",
                desc: "Pick from a growing range of colors and finishes. Or request a custom color — we love making one-of-a-kind pieces.",
              },
            ].map(({ emoji, title, desc }) => (
              <StaggerItem key={title}>
                <div className="text-center p-8 rounded-3xl hover:bg-[--color-cream] transition-colors group">
                  <div className="text-5xl mb-5 group-hover:scale-110 transition-transform inline-block">
                    {emoji}
                  </div>
                  <h3 className="text-xl font-black mb-3">{title}</h3>
                  <p className="text-[--color-muted-foreground] leading-relaxed">
                    {desc}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA banner */}
      <AnimatedSection>
        <section className="mx-4 sm:mx-6 lg:mx-8 my-20 rounded-3xl bg-gradient-to-br from-[--color-primary] to-[--color-secondary] p-12 md:p-20 text-white text-center overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            {["🎯", "✨", "💕", "🌈", "🎯", "✨"].map((e, i) => (
              <span
                key={i}
                className="absolute text-6xl"
                style={{
                  top: `${[10, 70, 30, 80, 50, 20][i]}%`,
                  left: `${[5, 15, 75, 80, 45, 90][i]}%`,
                  transform: "rotate(-15deg)",
                }}
              >
                {e}
              </span>
            ))}
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to click?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
              Your perfect fidget companion is waiting. Free shipping on all
              orders!
            </p>
            <Link href="/shop">
              <Button
                variant="ghost"
                size="lg"
                className="bg-white text-[--color-primary] hover:bg-white/90 hover:text-[--color-primary-dark]"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
