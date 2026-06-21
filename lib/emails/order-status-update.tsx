import React from "react";
import { ORDER_STATUS_LABELS } from "@/lib/utils";

interface OrderStatusUpdateProps {
  customerName: string;
  orderId: string;
  newStatus: string;
  trackingNumber?: string;
}

const STATUS_MESSAGES: Record<string, { emoji: string; heading: string; body: string }> = {
  PACKING: {
    emoji: "📦",
    heading: "We're packing your order!",
    body: "Great news! Your order is now being carefully packed by our team. We want your Layzi Clicky to arrive in perfect condition, so we take extra care with every order.",
  },
  SHIPPED: {
    emoji: "🚚",
    heading: "Your order is on its way!",
    body: "Your Layzi Clicky has been shipped and is heading your way! Keep an eye out for delivery. If a tracking number is available, you'll find it below.",
  },
  DELIVERED: {
    emoji: "🎉",
    heading: "Your order has arrived!",
    body: "Your Layzi Clicky has been delivered! We hope you love clicking it as much as we loved making it. Feel free to share photos — we'd love to see it in action!",
  },
};

export function OrderStatusUpdateEmail({
  customerName,
  orderId,
  newStatus,
  trackingNumber,
}: OrderStatusUpdateProps) {
  const statusInfo = STATUS_MESSAGES[newStatus] ?? {
    emoji: "✨",
    heading: `Order status updated to ${ORDER_STATUS_LABELS[newStatus] ?? newStatus}`,
    body: "Your order status has been updated. Thank you for your patience!",
  };

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
          Layzi Clicky {statusInfo.emoji}
        </h1>
        <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
          Order #{orderId.slice(-8).toUpperCase()} Update
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "16px",
          padding: "32px",
          border: "1px solid #f3f4f6",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ color: "#1a1a2e", fontSize: "20px", marginTop: 0 }}>
          Hi {customerName}! 👋
        </h2>
        <h3 style={{ color: "#ff6b9d", fontSize: "18px" }}>
          {statusInfo.heading}
        </h3>
        <p style={{ color: "#4b5563", lineHeight: "1.6" }}>{statusInfo.body}</p>

        {trackingNumber && (
          <div
            style={{
              backgroundColor: "#fdf4ff",
              borderRadius: "12px",
              padding: "16px",
              marginTop: "16px",
            }}
          >
            <p style={{ margin: 0, color: "#7c3aed", fontWeight: 600 }}>
              📍 Tracking Number: {trackingNumber}
            </p>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
        <p>
          Questions? Reply to this email anytime.
        </p>
        <p>Made with 💕 by Layzi Clicky</p>
      </div>
    </div>
  );
}
