"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useState, useRef } from "react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variantCount?: number;
  defaultVariantId?: string;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  image,
  variantCount = 0,
  defaultVariantId,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const { addItem } = useCart();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 180, damping: 25 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 180, damping: 25 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(nx);
    my.set(ny);
    setShine({ x: (nx + 0.5) * 100, y: (ny + 0.5) * 100 });
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ productId: id, variantId: defaultVariantId, name, price, image });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformPerspective: 900,
        touchAction: "pan-y",
      }}
      whileHover={{ scale: 1.03, y: -6 }}
      transition={{ scale: { duration: 0.3 }, y: { duration: 0.3 } }}
      className="group"
    >
      <Link href={`/products/${slug}`} className="block">
        <div className="relative aspect-square bg-[#E2E1DC] overflow-hidden mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={image.endsWith(".svg")}
          />

          {/* Moving shine overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.28) 0%, transparent 60%)`,
            }}
          />

          {/* Quick-add overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAdd}
              className="w-full bg-[#111111] text-white py-3 text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-[#FF3D00] transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Bag
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {variantCount > 1 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#111111] text-[10px] font-bold px-2 py-1 tracking-wide uppercase">
              {variantCount} Colors
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold text-sm text-[#111111] group-hover:text-[#FF3D00] transition-colors leading-snug mb-1">
            {name}
          </h3>
          <p className="font-black text-[#111111]" style={{ fontFamily: "var(--font-display)" }}>
            {formatPrice(price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
