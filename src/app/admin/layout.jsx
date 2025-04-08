// src/app/admin/layout.jsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    // Verifica una bandera simple en localStorage (por ejemplo, "admin-auth")
    const isAuth = localStorage.getItem("admin-auth");
    if (!isAuth) {
      router.push("/admin/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-4 bg-gray-800 text-white">
        <h1 className="text-xl">Dashboard Admin</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
