"use client";

import { motion, useInView } from "framer-motion";
import { Layers, Zap, Palette } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Layers,
    title: "3D Printed Perfection",
    desc: "Every clicker is printed layer by layer with premium PLA+ filament, giving it a unique texture and satisfying weight that mass-produced toys can't match.",
    accent: "01",
  },
  {
    icon: Zap,
    title: "The Perfect Click",
    desc: "Engineered for maximum satisfaction. The click mechanism is precisely tuned for that irresistible tactile feedback you'll keep coming back to.",
    accent: "02",
  },
  {
    icon: Palette,
    title: "Your Colors",
    desc: "Choose from our curated color range or request something custom. Each piece is made fresh for you — no stock sitting on shelves.",
    accent: "03",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  desc,
  accent,
  index,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: string;
  index: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
      style={{ touchAction: "pan-y" }}
      className="group relative border border-[#E2E1DC] p-8 cursor-default overflow-hidden bg-white transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/8"
    >
      {/* Animated border bottom on hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-[#FF3D00] origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Background accent number */}
      <span
        className="absolute top-4 right-5 text-7xl font-black text-[#111111] opacity-[0.04] select-none pointer-events-none leading-none"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {accent}
      </span>

      <motion.div
        className="w-11 h-11 border border-[#E2E1DC] flex items-center justify-center mb-7 group-hover:bg-[#FF3D00] group-hover:border-[#FF3D00] transition-colors duration-300"
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-4 h-4 text-[#111111] group-hover:text-white transition-colors duration-300" />
      </motion.div>

      <h3 className="text-base font-black text-[#111111] mb-3 group-hover:text-[#FF3D00] transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-[#666660] leading-relaxed">{desc}</p>
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.25em] text-[#FF3D00] uppercase mb-3"
          >
            Why Layzi Clicky
          </motion.p>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={inView ? { y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-black leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Crafted Different
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(({ icon, title, desc, accent }, i) => (
            <FeatureCard
              key={title}
              icon={icon}
              title={title}
              desc={desc}
              accent={accent}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
