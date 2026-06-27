"use client";

import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 22 });
  const sy = useSpring(y, { stiffness: 280, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block flex-shrink-0">
      <Link href={href}>
        <motion.span
          style={{ x: sx, y: sy, display: "inline-flex" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={className}
        >
          {children}
        </motion.span>
      </Link>
    </div>
  );
}

export function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#FF3D00] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative"
      >
        {/* Animated background blob */}
        <motion.div
          className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full opacity-[0.07] pointer-events-none"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-48 h-48 bg-white rounded-full opacity-[0.05] pointer-events-none"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -12, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-white leading-none mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to click?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-white/80 text-base max-w-md"
          >
            Free shipping on orders over $50. Each clicker is printed and assembled fresh for you.
          </motion.p>
        </div>

        <MagneticLink
          href="/shop"
          className="items-center gap-3 bg-white text-[#FF3D00] px-8 py-4 font-black text-sm tracking-wide uppercase cursor-pointer hover:bg-white/90 transition-colors relative z-10"
        >
          Shop Now
          <ArrowRight className="w-4 h-4" />
        </MagneticLink>
      </motion.div>
    </section>
  );
}
