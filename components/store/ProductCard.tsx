"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  variantCount?: number;
}

export function ProductCard({
  slug,
  name,
  price,
  image,
  variantCount = 0,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Link href={`/products/${slug}`} className="group block">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-[--color-primary-light] mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized={image.endsWith(".svg")}
          />
        </div>
        <div className="px-1">
          <h3 className="font-bold text-[--color-foreground] group-hover:text-[--color-primary] transition-colors leading-tight mb-1">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="font-black text-[--color-primary] text-lg">
              {formatPrice(price)}
            </span>
            {variantCount > 0 && (
              <span className="text-xs font-semibold text-[--color-muted-foreground] bg-gray-100 px-2 py-0.5 rounded-full">
                {variantCount} colors
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
