"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Package, Truck } from "lucide-react";

const headline = ["THE MOST", "SATISFYING", "CLICK."];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#F8F7F3]">
      {/* Background accent block */}
      <div
        className="absolute top-0 right-0 w-[45%] h-full bg-[#111111] opacity-[0.03] pointer-events-none"
        style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xs font-bold tracking-[0.25em] text-[--color-primary] uppercase mb-10"
            >
              Handcrafted in Singapore
            </motion.p>

            <div className="space-y-1 mb-8">
              {headline.map((line, i) => (
                <div key={line} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.75,
                      delay: 0.15 + i * 0.12,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="text-[clamp(3rem,8vw,6.5rem)] font-black leading-none tracking-tight text-[--color-foreground]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {line === "CLICK." ? (
                      <>CLICK<span className="text-[--color-primary]">.</span></>
                    ) : line}
                  </motion.h1>
                </div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="text-base text-[--color-muted-foreground] leading-relaxed max-w-sm mb-10"
            >
              3D printed fidget clickers designed for maximum satisfaction.
              Pocket-sized, endlessly clickable, completely addictive.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.68 }}
              className="flex flex-wrap gap-3"
            >
              <Link href="/shop">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-[#111111] text-white px-7 py-3.5 text-sm font-bold tracking-wide uppercase cursor-pointer"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
              <Link href="/about">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 border border-[--color-border] text-[--color-foreground] px-7 py-3.5 text-sm font-bold tracking-wide uppercase cursor-pointer hover:border-[--color-foreground] transition-colors"
                >
                  Our Story
                </motion.span>
              </Link>
            </motion.div>
          </div>

          {/* Right — Product visual (hidden on mobile to prevent touch blocking) */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block pointer-events-none"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Orange background block offset */}
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

              {/* Stat cards */}
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
                  <Truck className="w-4 h-4" />
                  <div>
                    <p className="text-xl font-black leading-none" style={{ fontFamily: "var(--font-display)" }}>Free</p>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider mt-0.5">Shipping</p>
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
        transition={{ delay: 1.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none hidden md:flex"
      >
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[--color-muted]">Scroll</span>
        <motion.div
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-[--color-muted] origin-top"
        />
      </motion.div>
    </section>
  );
}
