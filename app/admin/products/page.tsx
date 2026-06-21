import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { ProductDeleteButton } from "@/components/admin/ProductDeleteButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Products — Admin" };

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-[--color-primary] text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[--color-primary-dark] transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-semibold mb-4">No products yet</p>
            <Link
              href="/admin/products/new"
              className="text-[--color-primary] font-bold hover:underline"
            >
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-pink-50 flex-shrink-0">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      unoptimized={product.images[0].endsWith(".svg")}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      🎯
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {product.name}
                    </p>
                    {!product.active && (
                      <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {product.variants.length > 0
                      ? `${product.variants.length} variant${product.variants.length !== 1 ? "s" : ""}`
                      : "No variants"}{" "}
                    · Slug: {product.slug}
                  </p>
                </div>

                <p className="font-black text-sm text-[--color-primary]">
                  {formatPrice(product.price)}
                </p>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-xs font-bold text-gray-500 hover:text-[--color-primary] transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
                  >
                    Edit
                  </Link>
                  <ProductDeleteButton productId={product.id} productName={product.name} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
