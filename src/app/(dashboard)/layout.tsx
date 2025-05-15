"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { UserHeader } from "@/components/auth/UserHeader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row min-h-screen">
        <aside className="w-full md:w-64 bg-gray-800 text-white p-4">
          <h2 className="text-xl font-bold mb-4">Budy Admin</h2>

          <UserHeader />

          <nav className="mt-6">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/users"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Użytkownicy
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/settings"
                  className="block py-2 px-4 rounded hover:bg-gray-700"
                >
                  Ustawienia
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-grow p-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
