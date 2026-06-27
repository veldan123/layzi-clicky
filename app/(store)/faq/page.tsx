"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Minus, ArrowRight } from "lucide-react";

const faqs = [
  {
    category: "Products",
    id: "products",
    items: [
      {
        q: "What material are the clickers made from?",
        a: "All Layzi Clicky products are 3D printed using premium PLA+ filament. PLA+ is a biodegradable, plant-based plastic that's stronger and smoother than standard PLA. It's safe, durable, and produces a satisfying matte finish.",
      },
      {
        q: "How does the click mechanism work?",
        a: "The click mechanism is built directly into the 3D printed design. The spring-loaded button gives a crisp, tactile click every press. It's designed and tested to last tens of thousands of clicks without losing that satisfying feel.",
      },
      {
        q: "Can I request custom colors?",
        a: "Yes! We love making custom pieces. Reach out to us at hello@lazyclicky.com with your color ideas and we'll let you know what's available. Custom orders typically take 3–5 extra days.",
      },
      {
        q: "Are there size variations?",
        a: "Currently all clickers come in one size — pocket-sized and palm-filling. We're working on additional sizes. Sign up to our newsletter to be the first to know.",
      },
    ],
  },
  {
    category: "Shipping",
    id: "shipping",
    items: [
      {
        q: "How much does shipping cost?",
        a: "Shipping is free on all orders over $50. For orders under $50: Singapore is $2 flat (Singpost Standard). ASEAN countries (Malaysia, Indonesia, Thailand, Philippines, Vietnam, etc.) are $5. Asia Pacific (Australia, China, Japan, Korea, etc.) is $8. All other countries are $12. Rates are calculated automatically at checkout based on your country.",
      },
      {
        q: "How long does delivery take?",
        a: "Every clicker is printed fresh when you order — allow 2–3 business days for printing and assembly. After that: Singapore takes 3–5 business days. ASEAN countries take 7–14 business days via Singpost Airmail. Asia Pacific takes 10–21 business days. Rest of world takes 14–28 business days depending on customs.",
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide from Singapore via Singpost Airmail. Shipping costs are calculated at checkout based on your destination country.",
      },
      {
        q: "Will I get a tracking number?",
        a: "Singapore orders via Singpost Standard include basic tracking. International Singpost Airmail orders may have limited tracking depending on your country's postal service.",
      },
    ],
  },
  {
    category: "Returns",
    id: "returns",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 14 days of delivery if your item arrives damaged or defective. Since each clicker is made to order, we're unable to accept returns for change of mind. Please contact us at hello@lazyclicky.com with photos of any issues.",
      },
      {
        q: "What if my clicker is defective?",
        a: "If there's any issue with the click mechanism or print quality, we'll reprint and reship at no cost to you. Your satisfaction is the whole point.",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled within 12 hours of placement, before printing begins. After that, we're unable to cancel as the clicker will already be in production.",
      },
    ],
  },
  {
    category: "Orders",
    id: "orders",
    items: [
      {
        q: "How do I track my order?",
        a: "After placing your order you'll receive a confirmation email. Once shipped, a second email with your tracking link will arrive. You can also check your order status at any time using your order ID.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and more through our secure Stripe checkout.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed by Stripe, which is PCI DSS Level 1 certified — the highest level of payment security. We never store your card details.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[--color-border]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-8 group"
      >
        <span className="font-semibold text-sm text-[--color-foreground] group-hover:text-[--color-primary] transition-colors">
          {q}
        </span>
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[--color-muted-foreground]">
          {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-[--color-muted-foreground] leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-16">
        <p className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-4">Help</p>
        <h1
          className="text-5xl md:text-6xl font-black leading-none text-[--color-foreground]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          FAQ
        </h1>
        <p className="text-[--color-muted-foreground] text-sm mt-4">
          Can&apos;t find your answer?{" "}
          <a href="mailto:hello@lazyclicky.com" className="text-[--color-foreground] font-semibold underline underline-offset-4 hover:text-[--color-primary] transition-colors">
            Email us
          </a>
        </p>
      </div>

      {/* FAQ sections */}
      <div className="space-y-16">
        {faqs.map(({ category, id, items }) => (
          <div key={id} id={id}>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[--color-muted-foreground] mb-4">{category}</p>
            <div>
              {items.map(({ q, a }) => (
                <FaqItem key={q} q={q} a={a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-20 border border-[--color-border] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-black text-xl mb-1" style={{ fontFamily: "var(--font-display)" }}>Still have questions?</h2>
          <p className="text-sm text-[--color-muted-foreground]">We reply within 24 hours on weekdays.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <a
            href="mailto:hello@lazyclicky.com"
            className="inline-flex items-center gap-2 border border-[--color-border] px-6 py-3 font-bold text-sm tracking-wide hover:border-[--color-foreground] transition-colors"
          >
            Email Us
          </a>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#111111] text-white px-6 py-3 font-bold text-sm tracking-wide hover:bg-[#FF3D00] transition-colors"
          >
            Shop Now
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
