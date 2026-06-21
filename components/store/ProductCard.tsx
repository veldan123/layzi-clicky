"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
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
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: id,
      variantId: defaultVariantId,
      name,
      price,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group">
      <Link href={`/products/${slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-[--color-border] overflow-hidden mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized={image.endsWith(".svg")}
          />

          {/* Quick-add overlay on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAdd}
              className="w-full bg-[--color-foreground] text-white py-3 text-xs font-bold tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-[--color-primary] transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Bag
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Variant count badge */}
          {variantCount > 1 && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[--color-foreground] text-[10px] font-bold px-2 py-1 tracking-wide uppercase">
              {variantCount} Colors
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h3 className="font-bold text-sm text-[--color-foreground] group-hover:text-[--color-primary] transition-colors leading-snug mb-1">
            {name}
          </h3>
          <p className="font-black text-[--color-foreground]" style={{ fontFamily: "var(--font-display)" }}>
            {formatPrice(price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
