"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import type { Product, Variant } from "@prisma/client";

interface Props {
  product: Product & { variants: Variant[] };
}

export function ProductDetail({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const images =
    (selectedVariant?.images.length
      ? selectedVariant.images
      : product.images.length
      ? product.images
      : ["/placeholder.svg"]);

  const activeImage = images[currentImage] ?? "/placeholder.svg";

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      variantLabel: selectedVariant
        ? `${selectedVariant.name}: ${selectedVariant.value}`
        : undefined,
      price: product.price,
      image: images[0] ?? "/placeholder.svg",
    });

    // Update quantity if more than 1
    if (quantity > 1) {
      // addItem adds 1 at a time; add rest
      for (let i = 1; i < quantity; i++) {
        addItem({
          productId: product.id,
          variantId: selectedVariant?.id,
          name: product.name,
          variantLabel: selectedVariant
            ? `${selectedVariant.name}: ${selectedVariant.value}`
            : undefined,
          price: product.price,
          image: images[0] ?? "/placeholder.svg",
        });
      }
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Group variants by name (e.g., "Color")
  const variantGroups = product.variants.reduce<Record<string, Variant[]>>(
    (acc, v) => {
      if (!acc[v.name]) acc[v.name] = [];
      acc[v.name].push(v);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image gallery */}
        <div className="sticky top-24">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-[--color-primary-light] mb-4"
          >
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              unoptimized={activeImage.endsWith(".svg")}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImage((i) => (i - 1 + images.length) % images.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImage((i) => (i + 1) % images.length)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </motion.div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === currentImage
                      ? "border-[--color-primary]"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={img.endsWith(".svg")}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-black text-[--color-foreground] mb-2">
              {product.name}
            </h1>
            <p className="text-3xl font-black text-[--color-primary]">
              {formatPrice(product.price)}
            </p>
          </div>

          <p className="text-[--color-muted-foreground] leading-relaxed text-base">
            {product.description}
          </p>

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName}>
              <p className="font-bold mb-3 text-sm uppercase tracking-wider text-[--color-muted-foreground]">
                {groupName}:{" "}
                <span className="text-[--color-foreground] normal-case">
                  {selectedVariant?.name === groupName
                    ? selectedVariant.value
                    : ""}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      setCurrentImage(0);
                    }}
                    className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all ${
                      selectedVariant?.id === v.id
                        ? "border-[--color-primary] bg-[--color-primary-light] text-[--color-primary]"
                        : "border-[--color-border] hover:border-[--color-primary] text-[--color-foreground]"
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <p className="font-bold mb-3 text-sm uppercase tracking-wider text-[--color-muted-foreground]">
              Quantity
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 border-2 border-[--color-border] rounded-full px-4 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-[--color-foreground] hover:text-[--color-primary] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-black text-lg w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-[--color-foreground] hover:text-[--color-primary] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to cart */}
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
          >
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2"
                >
                  ✅ Added to Cart!
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Add to Cart — {formatPrice(product.price * quantity)}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[--color-border]">
            {[
              { emoji: "🚚", label: "Free Shipping" },
              { emoji: "💕", label: "Handmade" },
              { emoji: "✨", label: "Premium Quality" },
            ].map(({ emoji, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <p className="text-xs font-semibold text-[--color-muted-foreground]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
