"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Store } from "lucide-react";
import { menuItems } from "@/constants/menu";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true); 
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <>
      <button className="lg:hidden fixed top-4 left-1 z-50 p-2 bg-primary text-white rounded-md" onClick={() => setIsCollapsed(!isCollapsed)}>
        {isCollapsed ? "☰" : "✕"}
      </button>

      <aside
        className={cn(
          "fixed h-screen bg-card border-r border-border transition-all duration-300 z-40",
          isCollapsed ? "-translate-x-full top-0 left-0" : "translate-x-0 top-2 left-3",
          "w-64 lg:translate-x-0 lg:top-0 lg:left-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 mb-8 px-2">
            <Store className="w-7 h-7 text-primary" />
            <h1 className="text-xl font-bold">Budy Admin</h1>
          </div>

          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg border border-border transition-colors",
                      "hover:bg-muted",
                      pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground"
                    )}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User info + logout */}
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

      {/* Tło przy otwartym sidebarze na mobile */}
      {!isCollapsed && <div className="fixed inset-0 bg-black/90 z-30 lg:hidden" onClick={() => setIsCollapsed(true)} />}
    </>
  );
}
