import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Order Detail — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true, variant: true },
      },
    },
  });

  if (!order) notFound();

  const addr = order.shippingAddress as {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/orders"
          className="text-sm font-semibold text-gray-400 hover:text-[--color-primary] transition-colors"
        >
          ← Orders
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-black text-gray-900">
          #{order.id.slice(-8).toUpperCase()}
        </h1>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: items + totals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <h2 className="px-6 py-4 font-black text-gray-900 border-b border-gray-100">
              Items
            </h2>
            <div className="divide-y divide-gray-50">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center px-6 py-4">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      {item.productName}
                      {item.variantName && (
                        <span className="text-gray-400 font-normal">
                          {" "}
                          — {item.variantName}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-black text-sm text-[--color-primary]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-[--color-primary]">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Stripe */}
          {order.stripePaymentId && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-black text-gray-900 mb-3">Payment</h2>
              <p className="text-sm text-gray-600 font-mono bg-gray-50 p-3 rounded-xl break-all">
                {order.stripePaymentId}
              </p>
            </div>
          )}
        </div>

        {/* Right: customer + status */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-black text-gray-900 mb-4">Customer</h2>
            <p className="font-semibold text-sm text-gray-900">
              {order.customerName}
            </p>
            <p className="text-sm text-gray-500 mt-1">{order.customerEmail}</p>
            {order.customerPhone && (
              <p className="text-sm text-gray-500 mt-0.5">{order.customerPhone}</p>
            )}

            <h3 className="font-bold text-sm text-gray-700 mt-5 mb-2">
              Shipping Address
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {addr.line1}
              {addr.line2 && <><br />{addr.line2}</>}
              <br />
              {addr.city}, {addr.state} {addr.postalCode}
              <br />
              {addr.country}
            </p>

            <p className="text-xs text-gray-400 mt-4">
              Placed {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Status updater */}
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
            notes={order.notes ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
