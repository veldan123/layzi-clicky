import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  AnimatedSection,
  StaggerContainer,
  StaggerItem,
} from "@/components/store/AnimatedSection";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Learn about Layzi Clicky — a passion project turned small business, making cute 3D printed fidget clickers.",
};

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[--color-primary-light] to-[--color-secondary-light] py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <span className="text-5xl block mb-6">🖨️</span>
            <h1 className="text-5xl md:text-6xl font-black text-[--color-foreground] mb-6">
              Our Story
            </h1>
            <p className="text-xl text-[--color-muted-foreground] leading-relaxed">
              From a late-night hobby to your hands — how Layzi Clicky began.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <AnimatedSection direction="left">
            <div className="aspect-square rounded-3xl overflow-hidden bg-[--color-primary-light]">
              <Image
                src="/placeholder.svg"
                alt="The Layzi Clicky studio"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
          </AnimatedSection>

          <AnimatedSection direction="right" delay={0.1}>
            <h2 className="text-3xl font-black mb-6">
              It started with a click
            </h2>
            <p className="text-[--color-muted-foreground] leading-relaxed mb-4">
              Layzi Clicky started the way most good things do — as a personal
              obsession. After discovering just how satisfying a perfectly
              engineered click could be, the idea was simple: make fidget toys
              that were both irresistibly functional and impossibly cute.
            </p>
            <p className="text-[--color-muted-foreground] leading-relaxed mb-4">
              Each clicker is designed, printed, and assembled by hand. We test
              every click mechanism before it leaves our hands — because a
              clicker that doesn&apos;t click right isn&apos;t a Layzi Clicky.
            </p>
            <p className="text-[--color-muted-foreground] leading-relaxed">
              We believe fidget toys don&apos;t have to look boring. They can be
              playful, personal, and a little bit precious. That&apos;s the
              Layzi Clicky promise.
            </p>
          </AnimatedSection>
        </div>

        {/* Values */}
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl font-black">What we stand for</h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              emoji: "🤲",
              title: "Handmade, Always",
              desc: "No factories, no shortcuts. Every single clicker passes through our hands before it gets to yours.",
            },
            {
              emoji: "🌱",
              title: "Small Batch",
              desc: "We print what we need. No mass overproduction, no waste. Thoughtful by design.",
            },
            {
              emoji: "💌",
              title: "Community First",
              desc: "Every order is packed with care. We read every message and love hearing about your clicker adventures.",
            },
          ].map(({ emoji, title, desc }) => (
            <StaggerItem key={title}>
              <div className="bg-white rounded-2xl p-8 text-center border border-[--color-border] hover:border-[--color-primary] transition-colors">
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-black text-lg mb-3">{title}</h3>
                <p className="text-[--color-muted-foreground] text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <AnimatedSection className="text-center">
          <div className="bg-gradient-to-br from-[--color-primary-light] to-[--color-secondary-light] rounded-3xl p-12">
            <h2 className="text-3xl font-black mb-4">
              Ready to find your click?
            </h2>
            <p className="text-[--color-muted-foreground] mb-8">
              Browse the shop and find your perfect fidget companion.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Shop Now ✨
              </Button>
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
