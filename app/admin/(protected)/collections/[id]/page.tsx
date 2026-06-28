import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { CollectionForm } from "@/components/admin/CollectionForm";

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [collection, allProducts] = await Promise.all([
    db.collection.findUnique({
      where: { id },
      include: { products: { orderBy: { sortOrder: "asc" } } },
    }),
    db.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, images: true, price: true },
    }),
  ]);

  if (!collection) notFound();

  const initialData = {
    id: collection.id,
    name: collection.name,
    description: collection.description ?? "",
    heroImage: collection.heroImage,
    active: collection.active,
    sortOrder: collection.sortOrder,
    productIds: collection.products.map(p => p.productId),
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/collections" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Collections
        </Link>
        <h1 className="text-2xl font-black text-gray-900">Edit Collection</h1>
        <p className="text-sm text-gray-500 mt-1">{collection.name}</p>
      </div>

      <CollectionForm mode="edit" initialData={initialData} allProducts={allProducts} />
    </div>
  );
}
