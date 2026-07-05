export interface CouponResult {
  code: string;
  type: "percentage" | "shipping";
  value: number;
  label: string;
}

const STATIC_CODES: Record<string, Omit<CouponResult, "code">> = {
  "clicky20!":   { type: "percentage", value: 20, label: "20% off" },
  "clickymail!": { type: "shipping",   value: 0,  label: "Free shipping" },
  "clicky50!":   { type: "percentage", value: 50, label: "50% off" },
};

export function lookupStaticCode(raw: string): Omit<CouponResult, "code"> | null {
  return STATIC_CODES[raw.toLowerCase().trim()] ?? null;
}

export function calculateDiscount(
  subtotal: number,
  shipping: number,
  coupons: CouponResult[]
): { discountAmount: number; finalShipping: number } {
  const pct = coupons
    .filter(c => c.type === "percentage")
    .reduce((sum, c) => sum + c.value, 0);
  const hasFreeShipping = coupons.some(c => c.type === "shipping");

  const discountAmount = Math.min((subtotal * pct) / 100, subtotal);
  const finalShipping = hasFreeShipping ? 0 : shipping;

  return { discountAmount, finalShipping };
}

export function generateCouponCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
