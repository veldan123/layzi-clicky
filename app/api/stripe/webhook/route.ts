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
    if (!orderId) return Response.json({ received: true });

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) return Response.json({ received: true });

    // Mark order as paid
    await db.order.update({
      where: { id: orderId },
      data: { status: "PACKING" },
    });

    // Send confirmation email — non-fatal if Resend isn't configured yet
    try {
      await resend.emails.send({
        from: EMAIL_FROM,
        to: order.customerEmail,
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
    } catch (emailErr) {
      console.error("Order confirmation email failed (non-fatal):", emailErr);
    }
  }

  return Response.json({ received: true });
}
