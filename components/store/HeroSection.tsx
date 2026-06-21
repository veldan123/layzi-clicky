"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[--color-primary-light] via-[--color-background] to-[--color-secondary-light]">
      {/* Floating decorative blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-64 h-64 bg-[--color-primary] opacity-10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-10 left-10 w-80 h-80 bg-[--color-secondary] opacity-10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            <span className="inline-block text-xs font-bold tracking-widest text-[--color-primary] uppercase bg-[--color-primary-light] px-4 py-2 rounded-full mb-6">
              🎯 Handcrafted in Singapore
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black text-[--color-foreground] leading-[1.05] mb-6"
          >
            Click.{" "}
            <span className="text-[--color-primary]">Satisfy.</span>
            <br />
            Repeat.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.25, duration: 0.6 }}
            className="text-lg text-[--color-muted-foreground] leading-relaxed mb-8 max-w-md"
          >
            Adorably designed 3D printed fidget clickers that are impossible to
            put down. Find your perfect click companion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/shop">
              <Button variant="primary" size="lg">
                Shop Now ✨
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Our Story
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[--color-primary-light] to-[--color-secondary-light] rounded-3xl rotate-3" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/placeholder.svg"
                alt="Layzi Clicky — Cute 3D Printed Fidget Clicker"
                width={600}
                height={600}
                className="w-full h-full object-cover"
                priority
                unoptimized
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.6, type: "spring", stiffness: 200 }}
              className="absolute -bottom-4 -right-4 bg-[--color-primary] text-white rounded-2xl px-4 py-3 shadow-lg font-black text-sm"
            >
              😍 So Satisfying
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
