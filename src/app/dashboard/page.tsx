"use client";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthGuard } from "@/components/AuthGuard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Package, Hourglass, HandCoins } from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: orders, error } = await supabase.from("orders").select("*");

        if (error) throw error;

        const totalOrders = orders?.length || 0;
        const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
        const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

        setStats({ totalOrders, pendingOrders, totalRevenue });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Ładowanie...</h1>
          <p className="mt-2 text-gray-600">Proszę czekać...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="p-6">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Witaj, {user?.email?.split("@")[0] || "Użytkowniku"}!</h1>
          <p className="text-muted-foreground">Oto przegląd Twojego panelu administracyjnego:</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-4xl mb-2 text-primary">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium mb-1">Wszystkie zamówienia</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-4xl mb-2 text-primary">
              <Hourglass className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium mb-1">Oczekujące</h3>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </div>

          <div className="bg-card p-6 rounded-lg border border-border">
            <div className="text-4xl mb-2 text-primary">
              <HandCoins className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-medium mb-1">Przychód</h3>
            <p className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString("pl-PL", {
                style: "currency",
                currency: "PLN",
              })}
            </p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold mb-4">Ostatnie aktywności</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-green-500">●</span>
              <p>System został zaktualizowany do najnowszej wersji</p>
              <span className="text-muted-foreground ml-auto">2 min temu</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-blue-500">●</span>
              <p>Nowe zamówienie zostało złożone</p>
              <span className="text-muted-foreground ml-auto">15 min temu</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-yellow-500">●</span>
              <p>Backup systemu został wykonany</p>
              <span className="text-muted-foreground ml-auto">1 godz temu</span>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
