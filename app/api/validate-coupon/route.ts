import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { lookupStaticCode, CouponResult } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  const { code, alreadyApplied = [] } = await req.json();

  if (!code?.trim()) {
    return Response.json({ error: "Enter a discount code" }, { status: 400 });
  }

  const normalized = code.trim();

  if ((alreadyApplied as string[]).map((c: string) => c.toLowerCase()).includes(normalized.toLowerCase())) {
    return Response.json({ error: "You've already applied this code" }, { status: 400 });
  }

  // Check static codes first
  const staticMatch = lookupStaticCode(normalized);
  if (staticMatch) {
    const result: CouponResult = { code: normalized.toUpperCase(), ...staticMatch };
    return Response.json({ coupon: result });
  }

  // Check DB (unique generated coupons)
  const dbCoupon = await db.coupon.findUnique({ where: { code: normalized.toUpperCase() } });
  if (!dbCoupon) {
    return Response.json({ error: "Invalid discount code" }, { status: 404 });
  }
  if (dbCoupon.used) {
    return Response.json({ error: "This code has already been used" }, { status: 400 });
  }

  const result: CouponResult = {
    code: dbCoupon.code,
    type: "percentage",
    value: 10,
    label: "10% off",
  };
  return Response.json({ coupon: result });
}
