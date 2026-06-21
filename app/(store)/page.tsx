import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/store/AnimatedSection";
import { HeroSection } from "@/components/store/HeroSection";
import { ArrowRight, Layers, Zap, Palette } from "lucide-react";

export default async function HomePage() {
  const products = await db.product.findMany({
    where: { active: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const features = [
    {
      icon: Layers,
      title: "3D Printed Perfection",
      desc: "Every clicker is printed layer by layer with premium PLA+ filament, giving it a unique texture and satisfying weight that mass-produced toys can't match.",
    },
    {
      icon: Zap,
      title: "The Perfect Click",
      desc: "Engineered for maximum satisfaction. The click mechanism is precisely tuned for that irresistible tactile feedback you'll keep coming back to.",
    },
    {
      icon: Palette,
      title: "Your Colors",
      desc: "Choose from our curated color range or request something custom. Each piece is made fresh for you — no stock sitting on shelves.",
    },
  ];

  const steps = [
    { number: "01", title: "Choose your clicker", desc: "Pick a design and color that matches your vibe." },
    { number: "02", title: "We print it fresh", desc: "Your order goes straight to the printer. No warehouses, no mass production." },
    { number: "03", title: "Click. Love. Repeat.", desc: "Delivered to your door, ready to satisfy your clicking habit." },
  ];

  return (
    <div className="overflow-x-hidden">
      <HeroSection />

      {/* Marquee strip */}
      <div className="bg-[#111111] text-white py-3.5 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap w-max"
          style={{ animation: "marquee 30s linear infinite" }}
        >
          {Array(3)
            .fill(["PREMIUM QUALITY", "HANDCRAFTED", "FREE SHIPPING", "MADE IN SINGAPORE", "LIMITED RUNS", "3D PRINTED", "SATISFACTION GUARANTEED"])
            .flat()
            .map((text, i) => (
              <span key={i} className="text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-12">
                {text}
                <span className="text-[--color-primary]">·</span>
              </span>
            ))}
        </div>
      </div>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <AnimatedSection className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-3">Collection</p>
            <h2
              className="text-4xl md:text-5xl font-black text-[--color-foreground] leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Shop the<br />Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-[--color-foreground] hover:text-[--color-primary] transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        {products.length === 0 ? (
          <div className="text-center py-24 border border-[--color-border]">
            <p className="text-[--color-muted-foreground] font-semibold">New products dropping soon</p>
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

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-[--color-foreground] border border-[--color-border] px-6 py-3 hover:border-[--color-foreground] transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Statement section */}
      <section className="bg-[#111111] text-white py-28 px-6 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#FF3D00] blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#FF3D00] blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <AnimatedSection className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-8">Our Promise</p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            BUILT FOR THOSE<br />
            WHO CAN&apos;T STOP<br />
            <span className="text-[--color-primary]">CLICKING.</span>
          </h2>
          <p className="mt-8 text-base text-white/60 max-w-lg mx-auto leading-relaxed">
            Every Layzi Clicky product is designed with one goal: to be the most satisfying thing in your pocket.
          </p>
        </AnimatedSection>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <AnimatedSection className="mb-16">
          <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-3">The Process</p>
          <h2
            className="text-4xl md:text-5xl font-black leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How It Works
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {steps.map((step, i) => (
            <StaggerItem key={step.number}>
              <div className={`p-8 md:p-10 border-[--color-border] ${i < 2 ? "md:border-r" : ""} border-b md:border-b-0`}>
                <p
                  className="text-6xl font-black text-[--color-primary] opacity-30 mb-6 leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.number}
                </p>
                <h3 className="text-lg font-black text-[--color-foreground] mb-3">{step.title}</h3>
                <p className="text-sm text-[--color-muted-foreground] leading-relaxed">{step.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Why section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-16">
            <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-3">Why Layzi Clicky</p>
            <h2
              className="text-4xl md:text-5xl font-black leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Crafted Different
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="group">
                  <div className="w-10 h-10 border border-[--color-border] flex items-center justify-center mb-6 group-hover:bg-[#FF3D00] group-hover:border-[--color-primary] transition-colors">
                    <Icon className="w-4 h-4 text-[--color-foreground] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base font-black text-[--color-foreground] mb-3">{title}</h3>
                  <p className="text-sm text-[--color-muted-foreground] leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Materials strip */}
      <section className="border-y border-[--color-border] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Material", value: "PLA+ Filament" },
              { label: "Finish", value: "Smooth Matte" },
              { label: "Weight", value: "Balanced" },
              { label: "Built To", value: "Last Forever" },
            ].map(({ label, value }) => (
              <StaggerItem key={label}>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[--color-muted-foreground] mb-2">{label}</p>
                <p className="font-black text-[--color-foreground]" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA section */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
          <div className="bg-[#FF3D00] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2
                className="text-4xl md:text-5xl font-black text-white leading-none mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to click?
              </h2>
              <p className="text-white/80 text-base max-w-md">
                Free shipping on all orders. Each clicker is printed and assembled fresh for you.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-white text-[--color-primary] px-8 py-4 font-black text-sm tracking-wide uppercase flex-shrink-0 hover:bg-white/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
