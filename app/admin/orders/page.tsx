import { db } from "@/lib/db";
import Link from "next/link";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Orders — Admin" };

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1");
  const limit = 20;

  const where = status ? { status: status as "PENDING" | "PACKING" | "SHIPPED" | "DELIVERED" } : {};

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.order.count({ where }),
  ]);

  const statuses = ["", "PENDING", "PACKING", "SHIPPED", "DELIVERED"];
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-6">Orders</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/orders?status=${s}` : "/admin/orders"}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              (s === "" && !status) || s === status
                ? "bg-[--color-primary] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[--color-primary] hover:text-[--color-primary]"
            }`}
          >
            {s === "" ? "All" : ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Order", "Customer", "Items", "Total", "Status", "Date", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-bold text-sm text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-sm text-gray-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-4 font-black text-sm text-[--color-primary]">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs font-bold text-[--color-primary] hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
              {total}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page - 1}`}
                  className="px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-lg hover:border-[--color-primary] hover:text-[--color-primary] transition-colors"
                >
                  ← Prev
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/orders?${status ? `status=${status}&` : ""}page=${page + 1}`}
                  className="px-3 py-1.5 text-sm font-semibold border border-gray-200 rounded-lg hover:border-[--color-primary] hover:text-[--color-primary] transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
