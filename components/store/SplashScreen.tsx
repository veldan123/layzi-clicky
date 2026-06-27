"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem("lc_splash_seen")) return;
    sessionStorage.setItem("lc_splash_seen", "1");
    setVisible(true);

    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#111111] overflow-hidden"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF3D00] opacity-[0.06] blur-[120px]" />
          </motion.div>

          <div className="relative flex flex-col items-center gap-6">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.82, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="w-52 h-52 md:w-64 md:h-64 relative"
            >
              <Image
                src="/logo.png"
                alt="Layzi Clicky"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Tagline clip reveal */}
            <div className="overflow-hidden">
              <motion.p
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="text-[10px] font-bold tracking-[0.35em] text-[#FF3D00] uppercase"
              >
                3D Printed Fidgets
              </motion.p>
            </div>

            {/* Progress bar */}
            <div className="w-32 h-px bg-white/10 overflow-hidden mt-2">
              <motion.div
                className="h-full bg-[#FF3D00]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{ originX: 0 }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 0.4 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
