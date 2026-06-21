import { db } from "@/lib/db";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Admin" };

export default async function AdminDashboard() {
  const [
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalProducts,
    recentOrders,
  ] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { status: "PENDING" } }),
    db.order.aggregate({ _sum: { total: true } }),
    db.product.count({ where: { active: true } }),
    db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
  ]);

  const revenue = totalRevenue._sum.total ?? 0;

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      color: "bg-blue-50 text-blue-700",
      emoji: "📦",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      color: "bg-amber-50 text-amber-700",
      emoji: "⏳",
    },
    {
      label: "Total Revenue",
      value: formatPrice(revenue),
      color: "bg-green-50 text-green-700",
      emoji: "💰",
    },
    {
      label: "Active Products",
      value: totalProducts,
      color: "bg-purple-50 text-purple-700",
      emoji: "🎯",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-gray-900 mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, color, emoji }) => (
          <div
            key={label}
            className={`rounded-2xl p-5 ${color} bg-opacity-60`}
          >
            <div className="text-2xl mb-2">{emoji}</div>
            <p className="text-2xl font-black">{value}</p>
            <p className="text-sm font-semibold opacity-70 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-[--color-primary] hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-semibold">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-bold text-sm text-gray-900">
                    #{order.id.slice(-8).toUpperCase()} — {order.customerName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}{" "}
                    · {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-black text-sm text-[--color-primary]">
                    {formatPrice(order.total)}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      order.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : order.status === "PACKING"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "SHIPPED"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
