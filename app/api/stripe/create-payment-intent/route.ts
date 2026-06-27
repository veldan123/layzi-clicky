import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { calculateShipping } from "@/lib/shipping";
import * as z from "zod";

const schema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.int().min(1),
    })
  ),
  customer: z.object({
    name: z.string().min(1),
    email: z.email(),
    phone: z.string().min(1),
  }),
  shipping: z.object({
    line1: z.string().min(1),
    line2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", details: parsed.error.issues }, { status: 400 });
    }

    const { items, customer, shipping } = parsed.data;

    const productIds = [...new Set(items.map((i) => i.productId))];
    const products = await db.product.findMany({
      where: { id: { in: productIds }, active: true },
      include: { variants: true },
    });

    let subtotal = 0;
    const orderItems: {
      productId: string;
      variantId?: string;
      productName: string;
      variantName?: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return Response.json({ error: `Product ${item.productId} not found` }, { status: 400 });
      }

      const variant = item.variantId
        ? product.variants.find((v) => v.id === item.variantId)
        : undefined;

      subtotal += product.price * item.quantity;

      orderItems.push({
        productId: product.id,
        variantId: variant?.id,
        productName: product.name,
        variantName: variant ? `${variant.name}: ${variant.value}` : undefined,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const shippingCost = calculateShipping(shipping.country, subtotal);
    const total = subtotal + shippingCost;

    const order = await db.order.create({
      data: {
        customerEmail: customer.email,
        customerName: customer.name,
        customerPhone: customer.phone,
        shippingAddress: shipping,
        subtotal,
        shipping: shippingCost,
        total,
        items: { create: orderItems },
      },
    });

    // Card-only payment intent — no Link, no wallets
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "sgd",
      payment_method_types: ["card"],
      metadata: { orderId: order.id },
    });

    await db.order.update({
      where: { id: order.id },
      data: { stripePaymentId: paymentIntent.id },
    });

    return Response.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      shippingCost,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("create-payment-intent error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
