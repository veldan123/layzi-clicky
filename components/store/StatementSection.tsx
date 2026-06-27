"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function WordReveal({
  text,
  className,
  delay = 0,
  style,
}: {
  text: string;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const words = text.split(" ");

  return (
    <span ref={ref} className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: "0.28em" }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: "115%", opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : { y: "115%", opacity: 0 }}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.075,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function StatementSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section className="bg-[#111111] text-white py-28 px-6 relative overflow-hidden">
      {/* Animated background orbs */}
      <motion.div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#FF3D00] opacity-[0.06] blur-[120px] pointer-events-none"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{ translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#FF3D00] opacity-[0.05] blur-[100px] pointer-events-none"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ translateX: "50%", translateY: "50%" }}
      />

      <div ref={ref} className="max-w-5xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-bold tracking-[0.25em] text-[#FF3D00] uppercase mb-10"
        >
          Our Promise
        </motion.p>

        <h2
          className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <WordReveal text="BUILT FOR THOSE" delay={0.1} />
          <br />
          <WordReveal text="WHO CAN'T STOP" delay={0.35} />
          <br />
          <span className="text-[#FF3D00]">
            <WordReveal text="CLICKING." delay={0.6} />
          </span>
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-10 text-base text-white/50 max-w-lg mx-auto leading-relaxed"
        >
          Every Layzi Clicky product is designed with one goal: to be the most
          satisfying thing in your pocket.
        </motion.p>
      </div>
    </section>
  );
}
