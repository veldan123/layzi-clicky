import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";

export const metadata: Metadata = { title: "Order Confirmed!" };

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  const order = orderId
    ? await db.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      })
    : null;

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-black mb-3">Order Confirmed!</h1>
        <p className="text-[--color-muted-foreground] mb-8">
          Thank you for your purchase! Check your email for confirmation details.
        </p>
        <Link href="/shop">
          <Button variant="primary" size="lg">
            Keep Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress as {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Success header */}
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-[--color-primary-light] rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
          🎉
        </div>
        <h1 className="text-4xl font-black text-[--color-foreground] mb-2">
          Order Confirmed!
        </h1>
        <p className="text-[--color-muted-foreground]">
          A confirmation email has been sent to{" "}
          <strong>{order.customerEmail}</strong>
        </p>
      </div>

      {/* Order details card */}
      <div className="bg-white rounded-2xl border border-[--color-border] p-6 mb-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-[--color-muted-foreground] uppercase tracking-wider font-bold mb-1">
              Order Number
            </p>
            <p className="font-black text-xl">
              #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[--color-muted-foreground] uppercase tracking-wider font-bold mb-1">
              Date
            </p>
            <p className="font-semibold">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-xs text-[--color-muted-foreground] uppercase tracking-wider font-bold">
            Status
          </p>
          <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>

        {/* Items */}
        <div className="border-t border-[--color-border] pt-6 space-y-3">
          <p className="text-xs text-[--color-muted-foreground] uppercase tracking-wider font-bold mb-4">
            Items
          </p>
          {order.items.map((item: { id: string; productName: string; variantName: string | null; quantity: number; price: number }) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[--color-foreground]">
                {item.productName}
                {item.variantName && ` — ${item.variantName}`}{" "}
                <span className="text-[--color-muted-foreground]">
                  × {item.quantity}
                </span>
              </span>
              <span className="font-bold">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-[--color-border] pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[--color-muted-foreground]">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[--color-muted-foreground]">Shipping</span>
            <span className="text-[--color-success] font-semibold">
              {order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between font-black text-base pt-2 border-t border-[--color-border]">
            <span>Total</span>
            <span className="text-[--color-primary]">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="border-t border-[--color-border] pt-6">
          <p className="text-xs text-[--color-muted-foreground] uppercase tracking-wider font-bold mb-3">
            Shipping To
          </p>
          <p className="text-sm text-[--color-foreground] leading-relaxed">
            {order.customerName}
            <br />
            {shippingAddress.line1}
            {shippingAddress.line2 && <><br />{shippingAddress.line2}</>}
            <br />
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.postalCode}
            <br />
            {shippingAddress.country}
          </p>
        </div>
      </div>

      <div className="text-center space-y-4">
        <Link href="/shop">
          <Button variant="primary" size="lg">
            Keep Shopping 🎯
          </Button>
        </Link>
        <p className="text-sm text-[--color-muted-foreground]">
          We&apos;ll email you when your order ships!
        </p>
      </div>
    </div>
  );
}
