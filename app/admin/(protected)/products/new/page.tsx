import { ProductForm } from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Product — Admin" };

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-8">Add Product</h1>
      <ProductForm />
    </div>
  );
}
