"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Plus, X, Upload } from "lucide-react";
import type { Product, Variant } from "@prisma/client";

interface VariantInput {
  id?: string;
  name: string;
  value: string;
  images: string[];
  stock: number;
}

interface Props {
  product?: Product & { variants: Variant[] };
}

export function ProductForm({ product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [active, setActive] = useState(product?.active ?? true);
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [variants, setVariants] = useState<VariantInput[]>(
    product?.variants.map((v) => ({
      id: v.id,
      name: v.name,
      value: v.value,
      images: v.images,
      stock: v.stock,
    })) ?? []
  );

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) return null;
    const json = await res.json();
    return json.url as string;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(files.map(uploadImage));
    setImages((prev) => [...prev, ...urls.filter(Boolean)] as string[]);
    setUploading(false);
    e.target.value = "";
  };

  const handleVariantImageUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const urls = await Promise.all(files.map(uploadImage));
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? { ...v, images: [...v.images, ...urls.filter(Boolean)] as string[] }
          : v
      )
    );
    setUploading(false);
    e.target.value = "";
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      { name: "Color", value: "", images: [], stock: 99 },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantInput, value: string | string[] | number) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const body = { name, description, price, active, images, variants };

    const res = await fetch(
      isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error ?? "Failed to save product");
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <h2 className="font-black text-gray-900">Basic Information</h2>
        <Input
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Cute 3D Printed Dumpling Clicker"
        />
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="Describe your product..."
            className="w-full border-2 border-[--color-border] rounded-xl px-4 py-3 text-sm focus:border-[--color-primary] focus:outline-none resize-none transition-colors"
          />
        </div>
        <Input
          label="Price (USD)"
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="12.99"
        />
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 accent-[--color-primary]"
          />
          <span className="text-sm font-semibold text-gray-700">
            Active (visible in shop)
          </span>
        </label>
      </div>

      {/* Product images */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-black text-gray-900">Product Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 group">
              <Image
                src={url}
                alt={`Product image ${i + 1}`}
                fill
                className="object-cover"
                unoptimized={url.endsWith(".svg")}
              />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[--color-primary] transition-colors text-gray-400 hover:text-[--color-primary]">
            {uploading ? (
              <span className="text-xs">...</span>
            ) : (
              <>
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">Upload</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-black text-gray-900">Variants (optional)</h2>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 text-sm font-bold text-[--color-primary] hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </button>
        </div>

        {variants.length === 0 && (
          <p className="text-sm text-gray-400">
            No variants. Add variants for different colors, sizes, etc.
          </p>
        )}

        {variants.map((v, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-gray-700">
                Variant {i + 1}
              </h3>
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Type (e.g. Color)"
                value={v.name}
                onChange={(e) => updateVariant(i, "name", e.target.value)}
                placeholder="Color"
              />
              <Input
                label="Value (e.g. Pink)"
                value={v.value}
                onChange={(e) => updateVariant(i, "value", e.target.value)}
                placeholder="Pink"
              />
            </div>

            <Input
              label="Stock"
              type="number"
              min="0"
              value={v.stock}
              onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value))}
            />

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Variant Images
              </p>
              <div className="flex flex-wrap gap-3">
                {v.images.map((url, j) => (
                  <div key={j} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group">
                    <Image
                      src={url}
                      alt={`Variant ${i} image ${j}`}
                      fill
                      className="object-cover"
                      unoptimized={url.endsWith(".svg")}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateVariant(
                          i,
                          "images",
                          v.images.filter((_, k) => k !== j)
                        )
                      }
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[--color-primary] transition-colors text-gray-400 hover:text-[--color-primary]">
                  <Upload className="w-4 h-4 mb-1" />
                  <span className="text-xs font-semibold">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleVariantImageUpload(i, e)}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <Button type="submit" variant="primary" size="lg" loading={saving}>
          {isEdit ? "Save Changes" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
