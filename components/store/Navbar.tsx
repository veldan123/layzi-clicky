"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const count = itemCount();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#F8F7F3]/95 backdrop-blur-md border-b border-[--color-border]"
            : "bg-transparent"
        )}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-display font-bold text-lg tracking-tight text-[--color-foreground] hover:text-[--color-primary] transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            LAYZI CLICKY
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-semibold text-[--color-muted-foreground] hover:text-[--color-foreground] transition-colors tracking-wide"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2 hover:bg-black/5 rounded-md transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5 text-[--color-foreground]" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#FF3D00] text-white text-[10px] font-bold flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              className="md:hidden p-2 hover:bg-black/5 rounded-md transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#F8F7F3] border-b border-[--color-border] shadow-lg md:hidden"
          >
            <div className="flex flex-col py-4 px-6 gap-1">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-3 font-semibold text-[--color-foreground] hover:text-[--color-primary] transition-colors border-b border-[--color-border] last:border-0"
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
