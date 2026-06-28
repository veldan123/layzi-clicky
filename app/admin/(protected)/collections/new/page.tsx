import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { CollectionForm } from "@/components/admin/CollectionForm";

export default async function NewCollectionPage() {
  const allProducts = await db.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, images: true, price: true },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/collections" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Collections
        </Link>
        <h1 className="text-2xl font-black text-gray-900">New Collection</h1>
      </div>

      <CollectionForm mode="new" allProducts={allProducts} />
    </div>
  );
}
