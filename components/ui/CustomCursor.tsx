"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const ringX = useSpring(mouseX, { stiffness: 95, damping: 18, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 95, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    document.body.style.cursor = "none";
    setMounted(true);

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      setHovering(!!el.closest("a, button, [role='button'], [data-hover='true']"));
    };

    const down = () => setClicking(true);
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Lagging ring */}
      <motion.div
        className="fixed pointer-events-none rounded-full border"
        style={{
          top: 0,
          left: 0,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9998,
        }}
        animate={{
          width: hovering ? 52 : clicking ? 14 : 32,
          height: hovering ? 52 : clicking ? 14 : 32,
          borderColor: hovering ? "#FF3D00" : "rgba(17,17,17,0.7)",
          opacity: clicking ? 0.5 : 1,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      />
      {/* Precise dot */}
      <motion.div
        className="fixed pointer-events-none rounded-full bg-[#FF3D00]"
        style={{
          top: 0,
          left: 0,
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          zIndex: 9999,
        }}
        animate={{
          width: clicking ? 3 : hovering ? 7 : 5,
          height: clicking ? 3 : hovering ? 7 : 5,
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}
