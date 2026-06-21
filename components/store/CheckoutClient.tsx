"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ShippingForm {
  name: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

function CheckoutForm({
  orderId,
  onSuccess,
}: {
  orderId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="font-bold text-lg mb-4">Payment Details</h3>
        <div className="p-4 border-2 border-[--color-border] rounded-xl focus-within:border-[--color-primary] transition-colors">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!stripe || !elements || submitting}
        loading={submitting}
      >
        {submitting ? "Processing..." : "Place Order 🎉"}
      </Button>

      <p className="text-xs text-center text-[--color-muted-foreground]">
        🔒 Secured by Stripe. Your payment info is never stored on our servers.
      </p>
    </form>
  );
}

export function CheckoutClient({
  stripePublishableKey,
}: {
  stripePublishableKey: string;
}) {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const cartTotal = total();

  const [stripePromise] = useState(() => loadStripe(stripePublishableKey));
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingForm>({
    defaultValues: { country: "US" },
  });

  useEffect(() => {
    if (items.length === 0) router.push("/cart");
  }, [items, router]);

  const onShippingSubmit = async (data: ShippingForm) => {
    setCreatingIntent(true);
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
          customer: { name: data.name, email: data.email },
          shipping: {
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to create order");

      setClientSecret(json.clientSecret);
      setOrderId(json.orderId);
      setStep("payment");
    } catch (err) {
      setIntentError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push(`/order-confirmation?orderId=${orderId}`);
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form column */}
        <div className="lg:col-span-3 space-y-8">
          {/* Shipping */}
          <div
            className={`bg-white rounded-2xl border p-6 ${
              step === "payment"
                ? "border-[--color-border] opacity-60"
                : "border-[--color-primary]"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-xl">
                1. Shipping Information
              </h2>
              {step === "payment" && (
                <button
                  onClick={() => setStep("shipping")}
                  className="text-sm font-semibold text-[--color-primary] hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {step === "payment" && shippingData ? (
              <div className="text-sm text-[--color-muted-foreground] space-y-1">
                <p className="font-semibold text-[--color-foreground]">
                  {shippingData.name}
                </p>
                <p>{shippingData.email}</p>
                <p>
                  {shippingData.line1}
                  {shippingData.line2 && `, ${shippingData.line2}`}
                </p>
                <p>
                  {shippingData.city}, {shippingData.state}{" "}
                  {shippingData.postalCode}
                </p>
                <p>{shippingData.country}</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onShippingSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    id="name"
                    placeholder="Jane Smith"
                    error={errors.name?.message}
                    {...register("name", { required: "Name is required" })}
                  />
                  <Input
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    error={errors.email?.message}
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                <Input
                  label="Address Line 1"
                  id="line1"
                  placeholder="123 Main St"
                  error={errors.line1?.message}
                  {...register("line1", { required: "Address is required" })}
                />
                <Input
                  label="Address Line 2 (optional)"
                  id="line2"
                  placeholder="Apt 4B"
                  {...register("line2")}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    id="city"
                    error={errors.city?.message}
                    {...register("city", { required: "City is required" })}
                  />
                  <Input
                    label="State / Province"
                    id="state"
                    error={errors.state?.message}
                    {...register("state", { required: "State is required" })}
                  />
                  <Input
                    label="Postal Code"
                    id="postalCode"
                    error={errors.postalCode?.message}
                    {...register("postalCode", {
                      required: "Postal code is required",
                    })}
                  />
                </div>
                <Input
                  label="Country"
                  id="country"
                  error={errors.country?.message}
                  {...register("country", { required: "Country is required" })}
                />

                {intentError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                    {intentError}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={creatingIntent}
                >
                  Continue to Payment
                </Button>
              </form>
            )}
          </div>

          {/* Payment */}
          {step === "payment" && clientSecret && orderId && (
            <div className="bg-white rounded-2xl border border-[--color-primary] p-6">
              <h2 className="font-black text-xl mb-6">2. Payment</h2>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "flat",
                    variables: {
                      colorPrimary: "#ff6b9d",
                      colorBackground: "#ffffff",
                      colorText: "#1a1a2e",
                      borderRadius: "12px",
                      fontFamily: "inherit",
                    },
                  },
                }}
              >
                <CheckoutForm orderId={orderId} onSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-[--color-border] p-6 sticky top-24">
            <h2 className="font-black text-lg mb-5">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}`}
                  className="flex gap-3"
                >
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#FFF0EB] flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized={item.image.endsWith(".svg")}
                    />
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#FF3D00] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{item.name}</p>
                    {item.variantLabel && (
                      <p className="text-xs text-[--color-muted-foreground]">
                        {item.variantLabel}
                      </p>
                    )}
                    <p className="text-sm font-black text-[--color-primary]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[--color-border] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[--color-muted-foreground]">
                  Subtotal
                </span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[--color-muted-foreground]">
                  Shipping
                </span>
                <span className="text-[--color-success] font-semibold">
                  FREE
                </span>
              </div>
              <div className="flex justify-between font-black text-lg pt-2 border-t border-[--color-border]">
                <span>Total</span>
                <span className="text-[--color-primary]">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
