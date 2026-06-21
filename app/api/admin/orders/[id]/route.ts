import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { resend, EMAIL_FROM } from "@/lib/resend";
import { OrderStatusUpdateEmail } from "@/lib/emails/order-status-update";
import { ORDER_STATUS_LABELS } from "@/lib/utils";
import React from "react";

const VALID_STATUSES = ["PENDING", "PACKING", "SHIPPED", "DELIVERED"];

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

  // Send status update email (only for statuses that have a customer-facing message)
  if (status && status !== "PENDING") {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: order.customerEmail,
      subject: `Order Update: ${ORDER_STATUS_LABELS[status]} — Layzi Clicky`,
      react: React.createElement(OrderStatusUpdateEmail, {
        customerName: order.customerName,
        orderId: order.id,
        newStatus: status,
      }),
    }).catch((err) => {
      console.error("Failed to send status email:", err);
    });
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

  if (!order) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ order });
}
