"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart2, Package, User, LogOut, Store } from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: <BarChart2 className="w-5 h-5" /> },
  { href: "/orders", label: "Zamówienia", icon: <Package className="w-5 h-5" /> },
  { href: "/profile", label: "Profil", icon: <User className="w-5 h-5" /> },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <>
      {/* Przycisk do pokazywania/ukrywania na mobilnych */}
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "☰" : "✕"}
      </button>

      {/* Sidebar */}
      <aside className={cn("fixed top-0 left-0 h-screen bg-card border-r border-border transition-all duration-300 z-40", isCollapsed ? "-translate-x-full" : "translate-x-0", "lg:translate-x-0", isCollapsed ? "w-0" : "w-64")}>
        <div className="flex flex-col h-full p-4">
          {/* Logo/Nazwa */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <Store className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold">Budy Admin</h1>
          </div>

          {/* Menu */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={cn("flex items-center gap-3 px-3 py-2 rounded-lg border border-border transition-colors", "hover:bg-muted", pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground")}>
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Profil użytkownika */}
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">{user?.email?.[0]?.toUpperCase() || "?"}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={signOut} className="w-full mt-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition-colors text-left flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              <span>Wyloguj się</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay na mobilnych */}
      {!isCollapsed && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsCollapsed(true)} />}
    </>
  );
}
