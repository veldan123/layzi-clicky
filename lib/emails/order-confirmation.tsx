import React from "react";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  productName: string;
  variantName?: string | null;
  quantity: number;
  price: number;
}

interface OrderConfirmationProps {
  customerName: string;
  orderId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export function OrderConfirmationEmail({
  customerName,
  orderId,
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
}: OrderConfirmationProps) {
  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: "#fffdf7",
        padding: "40px 20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ color: "#ff6b9d", fontSize: "28px", margin: "0 0 8px" }}>
          Layzi Clicky 🎉
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
          Your order is confirmed!
        </p>
      </div>

      {/* Greeting */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          border: "1px solid #f3f4f6",
        }}
      >
        <h2 style={{ color: "#1a1a2e", fontSize: "20px", marginTop: 0 }}>
          Hi {customerName}! 👋
        </h2>
        <p style={{ color: "#4b5563", lineHeight: "1.6" }}>
          Thank you so much for your order! We&apos;re thrilled to be clicking
          with you. Your order #{orderId.slice(-8).toUpperCase()} has been
          received and we&apos;ll get started on it right away.
        </p>
      </div>

      {/* Order Items */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          border: "1px solid #f3f4f6",
        }}
      >
        <h3 style={{ color: "#1a1a2e", marginTop: 0, fontSize: "16px" }}>
          Order Summary
        </h3>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: i < items.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
          >
            <div>
              <p style={{ margin: 0, color: "#1a1a2e", fontWeight: 600 }}>
                {item.productName}
                {item.variantName && ` — ${item.variantName}`}
              </p>
              <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "14px" }}>
                Qty: {item.quantity}
              </p>
            </div>
            <p style={{ margin: 0, color: "#1a1a2e", fontWeight: 600 }}>
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}

        <div
          style={{
            borderTop: "2px solid #f3f4f6",
            marginTop: "16px",
            paddingTop: "16px",
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}
          >
            <span style={{ color: "#6b7280" }}>Subtotal</span>
            <span style={{ color: "#1a1a2e" }}>{formatPrice(subtotal)}</span>
          </div>
          <div
            style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}
          >
            <span style={{ color: "#6b7280" }}>Shipping</span>
            <span style={{ color: "#1a1a2e" }}>
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: "18px",
            }}
          >
            <span style={{ color: "#1a1a2e" }}>Total</span>
            <span style={{ color: "#ff6b9d" }}>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "32px",
          marginBottom: "24px",
          border: "1px solid #f3f4f6",
        }}
      >
        <h3 style={{ color: "#1a1a2e", marginTop: 0, fontSize: "16px" }}>
          Shipping To
        </h3>
        <p style={{ color: "#4b5563", margin: 0, lineHeight: "1.8" }}>
          {shippingAddress.line1}
          <br />
          {shippingAddress.line2 && (
            <>
              {shippingAddress.line2}
              <br />
            </>
          )}
          {shippingAddress.city}, {shippingAddress.state}{" "}
          {shippingAddress.postalCode}
          <br />
          {shippingAddress.country}
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
        <p>
          Questions? Reply to this email or contact us at{" "}
          <a href="mailto:hello@lazyiclicky.com" style={{ color: "#ff6b9d" }}>
            hello@lazyclicky.com
          </a>
        </p>
        <p>
          Made with 💕 by Layzi Clicky
        </p>
      </div>
    </div>
  );
}
