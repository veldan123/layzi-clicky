import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { ORDER_STATUS_LABELS } from "@/lib/utils";

const VALID_STATUSES = ["PENDING", "PACKING", "SHIPPED", "DELIVERED"];

const STATUS_MESSAGES: Record<string, { emoji: string; heading: string; body: string }> = {
  PACKING: {
    emoji: "📦",
    heading: "We're packing your order!",
    body: "Great news! Your order is now being carefully packed. We take extra care with every order so your Layzi Clicky arrives in perfect condition.",
  },
  SHIPPED: {
    emoji: "🚚",
    heading: "Your order is on its way!",
    body: "Your Layzi Clicky has been shipped and is heading your way via Singpost. Keep an eye out for delivery!",
  },
  DELIVERED: {
    emoji: "🎉",
    heading: "Your order has arrived!",
    body: "Your Layzi Clicky has been delivered! We hope you love clicking it as much as we loved making it.",
  },
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, notes } = await req.json();

  if (status && !VALID_STATUSES.includes(status)) {
    return Response.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await db.order.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
    },
    include: { items: true },
  });

  if (status && status !== "PENDING") {
    const info = STATUS_MESSAGES[status];
    const shortId = order.id.slice(-8).toUpperCase();
    const emailTo = EMAIL_FROM.includes("onboarding@resend.dev")
      ? process.env.ADMIN_EMAIL ?? order.customerEmail
      : order.customerEmail;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:40px 20px;background:#f9fafb;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#111;padding:24px 32px;">
      <p style="margin:0;color:#fff;font-size:18px;font-weight:900;letter-spacing:0.05em;">LAYZI CLICKY</p>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 4px;font-size:28px;">${info.emoji}</p>
      <h1 style="margin:8px 0 4px;font-size:20px;color:#111;">${info.heading}</h1>
      <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Order #${shortId}</p>
      <p style="margin:0 0 24px;color:#374151;font-size:14px;line-height:1.6;">
        Hi ${order.customerName},<br><br>${info.body}
      </p>
      <p style="margin:0;font-size:13px;color:#6b7280;">
        Questions? Email us at
        <a href="mailto:hello@layziclicky.com" style="color:#FF3D00;">hello@layziclicky.com</a>
      </p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">Made with ❤️ in Singapore · Layzi Clicky</p>
    </div>
  </div>
</body></html>`;

    resend.emails.send({
      from: EMAIL_FROM,
      to: emailTo,
      subject: `Order Update: ${ORDER_STATUS_LABELS[status]} #${shortId} — Layzi Clicky`,
      html,
    }).catch((err) => console.error("Status email failed:", err));
  }

  return Response.json({ order });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.valid) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: { include: { product: true, variant: true } } },
  });

  if (!order) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ order });
}
