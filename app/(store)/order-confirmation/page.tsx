import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";
import { CheckCircle, Package, Mail, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Order Confirmed — Layzi Clicky" };

const COUNTRIES: Record<string, string> = {
  SG: "Singapore", MY: "Malaysia", ID: "Indonesia", TH: "Thailand",
  PH: "Philippines", VN: "Vietnam", BN: "Brunei", KH: "Cambodia",
  LA: "Laos", MM: "Myanmar", AU: "Australia", NZ: "New Zealand",
  CN: "China", HK: "Hong Kong", TW: "Taiwan", JP: "Japan",
  KR: "South Korea", IN: "India", BD: "Bangladesh", LK: "Sri Lanka",
  NP: "Nepal", PK: "Pakistan", MO: "Macau", US: "United States",
  GB: "United Kingdom", CA: "Canada", DE: "Germany", FR: "France",
  IT: "Italy", ES: "Spain", NL: "Netherlands", SE: "Sweden",
  NO: "Norway", DK: "Denmark", FI: "Finland", CH: "Switzerland",
  AT: "Austria", BE: "Belgium", PL: "Poland", PT: "Portugal",
  IE: "Ireland", AE: "United Arab Emirates", SA: "Saudi Arabia",
  QA: "Qatar", KW: "Kuwait", BH: "Bahrain", OM: "Oman",
  IL: "Israel", TR: "Turkey", ZA: "South Africa", NG: "Nigeria",
  EG: "Egypt", KE: "Kenya", BR: "Brazil", MX: "Mexico",
  AR: "Argentina", CL: "Chile", CO: "Colombia", RU: "Russia",
  UA: "Ukraine", GR: "Greece", CZ: "Czech Republic", HU: "Hungary",
  RO: "Romania",
};

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

  const addr = order?.shippingAddress as {
    line1: string; line2?: string; city: string;
    state?: string; postalCode: string; country: string;
  } | null;

  const shortId = order ? `#${order.id.slice(-8).toUpperCase()}` : "";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="font-black text-lg tracking-tight text-gray-900">
            LAYZI CLICKY
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Success hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-5">
            <CheckCircle className="w-8 h-8 text-green-500" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Thank you{order ? `, ${order.customerName.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-gray-500 text-sm">
            {order
              ? <>Your order <span className="font-bold text-gray-900">{shortId}</span> has been confirmed.</>
              : "Your order has been confirmed."}
          </p>
          {order && (
            <p className="text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              Confirmation sent to <span className="font-medium text-gray-600">{order.customerEmail}</span>
            </p>
          )}
        </div>

        {order ? (
          <div className="space-y-4">
            {/* Order details */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Order number</p>
                  <p className="font-black text-lg text-gray-900 mt-0.5">{shortId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Date</p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">{formatDate(order.createdAt)}</p>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center px-5 py-3.5">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.productName}
                        {item.variantName && (
                          <span className="text-gray-400 font-normal"> — {item.variantName}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span className={order.shipping === 0 ? "text-green-600 font-semibold" : ""}>
                    {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-black text-gray-900 pt-2 border-t border-gray-200 text-base">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            {addr && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <h3 className="font-bold text-sm text-gray-900">Shipping To</h3>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-900">{order.customerName}</p>
                  <p>{addr.line1}{addr.line2 && `, ${addr.line2}`}</p>
                  <p>{addr.city} {addr.postalCode}</p>
                  <p>{COUNTRIES[addr.country] ?? addr.country}</p>
                </div>
              </div>
            )}

            {/* What's next */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-sm text-gray-900">What happens next?</h3>
              </div>
              <div className="space-y-3">
                {[
                  { step: "1", text: "We start 3D printing your clicker within 24 hours." },
                  { step: "2", text: "Quality checked and carefully packaged." },
                  { step: "3", text: "Shipped via Singpost — you'll get a tracking update by email." },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step}
                    </span>
                    <p className="text-sm text-gray-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 text-sm">Your order has been received. Check your email for details.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-[#FF3D00] transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-6 py-3 rounded-lg font-semibold text-sm hover:border-gray-400 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Questions? Email us at{" "}
          <a href="mailto:hello@layziclicky.com" className="underline hover:text-gray-600">
            hello@layziclicky.com
          </a>
        </p>
      </div>
    </div>
  );
}
