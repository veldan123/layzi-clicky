export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/store/AnimatedSection";
import { HeroSection } from "@/components/store/HeroSection";
import { StatementSection } from "@/components/store/StatementSection";
import { FeaturesSection } from "@/components/store/FeaturesSection";
import { CTASection } from "@/components/store/CTASection";
import { ArrowRight } from "lucide-react";

const steps = [
  { number: "01", title: "Choose your clicker", desc: "Pick a design and color that matches your vibe." },
  { number: "02", title: "We print it fresh", desc: "Your order goes straight to the printer. No warehouses, no mass production." },
  { number: "03", title: "Click. Love. Repeat.", desc: "Delivered to your door, ready to satisfy your clicking habit." },
];

export default async function HomePage() {
  const products = await db.product.findMany({
    where: { active: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  return (
    <div className="overflow-x-hidden">
      <HeroSection />

      {/* Marquee strip */}
      <div className="bg-[#111111] text-white py-3.5 overflow-hidden">
        <div
          className="flex gap-12 whitespace-nowrap w-max"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {Array(3)
            .fill([
              "PREMIUM QUALITY",
              "HANDCRAFTED",
              "SINGPOST DELIVERY",
              "MADE IN SINGAPORE",
              "LIMITED RUNS",
              "3D PRINTED",
              "SATISFACTION GUARANTEED",
            ])
            .flat()
            .map((text, i) => (
              <span
                key={i}
                className="text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-12"
              >
                {text}
                <span className="text-[#FF3D00]">·</span>
              </span>
            ))}
        </div>
      </div>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <AnimatedSection className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-[#FF3D00] uppercase mb-3">Collection</p>
            <h2
              className="text-4xl md:text-5xl font-black text-[#111111] leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Shop the<br />Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-[#111111] hover:text-[#FF3D00] transition-colors group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </AnimatedSection>

        {products.length === 0 ? (
          <div className="text-center py-24 border border-[#E2E1DC]">
            <p className="text-[#666660] font-semibold">New products dropping soon</p>
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
            className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] border border-[#E2E1DC] px-6 py-3 hover:border-[#111111] transition-colors"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Statement section — word-by-word reveal */}
      <StatementSection />

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <AnimatedSection className="mb-16">
          <p className="text-xs font-bold tracking-[0.25em] text-[#FF3D00] uppercase mb-3">The Process</p>
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
              <div
                className={`p-8 md:p-10 border-[#E2E1DC] ${i < 2 ? "md:border-r" : ""} border-b md:border-b-0`}
              >
                <p
                  className="text-6xl font-black text-[#FF3D00] opacity-30 mb-6 leading-none"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {step.number}
                </p>
                <h3 className="text-lg font-black text-[#111111] mb-3">{step.title}</h3>
                <p className="text-sm text-[#666660] leading-relaxed">{step.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Why Layzi Clicky — interactive feature cards */}
      <FeaturesSection />

      {/* Materials strip */}
      <section className="border-y border-[#E2E1DC] py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Material", value: "PLA+ Filament" },
              { label: "Finish", value: "Smooth Matte" },
              { label: "Weight", value: "Balanced" },
              { label: "Built To", value: "Last Forever" },
            ].map(({ label, value }) => (
              <StaggerItem key={label}>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#666660] mb-2">{label}</p>
                <p className="font-black text-[#111111]" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA — magnetic button + animated block */}
      <CTASection />
    </div>
  );
}
