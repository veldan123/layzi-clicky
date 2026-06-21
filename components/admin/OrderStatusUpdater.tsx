"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";

const STATUSES = ["PENDING", "PACKING", "SHIPPED", "DELIVERED"] as const;

interface Props {
  orderId: string;
  currentStatus: string;
  notes: string;
}

export function OrderStatusUpdater({ orderId, currentStatus, notes }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState(notes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes: note }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error ?? "Failed to save");
    }
    setSaving(false);
  };

  const changed = status !== currentStatus || note !== notes;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="font-black text-gray-900 mb-4">Order Status</h2>

      <div className="space-y-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
              status === s
                ? "border-[--color-primary] bg-[--color-primary-light] text-[--color-primary]"
                : "border-gray-100 hover:border-gray-200 text-gray-600"
            }`}
          >
            <span>{ORDER_STATUS_LABELS[s]}</span>
            {status === s && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[s]}`}
              >
                Selected
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Internal Notes (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="e.g., packed in pink box, tracking: 1Z999AA..."
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[--color-primary] focus:outline-none resize-none transition-colors"
        />
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl mb-4 font-medium">
          {error}
        </p>
      )}

      {saved && (
        <p className="text-xs text-green-600 bg-green-50 p-3 rounded-xl mb-4 font-medium">
          ✅ Saved! Status email sent to customer.
        </p>
      )}

      <Button
        variant="primary"
        size="md"
        className="w-full"
        onClick={handleSave}
        loading={saving}
        disabled={!changed}
      >
        Save Changes
      </Button>
    </div>
  );
}
