"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { calculateShipping, shippingLabel } from "@/lib/shipping";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, ChevronRight, Package } from "lucide-react";

const COUNTRIES = [
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "TH", name: "Thailand" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "BN", name: "Brunei" },
  { code: "KH", name: "Cambodia" },
  { code: "LA", name: "Laos" },
  { code: "MM", name: "Myanmar" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "CN", name: "China" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "IN", name: "India" },
  { code: "BD", name: "Bangladesh" },
  { code: "LK", name: "Sri Lanka" },
  { code: "NP", name: "Nepal" },
  { code: "PK", name: "Pakistan" },
  { code: "MO", name: "Macau" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "IE", name: "Ireland" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "QA", name: "Qatar" },
  { code: "KW", name: "Kuwait" },
  { code: "BH", name: "Bahrain" },
  { code: "OM", name: "Oman" },
  { code: "IL", name: "Israel" },
  { code: "TR", name: "Turkey" },
  { code: "ZA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "EG", name: "Egypt" },
  { code: "KE", name: "Kenya" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
  { code: "GR", name: "Greece" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
];

interface ShippingForm {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors bg-white";

const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

const errorClass = "mt-1 text-xs text-red-500";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className={errorClass}>{message}</p>;
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
        {number}
      </span>
      <h2 className="font-bold text-base text-gray-900">{title}</h2>
    </div>
  );
}

const stripeElementStyle = {
  base: {
    fontSize: "15px",
    color: "#111111",
    fontFamily: "inherit",
    "::placeholder": { color: "#9ca3af" },
  },
  invalid: { color: "#ef4444" },
};

function StripeField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="w-full border border-gray-200 rounded-lg px-4 py-3.5 bg-white focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-colors">
        {children}
      </div>
    </div>
  );
}

function PaymentForm({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const card = elements.getElement(CardNumberElement);
    if (!card) { setSubmitting(false); return; }

    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StripeField label="Card Number">
        <CardNumberElement options={{ style: stripeElementStyle, showIcon: true }} />
      </StripeField>

      <div className="grid grid-cols-2 gap-4">
        <StripeField label="Expiry Date">
          <CardExpiryElement options={{ style: stripeElementStyle }} />
        </StripeField>
        <StripeField label="Security Code (CVC)">
          <CardCvcElement options={{ style: stripeElementStyle }} />
        </StripeField>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#FF3D00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
      >
        <Lock className="w-4 h-4" />
        {submitting ? "Processing payment…" : "Place Order"}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> SSL Secured</span>
        <span>·</span>
        <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Powered by Stripe</span>
      </div>
    </form>
  );
}

export function CheckoutClient({ stripePublishableKey }: { stripePublishableKey: string }) {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const cartTotal = total();

  const [stripePromise] = useState(() => loadStripe(stripePublishableKey));
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const orderIdRef = useRef<string | null>(null);
  const [step, setStep] = useState<"info" | "payment">("info");
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShippingForm>({ defaultValues: { country: "SG" } });

  const watchedCountry = watch("country") || "SG";
  const estimatedShipping = calculateShipping(watchedCountry, cartTotal);
  const estimatedTotal = cartTotal + estimatedShipping;

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items, router]);

  const onInfoSubmit = async (data: ShippingForm) => {
    setSubmitting(true);
    setIntentError(null);
    setShippingData(data);

    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          customer: { name: data.name, email: data.email, phone: data.phone },
          shipping: {
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: data.state || data.city,
            postalCode: data.postalCode,
            country: data.country,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create order");

      setClientSecret(json.clientSecret);
      setOrderId(json.orderId);
      orderIdRef.current = json.orderId;
      setStep("payment");
    } catch (err) {
      setIntentError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    window.location.href = `/order-confirmation?orderId=${orderIdRef.current}`;
  };

  if (items.length === 0) return null;

  const countryName = COUNTRIES.find(c => c.code === watchedCountry)?.name ?? watchedCountry;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-black text-lg tracking-tight text-gray-900">
            LAYZI CLICKY
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10">

          {/* Left — form */}
          <div className="space-y-6">
            {step === "info" ? (
              <form onSubmit={handleSubmit(onInfoSubmit)} className="space-y-6">

                {/* Contact */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <SectionLabel number="1" title="Contact Information" />
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                          className={`${inputClass} ${errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
                          placeholder="Jane Smith"
                          {...register("name", { required: "Full name is required" })}
                        />
                        <FieldError message={errors.name?.message} />
                      </div>
                      <div>
                        <label className={labelClass}>Email Address *</label>
                        <input
                          type="email"
                          className={`${inputClass} ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
                          placeholder="jane@example.com"
                          {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                          })}
                        />
                        <FieldError message={errors.email?.message} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <input
                        type="tel"
                        className={`${inputClass} ${errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
                        placeholder="+65 9123 4567"
                        {...register("phone", {
                          required: "Phone number is required",
                          minLength: { value: 6, message: "Enter a valid phone number" },
                        })}
                      />
                      <FieldError message={errors.phone?.message} />
                      <p className="mt-1.5 text-xs text-gray-400">For delivery updates only. We do not spam.</p>
                    </div>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <SectionLabel number="2" title="Shipping Address" />
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Country *</label>
                      <select
                        className={`${inputClass} ${errors.country ? "border-red-400" : ""}`}
                        {...register("country", { required: "Country is required" })}
                      >
                        {COUNTRIES.map(({ code, name }) => (
                          <option key={code} value={code}>{name} ({code})</option>
                        ))}
                      </select>
                      <FieldError message={errors.country?.message} />
                    </div>
                    <div>
                      <label className={labelClass}>Address Line 1 *</label>
                      <input
                        className={`${inputClass} ${errors.line1 ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
                        placeholder="Block / Street / Unit number"
                        {...register("line1", { required: "Address is required" })}
                      />
                      <FieldError message={errors.line1?.message} />
                    </div>
                    <div>
                      <label className={labelClass}>Address Line 2 <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                      <input
                        className={inputClass}
                        placeholder="Apartment, suite, floor"
                        {...register("line2")}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>City *</label>
                        <input
                          className={`${inputClass} ${errors.city ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
                          placeholder="Singapore"
                          {...register("city", { required: "City is required" })}
                        />
                        <FieldError message={errors.city?.message} />
                      </div>
                      <div>
                        <label className={labelClass}>Postal Code *</label>
                        <input
                          className={`${inputClass} ${errors.postalCode ? "border-red-400 focus:border-red-400 focus:ring-red-400" : ""}`}
                          placeholder="123456"
                          {...register("postalCode", { required: "Postal code is required" })}
                        />
                        <FieldError message={errors.postalCode?.message} />
                      </div>
                    </div>
                  </div>
                </div>

                {intentError && (
                  <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    <span className="mt-0.5">⚠️</span>
                    <span>{intentError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gray-900 text-white py-4 rounded-lg font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:bg-[#FF3D00] transition-colors disabled:opacity-50"
                >
                  {submitting ? "Please wait…" : (
                    <>Continue to Payment <ChevronRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Confirmed info summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-sm text-gray-900">Contact & Shipping</h2>
                    <button
                      onClick={() => setStep("info")}
                      className="text-xs font-semibold text-[#FF3D00] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  {shippingData && (
                    <div className="text-sm text-gray-600 space-y-1 leading-relaxed">
                      <p className="font-semibold text-gray-900">{shippingData.name}</p>
                      <p>{shippingData.email} · {shippingData.phone}</p>
                      <p className="pt-1 text-gray-500">
                        {shippingData.line1}{shippingData.line2 && `, ${shippingData.line2}`},&nbsp;
                        {shippingData.city} {shippingData.postalCode},&nbsp;
                        {COUNTRIES.find(c => c.code === shippingData.country)?.name ?? shippingData.country}
                      </p>
                    </div>
                  )}
                </div>

                {/* Payment */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <SectionLabel number="3" title="Payment Details" />
                  <p className="text-xs text-gray-400 mb-5 -mt-2">
                    Your card information is encrypted and never stored on our servers.
                  </p>
                  {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <PaymentForm clientSecret={clientSecret} onSuccess={handlePaymentSuccess} />
                    </Elements>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-sm text-gray-900">Order Summary</h2>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3 px-5 py-4">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized={item.image.endsWith(".svg")}
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                      {item.variantLabel && (
                        <p className="text-xs text-gray-400">{item.variantLabel}</p>
                      )}
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <div className="text-right">
                    {estimatedShipping === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      <span className="font-medium text-gray-900">{formatPrice(estimatedShipping)}</span>
                    )}
                    <p className="text-[11px] text-gray-400 mt-0.5">{shippingLabel(watchedCountry, cartTotal)}</p>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-base text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>{formatPrice(estimatedTotal)}</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Prices in USD · {countryName} shipping applied
                </p>
              </div>

              {/* Trust badges */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                    Printed fresh when you order
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    Secured by Stripe · PCI DSS Level 1
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              By placing your order you agree to our{" "}
              <Link href="/faq" className="underline hover:text-gray-600">terms & FAQ</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
