import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-gray-400 hover:text-[--color-primary] transition-colors"
        >
          ← Products
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-black text-gray-900">Edit Product</h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
