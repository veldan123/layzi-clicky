import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/store/AnimatedSection";
import { ArrowRight, Printer, Heart, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Layzi Clicky — handcrafted 3D printed fidget clickers made in Singapore.",
};

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <AnimatedSection>
          <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-6">Our Story</p>
          <h1
            className="text-5xl md:text-7xl font-black leading-none tracking-tight text-[--color-foreground] max-w-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Made by hand.<br />
            Made to <span className="text-[--color-primary]">click.</span>
          </h1>
        </AnimatedSection>
      </section>

      {/* Story */}
      <section className="border-t border-[--color-border]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <AnimatedSection direction="left" className="py-16 lg:py-24 lg:pr-16 lg:border-r border-[--color-border]">
              <h2 className="text-3xl font-black mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                It started with a 3D printer and a problem.
              </h2>
              <div className="space-y-4 text-[--color-muted-foreground] text-sm leading-relaxed">
                <p>Late nights, tight deadlines, restless hands. I needed something to click. Everything in stores was either too big, too cheap, or just not satisfying enough.</p>
                <p>So I designed my own. The first Dumpling Clicker was made for me — shaped like a little dumpling because why not, and tuned until the click felt exactly right.</p>
                <p>Friends asked where they could get one. Then friends of friends. Layzi Clicky was born out of a simple idea: the best fidget toy is one made with intention, not mass-produced to hit a price point.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" className="py-16 lg:py-24 lg:pl-16">
              <h2 className="text-3xl font-black mb-6 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
                Every order printed fresh.
              </h2>
              <div className="space-y-4 text-[--color-muted-foreground] text-sm leading-relaxed">
                <p>There are no warehouses. No stock on shelves. When you order, your clicker goes straight to the printer. Every piece is fresh, every color is vibrant, nothing goes to waste.</p>
                <p>We use premium PLA+ filament that&apos;s durable, smooth, and satisfying to hold. The click mechanism is tested before every order ships. If it does not feel right, we reprint it.</p>
                <p>This is a small operation. That is intentional. Small means we can care about every single order.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#111111] text-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-16">
            <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-4">What We Stand For</p>
            <h2 className="text-4xl font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>Our Values</h2>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Printer, title: "Made on Demand", desc: "No overproduction. Every clicker is printed when you order it. Better for you, better for the planet." },
              { icon: Heart, title: "Quality Over Volume", desc: "We would rather make fewer things that are excellent than many things that are average." },
              { icon: Star, title: "Obsessively Tested", desc: "The click has to be perfect. Every single time. We test every unit before it leaves." },
            ].map(({ icon: Icon, title, desc }) => (
              <StaggerItem key={title}>
                <div className="border border-white/10 p-8">
                  <Icon className="w-5 h-5 text-[--color-primary] mb-6" />
                  <h3 className="font-black text-base mb-3">{title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <AnimatedSection className="mb-16">
          <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-4">How We Work</p>
          <h2 className="text-4xl font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>The Process</h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "You Order", desc: "Pick your design and color." },
            { step: "02", title: "We Print", desc: "Your clicker goes to the printer within 24 hours." },
            { step: "03", title: "We Test", desc: "Click mechanism checked on every unit." },
            { step: "04", title: "It Ships", desc: "Carefully packaged and on its way." },
          ].map(({ step, title, desc }) => (
            <StaggerItem key={step}>
              <p className="text-5xl font-black text-[--color-primary] opacity-25 mb-4 leading-none" style={{ fontFamily: "var(--font-display)" }}>{step}</p>
              <h3 className="font-black text-base mb-2">{title}</h3>
              <p className="text-sm text-[--color-muted-foreground] leading-relaxed">{desc}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <AnimatedSection>
        <section className="border-t border-[--color-border]">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <h2 className="text-3xl md:text-4xl font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>
              Ready to find your click?
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-[#111111] text-white px-8 py-4 font-bold text-sm tracking-wide uppercase hover:bg-[#FF3D00] transition-colors flex-shrink-0"
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
