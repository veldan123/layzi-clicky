"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function CollectionDeleteButton({ id, name }: { id: string; name: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Delete collection "${name}"? This cannot be undone.`)) return;
    setLoading(true);
    await fetch(`/api/admin/collections/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3 h-3" />
      {loading ? "..." : "Delete"}
    </button>
  );
}
