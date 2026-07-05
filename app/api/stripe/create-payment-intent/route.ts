import { NextRequest } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { calculateShipping } from "@/lib/shipping";
import { lookupStaticCode, calculateDiscount, CouponResult } from "@/lib/coupons";
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
  appliedCodes: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request", details: parsed.error.issues }, { status: 400 });
    }

    const { items, customer, shipping, appliedCodes = [] } = parsed.data;

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

    // Validate and resolve coupons server-side (deduplicated)
    const seen = new Set<string>();
    const validCoupons: CouponResult[] = [];

    for (const raw of appliedCodes) {
      const key = raw.toLowerCase().trim();
      if (seen.has(key)) continue;
      seen.add(key);

      const staticMatch = lookupStaticCode(raw);
      if (staticMatch) {
        validCoupons.push({ code: raw.toUpperCase(), ...staticMatch });
        continue;
      }

      const dbCoupon = await db.coupon.findUnique({ where: { code: raw.toUpperCase() } });
      if (dbCoupon && !dbCoupon.used) {
        validCoupons.push({ code: dbCoupon.code, type: "percentage", value: 10, label: "10% off" });
      }
    }

    const baseShipping = calculateShipping(shipping.country, subtotal);
    const { discountAmount, finalShipping } = calculateDiscount(subtotal, baseShipping, validCoupons);
    const total = subtotal - discountAmount + finalShipping;

    const order = await db.order.create({
      data: {
        customerEmail: customer.email,
        customerName: customer.name,
        customerPhone: customer.phone,
        shippingAddress: shipping,
        subtotal,
        shipping: finalShipping,
        discount: discountAmount,
        appliedCodes: validCoupons.map(c => c.code),
        total,
        items: { create: orderItems },
      },
    });

    // Mark any DB coupons as used
    for (const c of validCoupons) {
      const isStatic = !!lookupStaticCode(c.code);
      if (!isStatic) {
        await db.coupon.update({ where: { code: c.code }, data: { used: true } });
      }
    }

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
      shippingCost: finalShipping,
      discountAmount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("create-payment-intent error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
