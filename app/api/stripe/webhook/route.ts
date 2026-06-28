import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { resend, EMAIL_FROM } from "@/lib/resend";

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
      const addr = order.shippingAddress as {
        line1: string; line2?: string; city: string;
        state?: string; postalCode: string; country: string;
      };
      const shortId = order.id.slice(-8).toUpperCase();
      const itemRows = order.items.map(i =>
        `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#111;font-size:14px;">
            ${i.productName}${i.variantName ? ` — ${i.variantName}` : ""} × ${i.quantity}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:700;font-size:14px;color:#111;">
            $${(i.price * i.quantity).toFixed(2)}
          </td>
        </tr>`
      ).join("");

      const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 20px;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#111;padding:24px 32px;">
      <p style="margin:0;color:#fff;font-size:18px;font-weight:900;letter-spacing:0.05em;">LAYZI CLICKY</p>
    </div>
    <div style="padding:32px;">
      <h1 style="margin:0 0 8px;font-size:22px;color:#111;">Order Confirmed! 🎉</h1>
      <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Hi ${order.customerName}, thank you for your order.</p>

      <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Order number</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:900;color:#111;">#${shortId}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        ${itemRows}
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Subtotal</td>
          <td style="padding:6px 0;text-align:right;font-size:14px;color:#111;">$${order.subtotal.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:14px;">Shipping</td>
          <td style="padding:6px 0;text-align:right;font-size:14px;color:#111;">${order.shipping === 0 ? "Free" : "$" + order.shipping.toFixed(2)}</td>
        </tr>
        <tr style="border-top:2px solid #e5e7eb;">
          <td style="padding:12px 0 0;font-weight:900;font-size:16px;color:#111;">Total</td>
          <td style="padding:12px 0 0;text-align:right;font-weight:900;font-size:16px;color:#FF3D00;">$${order.total.toFixed(2)} SGD</td>
        </tr>
      </table>

      <div style="border-top:1px solid #e5e7eb;padding-top:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Shipping to</p>
        <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
          ${order.customerName}<br>
          ${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}<br>
          ${addr.city} ${addr.postalCode}<br>
          ${addr.country}
        </p>
      </div>

      <p style="margin:0;font-size:13px;color:#6b7280;">
        We'll start printing your clicker right away. Questions? Email us at
        <a href="mailto:hello@layziclicky.com" style="color:#FF3D00;">hello@layziclicky.com</a>
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Made with ❤️ in Singapore · Layzi Clicky</p>
    </div>
  </div>
</body></html>`;

      const result = await resend.emails.send({
        from: EMAIL_FROM,
        to: emailTo,
        subject: `Order confirmed #${shortId} — Layzi Clicky`,
        html,
      });
      console.log("[webhook] email result:", JSON.stringify(result));
    } catch (emailErr) {
      console.error("[webhook] email error:", emailErr);
    }
  }

  return Response.json({ received: true });
}
