"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } =
    useCart();
  const cartTotal = total();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[--color-background] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[--color-border]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[--color-primary]" />
                <h2 className="font-black text-xl">Your Cart</h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence initial={false}>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="text-5xl mb-4">🛒</div>
                    <p className="font-bold text-lg mb-2">Your cart is empty</p>
                    <p className="text-[--color-muted-foreground] text-sm mb-6">
                      Add something cute to get started!
                    </p>
                    <Button variant="primary" size="sm" onClick={closeCart}>
                      <Link href="/shop">Shop Now</Link>
                    </Button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.variantId}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 bg-white rounded-2xl border border-[--color-border]"
                    >
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[--color-primary-light] flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized={item.image.endsWith(".svg")}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm leading-tight mb-0.5 truncate">
                          {item.name}
                        </p>
                        {item.variantLabel && (
                          <p className="text-xs text-[--color-muted-foreground] mb-2">
                            {item.variantLabel}
                          </p>
                        )}
                        <p className="font-black text-[--color-primary] text-sm">
                          {formatPrice(item.price)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.quantity - 1
                                )
                              }
                              className="w-7 h-7 rounded-full border-2 border-[--color-border] flex items-center justify-center hover:border-[--color-primary] hover:text-[--color-primary] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.quantity + 1
                                )
                              }
                              className="w-7 h-7 rounded-full border-2 border-[--color-border] flex items-center justify-center hover:border-[--color-primary] hover:text-[--color-primary] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              removeItem(item.productId, item.variantId)
                            }
                            className="text-xs text-[--color-muted-foreground] hover:text-red-500 transition-colors font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[--color-border] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[--color-muted-foreground]">
                    Subtotal
                  </span>
                  <span className="font-black text-xl text-[--color-primary]">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <p className="text-xs text-[--color-muted-foreground]">
                  Shipping calculated at checkout
                </p>
                <Link href="/checkout" onClick={closeCart}>
                  <Button variant="primary" size="lg" className="w-full">
                    Checkout — {formatPrice(cartTotal)}
                  </Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
