import type { Metadata } from "next";
import { CartPage } from "@/components/store/CartPage";

export const metadata: Metadata = { title: "Cart" };

export default function Cart() {
  return <CartPage />;
}
