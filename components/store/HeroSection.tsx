"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Package, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const headline = ["THE MOST", "SATISFYING", "CLICK."];

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const duration = 1400;
        const startTime = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(eased * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);

  return <span ref={ref}>{val}{suffix}</span>;
}

function MagneticButton({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "outline";
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
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-block">
      <Link href={href}>
        <motion.span
          style={{ x: sx, y: sy, display: "inline-flex", touchAction: "pan-y" }}
          whileTap={{ scale: 0.95 }}
          className={`items-center gap-2 px-7 py-3.5 text-sm font-bold tracking-wide uppercase cursor-pointer transition-colors ${
            variant === "dark"
              ? "bg-[#111111] text-white hover:bg-[#FF3D00]"
              : "border border-[#E2E1DC] text-[#111111] hover:border-[#111111]"
          }`}
        >
          {children}
        </motion.span>
      </Link>
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const bgSx = useSpring(mx, { stiffness: 45, damping: 20 });
  const bgSy = useSpring(my, { stiffness: 45, damping: 20 });
  const bgX = useTransform(bgSx, [-0.5, 0.5], [-14, 14]);
  const bgY = useTransform(bgSy, [-0.5, 0.5], [-9, 9]);

  const imgSx = useSpring(mx, { stiffness: 85, damping: 22 });
  const imgSy = useSpring(my, { stiffness: 85, damping: 22 });
  const imgX = useTransform(imgSx, [-0.5, 0.5], [-30, 30]);
  const imgY = useTransform(imgSy, [-0.5, 0.5], [-22, 22]);

  const onMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative min-h-screen flex flex-col justify-center bg-[#F8F7F3]"
    >
      {/* Parallax background blobs */}
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#FF3D00] rounded-full opacity-[0.05] blur-[90px]" />
        <div className="absolute bottom-1/3 left-1/6 w-80 h-80 bg-[#111111] rounded-full opacity-[0.04] blur-[70px]" />
        <div className="absolute top-2/3 right-1/3 w-48 h-48 bg-[#FF3D00] rounded-full opacity-[0.03] blur-[50px]" />
      </motion.div>

      {/* Background accent */}
      <div
        className="absolute top-0 right-0 w-[45%] h-full bg-[#111111] opacity-[0.03] pointer-events-none"
        style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs font-bold tracking-[0.25em] text-[#FF3D00] uppercase mb-10"
            >
              Handcrafted in Singapore
            </motion.p>

            <div className="space-y-1 mb-8">
              {headline.map((line, i) => (
                <div key={line} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[clamp(3rem,8vw,6.5rem)] font-black leading-none tracking-tight text-[#111111]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {line === "CLICK." ? (
                      <>CLICK<span className="text-[#FF3D00]">.</span></>
                    ) : line}
                  </motion.h1>
                </div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="text-base text-[#666660] leading-relaxed max-w-sm mb-10"
            >
              3D printed fidget clickers designed for maximum satisfaction.
              Pocket-sized, endlessly clickable, completely addictive.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.68 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <MagneticButton href="/shop" variant="dark">
                Shop Now <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton href="/about" variant="outline">
                Our Story
              </MagneticButton>
            </motion.div>

            {/* Count-up stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex gap-10 pt-10 border-t border-[#E2E1DC]"
            >
              {[
                { value: 500, suffix: "+", label: "Orders Shipped" },
                { value: 100, suffix: "%", label: "Handcrafted" },
                { value: 5, suffix: "★", label: "Avg Rating" },
              ].map(({ value, suffix, label }) => (
                <div key={label}>
                  <p
                    className="text-3xl font-black text-[#111111] leading-none"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <CountUp to={value} suffix={suffix} />
                  </p>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A0A09A] mt-1.5">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Parallax product visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block pointer-events-none"
            style={{ x: imgX, y: imgY }}
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#FF3D00] translate-x-4 translate-y-4 opacity-10" />

              <div className="relative aspect-square bg-[#E2E1DC] overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Layzi Clicky Dumpling Fidget Clicker"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute -left-6 top-1/3 bg-white shadow-xl border border-[#E2E1DC] p-4"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-[#FF3D00]" />
                  <div>
                    <p className="text-xl font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>100%</p>
                    <p className="text-[10px] font-bold text-[#666660] uppercase tracking-wider mt-0.5">Handmade</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -right-4 bottom-12 bg-[#FF3D00] text-white p-4"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 fill-white" />
                  <div>
                    <p className="text-xl font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>5.0</p>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider mt-0.5">Rating</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none hidden md:flex"
      >
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#A0A09A]">Scroll</span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-[#A0A09A] origin-top"
        />
      </motion.div>
    </section>
  );
}
