import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { OrderConfirmationEmail } from "@/lib/emails/order-confirmation";
import React from "react";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    const orderId = pi.metadata?.orderId;

    console.log("[webhook] payment_intent.succeeded, orderId:", orderId);

    if (!orderId) {
      console.log("[webhook] no orderId in metadata, skipping");
      return Response.json({ received: true });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    console.log("[webhook] order found:", !!order);
    if (!order) return Response.json({ received: true });

    await db.order.update({
      where: { id: orderId },
      data: { status: "PACKING" },
    });

    const emailTo = EMAIL_FROM.includes("onboarding@resend.dev")
      ? process.env.ADMIN_EMAIL ?? order.customerEmail
      : order.customerEmail;

    console.log("[webhook] sending email — from:", EMAIL_FROM, "to:", emailTo);
    console.log("[webhook] RESEND_API_KEY set:", !!process.env.RESEND_API_KEY);

    try {
      const result = await resend.emails.send({
        from: EMAIL_FROM,
        to: emailTo,
        subject: `Order confirmed! #${order.id.slice(-8).toUpperCase()} — Layzi Clicky`,
        react: React.createElement(OrderConfirmationEmail, {
          customerName: order.customerName,
          orderId: order.id,
          items: order.items.map((i) => ({
            productName: i.productName,
            variantName: i.variantName,
            quantity: i.quantity,
            price: i.price,
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          total: order.total,
          shippingAddress: order.shippingAddress as {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postalCode: string;
            country: string;
          },
        }),
      });
      console.log("[webhook] email result:", JSON.stringify(result));
    } catch (emailErr) {
      console.error("[webhook] email error:", emailErr);
    }
  }

  return Response.json({ received: true });
}
