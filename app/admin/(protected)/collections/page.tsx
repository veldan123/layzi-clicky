export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Plus, Pencil } from "lucide-react";
import { CollectionDeleteButton } from "@/components/admin/CollectionDeleteButton";

export default async function AdminCollectionsPage() {
  const collections = await db.collection.findMany({
    include: { products: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Collections</h1>
          <p className="text-sm text-gray-500 mt-1">{collections.length} collection{collections.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-2.5 text-sm font-bold rounded-xl hover:bg-[#FF3D00] transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Collection
        </Link>
      </div>

      {collections.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-2xl py-20 text-center">
          <p className="text-gray-400 font-medium">No collections yet</p>
          <Link href="/admin/collections/new" className="text-[#FF3D00] text-sm font-bold mt-2 inline-block hover:underline">
            Create your first collection →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Collection</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Products</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {collections.map((col) => (
                <tr key={col.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={col.heroImage || "/placeholder.svg"}
                          alt={col.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{col.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">/collections/{col.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-600">
                    {col.products.length} product{col.products.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      col.active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {col.active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/collections/${col.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit
                      </Link>
                      <CollectionDeleteButton id={col.id} name={col.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
