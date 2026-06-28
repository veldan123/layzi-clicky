"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X, ChevronUp, ChevronDown } from "lucide-react";

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
}

interface CollectionData {
  id?: string;
  name: string;
  description: string;
  heroImage: string;
  active: boolean;
  sortOrder: number;
  productIds: string[];
}

interface Props {
  initialData?: CollectionData;
  allProducts: Product[];
  mode: "new" | "edit";
}

export function CollectionForm({ initialData, allProducts, mode }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialData?.name ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? "");
  const [active, setActive] = useState(initialData?.active ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [productIds, setProductIds] = useState<string[]>(initialData?.productIds ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const json = await res.json();
    if (json.url) setHeroImage(json.url);
    setUploading(false);
  };

  const toggleProduct = (id: string) => {
    setProductIds(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");

    const payload = { name, description, heroImage, active, sortOrder, productIds };
    const url = mode === "new" ? "/api/admin/collections" : `/api/admin/collections/${initialData?.id}`;
    const method = mode === "new" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Something went wrong");
      setSaving(false);
      return;
    }

    router.push("/admin/collections");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-bold text-gray-900">Collection Details</h2>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Name *</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Summer Drop"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="A short description shown on the collections page..."
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Display Order</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={sortOrder}
                onChange={e => setSortOrder(Number(e.target.value))}
                className="w-20 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-900 focus:outline-none focus:border-gray-400 transition-colors text-center"
              />
              <div className="flex flex-col gap-1">
                <button type="button" onClick={() => setSortOrder(s => s - 1)} className="p-0.5 text-gray-400 hover:text-gray-700">
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setSortOrder(s => s + 1)} className="p-0.5 text-gray-400 hover:text-gray-700">
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Lower = shows first</p>
          </div>

          <div className="flex items-center gap-3 pt-5">
            <button
              type="button"
              onClick={() => setActive(a => !a)}
              className={`relative w-10 h-6 rounded-full transition-colors ${active ? "bg-green-500" : "bg-gray-200"}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${active ? "left-5" : "left-1"}`} />
            </button>
            <span className="text-sm font-medium text-gray-700">{active ? "Active (visible to customers)" : "Hidden"}</span>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-bold text-gray-900">Hero Image</h2>
        <p className="text-xs text-gray-500">This image appears in the homepage hero carousel and on the collections page.</p>

        {heroImage && heroImage !== "/placeholder.svg" ? (
          <div className="relative w-48 aspect-square rounded-xl overflow-hidden border border-gray-200">
            <Image src={heroImage} alt="Hero" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={() => setHeroImage("")}
              className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="w-48 aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">Upload image</span>
              </>
            )}
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>

      {/* Products */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900">Products</h2>
            <p className="text-xs text-gray-500 mt-0.5">{productIds.length} selected</p>
          </div>
          {productIds.length > 0 && (
            <button type="button" onClick={() => setProductIds([])} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
              Clear all
            </button>
          )}
        </div>

        {allProducts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No products available. <a href="/admin/products/new" className="text-[#FF3D00] hover:underline">Add products first →</a></p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
            {allProducts.map(p => {
              const selected = productIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProduct(p.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors ${
                    selected ? "border-[#FF3D00] bg-[#FFF0EB]" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={p.images[0] ?? "/placeholder.svg"} alt={p.name} width={32} height={32} className="w-full h-full object-cover" unoptimized />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${selected ? "text-[#FF3D00]" : "text-gray-800"}`}>{p.name}</p>
                    <p className="text-[11px] text-gray-400">${p.price.toFixed(2)}</p>
                  </div>
                  <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    selected ? "border-[#FF3D00] bg-[#FF3D00]" : "border-gray-300"
                  }`}>
                    {selected && <span className="text-white text-[10px] font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#111111] text-white px-6 py-2.5 text-sm font-bold rounded-xl hover:bg-[#FF3D00] transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : mode === "new" ? "Create Collection" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/collections")}
          className="px-6 py-2.5 text-sm font-bold text-gray-600 border border-gray-200 rounded-xl hover:border-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
