"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus, Check, Package, Truck, RefreshCw } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import type { Product, Variant } from "@prisma/client";

interface Props {
  product: Product & { variants: Variant[] };
}

export function ProductDetail({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(product.variants[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const images = selectedVariant?.images.length
    ? selectedVariant.images
    : product.images.length
    ? product.images
    : ["/placeholder.svg"];

  const activeImage = images[currentImage] ?? "/placeholder.svg";

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        variantId: selectedVariant?.id,
        name: product.name,
        variantLabel: selectedVariant ? `${selectedVariant.name}: ${selectedVariant.value}` : undefined,
        price: product.price,
        image: images[0] ?? "/placeholder.svg",
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const variantGroups = product.variants.reduce<Record<string, Variant[]>>((acc, v) => {
    if (!acc[v.name]) acc[v.name] = [];
    acc[v.name].push(v);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Image gallery */}
        <div className="sticky top-24">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative aspect-square bg-[--color-border] overflow-hidden mb-3"
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
                  onClick={() => setCurrentImage((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white flex items-center justify-center shadow hover:bg-[--color-background] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentImage((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white flex items-center justify-center shadow hover:bg-[--color-background] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </motion.div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`relative w-16 h-16 overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === currentImage ? "border-[--color-foreground]" : "border-transparent hover:border-[--color-border]"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" unoptimized={img.endsWith(".svg")} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[--color-primary] uppercase mb-3">
              Layzi Clicky
            </p>
            <h1
              className="text-3xl md:text-4xl font-black text-[--color-foreground] leading-tight mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.name}
            </h1>
            <p className="text-3xl font-black text-[--color-foreground]" style={{ fontFamily: "var(--font-display)" }}>
              {formatPrice(product.price)}
            </p>
          </div>

          <p className="text-[--color-muted-foreground] leading-relaxed text-sm border-t border-[--color-border] pt-6">
            {product.description}
          </p>

          {/* Variants */}
          {Object.entries(variantGroups).map(([groupName, variants]) => (
            <div key={groupName}>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[--color-muted-foreground] mb-3">
                {groupName}:{" "}
                <span className="text-[--color-foreground] normal-case font-bold">
                  {selectedVariant?.name === groupName ? selectedVariant.value : ""}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => { setSelectedVariant(v); setCurrentImage(0); }}
                    className={`px-4 py-2 border text-sm font-semibold transition-all ${
                      selectedVariant?.id === v.id
                        ? "border-[--color-foreground] bg-[--color-foreground] text-white"
                        : "border-[--color-border] text-[--color-foreground] hover:border-[--color-foreground]"
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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[--color-muted-foreground] mb-3">Quantity</p>
            <div className="inline-flex items-center border border-[--color-border]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-[--color-background] transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-12 text-center font-black text-base" style={{ fontFamily: "var(--font-display)" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-[--color-background] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-[--color-foreground] text-white py-4 font-bold text-sm tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-[--color-primary] transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Added to Bag
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag — {formatPrice(product.price * quantity)}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Trust signals */}
          <div className="grid grid-cols-3 gap-4 border-t border-[--color-border] pt-6">
            {[
              { icon: Truck, label: "Free Shipping" },
              { icon: Package, label: "Handmade" },
              { icon: RefreshCw, label: "Easy Returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center">
                <Icon className="w-4 h-4 mx-auto mb-2 text-[--color-muted-foreground]" />
                <p className="text-[10px] font-bold tracking-wider uppercase text-[--color-muted-foreground]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
