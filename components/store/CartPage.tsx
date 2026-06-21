"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const cartTotal = total();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-7xl mb-6"
        >
          🛒
        </motion.div>
        <h1 className="text-3xl font-black mb-3">Your cart is empty</h1>
        <p className="text-[--color-muted-foreground] mb-8">
          Nothing here yet — go find something cute to click!
        </p>
        <Link href="/shop">
          <Button variant="primary" size="lg">
            Browse the Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black mb-10">Your Cart 🛒</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.variantId}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="flex gap-5 p-5 bg-white rounded-2xl border border-[--color-border] shadow-sm"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[--color-primary-light] flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized={item.image.endsWith(".svg")}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[--color-foreground] mb-0.5">
                    {item.name}
                  </h3>
                  {item.variantLabel && (
                    <p className="text-sm text-[--color-muted-foreground] mb-2">
                      {item.variantLabel}
                    </p>
                  )}
                  <p className="font-black text-[--color-primary]">
                    {formatPrice(item.price)}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 border-2 border-[--color-border] rounded-full px-3 py-1.5">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.variantId,
                            item.quantity - 1
                          )
                        }
                        className="hover:text-[--color-primary] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
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
                        className="hover:text-[--color-primary] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-black text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="p-1.5 rounded-full hover:bg-red-50 text-[--color-muted] hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[--color-border] p-6 sticky top-24">
            <h2 className="font-black text-xl mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[--color-muted-foreground]">
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[--color-muted-foreground]">
                  Shipping
                </span>
                <span className="font-semibold text-[--color-success]">
                  FREE
                </span>
              </div>
            </div>

            <div className="flex justify-between font-black text-lg border-t border-[--color-border] pt-4 mb-6">
              <span>Total</span>
              <span className="text-[--color-primary]">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <Link href="/checkout">
              <Button variant="primary" size="lg" className="w-full">
                Checkout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <Link
              href="/shop"
              className="block text-center mt-4 text-sm text-[--color-muted-foreground] hover:text-[--color-primary] transition-colors font-semibold"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
