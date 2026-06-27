// Singpost Airmail zone-based rates (USD)
// Free on orders $50+

const ASEAN = new Set(["BN","ID","KH","LA","MM","MY","PH","TH","VN"]);
const ASIA_PACIFIC = new Set(["AU","BD","CN","HK","IN","JP","KR","LK","MO","NP","NZ","PK","TW"]);

export type ShippingZone = "sg" | "asean" | "asia_pacific" | "rest_of_world";

export function getShippingZone(countryCode: string): ShippingZone {
  const c = countryCode.toUpperCase().trim();
  if (c === "SG") return "sg";
  if (ASEAN.has(c)) return "asean";
  if (ASIA_PACIFIC.has(c)) return "asia_pacific";
  return "rest_of_world";
}

export function calculateShipping(countryCode: string, subtotal: number): number {
  if (subtotal >= 50) return 0;
  const zone = getShippingZone(countryCode);
  switch (zone) {
    case "sg":             return 2;
    case "asean":          return 5;
    case "asia_pacific":   return 8;
    case "rest_of_world":  return 12;
  }
}

export function shippingLabel(countryCode: string, subtotal: number): string {
  if (subtotal >= 50) return "Free — orders over $50";
  const zone = getShippingZone(countryCode);
  switch (zone) {
    case "sg":             return "Singpost Standard — $2.00";
    case "asean":          return "Singpost Airmail — $5.00";
    case "asia_pacific":   return "Singpost Airmail — $8.00";
    case "rest_of_world":  return "Singpost Airmail — $12.00";
  }
}
