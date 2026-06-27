"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart();
  const cartTotal = total();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/50"
          />

          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[#F8F7F3] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[--color-border]">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <h2 className="font-black text-base tracking-wide uppercase" style={{ fontFamily: "var(--font-display)" }}>
                  Your Bag
                </h2>
                {items.length > 0 && (
                  <span className="bg-[#FF3D00] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 hover:bg-black/5 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full py-20 text-center px-6"
                  >
                    <ShoppingBag className="w-8 h-8 text-[--color-border] mb-4" />
                    <p className="font-bold text-base mb-2">Your bag is empty</p>
                    <p className="text-[--color-muted-foreground] text-sm mb-6">
                      Add something satisfying to get started.
                    </p>
                    <button
                      onClick={closeCart}
                      className="text-sm font-bold text-[--color-foreground] underline underline-offset-4 hover:text-[--color-primary] transition-colors"
                    >
                      <Link href="/shop">Browse Products</Link>
                    </button>
                  </motion.div>
                ) : (
                  <div className="p-6 space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.productId}-${item.variantId}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 bg-white border border-[--color-border] p-4"
                      >
                        <div className="relative w-16 h-16 bg-[#E2E1DC] flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized={item.image.endsWith(".svg")}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm leading-tight mb-0.5 truncate">{item.name}</p>
                          {item.variantLabel && (
                            <p className="text-xs text-[--color-muted-foreground] mb-2">{item.variantLabel}</p>
                          )}
                          <p className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>
                            {formatPrice(item.price)}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-[--color-border]">
                              <button
                                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-[#F8F7F3] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-[#F8F7F3] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.variantId)}
                              className="text-xs text-[--color-muted-foreground] hover:text-[--color-error] transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Checkout footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[--color-border] space-y-4 bg-white">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[--color-muted-foreground]">Subtotal</span>
                  <span className="font-black text-lg" style={{ fontFamily: "var(--font-display)" }}>
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="text-xs text-[--color-muted-foreground]">Shipping calculated at checkout · Free on orders over $50</p>
                <Link href="/checkout" onClick={closeCart}>
                  <button className="w-full bg-[#111111] text-white py-4 font-bold text-sm tracking-[0.1em] uppercase flex items-center justify-center gap-2 hover:bg-[#FF3D00] transition-colors">
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
