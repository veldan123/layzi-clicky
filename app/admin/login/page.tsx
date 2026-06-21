import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Login — Layzi Clicky" };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[--color-primary]">
            Layzi Clicky
          </h1>
          <p className="text-gray-500 mt-2 font-semibold">Admin Dashboard</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
