"use client";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";

// UIOrder represents the fully joined order with nested objects from Supabase.
// This type assumes .select() includes all necessary relations (size, contact_info, etc.)

interface UIOrder {
  id?: string;
  status: string;
  total_price: number;
  created_at?: string;
  size: {
    id: string;
    name: string;
    price: number;
    dimensions: string;
  };
  additional_options: Array<{
    id: string;
    name: string;
    price: number;
  }>;
  delivery_option: {
    id: string;
    name: string;
    base_price_desc: string;
  };
  payment_method: {
    id: string;
    name: string;
  };
  company_delivery_cost: number;
  contact_info: {
    city: string;
    email: string;
    notes: string | null;
    phone: string;
    address: string;
    last_name: string;
    first_name: string;
    postal_code: string;
  };
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: rawOrders, error: fetchError } = await supabase.from(
          "orders"
        ).select(`
          *,
          size (*),
          delivery_option (*),
          payment_method (*),
          contact_info (*),
          order_additional_options:order_additional_options (
            additional_options:additional_options (*)
          )
        `);

        if (fetchError) {
          console.error("Supabase error:", fetchError);
          throw new Error("Błąd zapytania do bazy danych");
        }

        if (!rawOrders) {
          throw new Error("Brak danych z API");
        }

        console.log("Raw orders:", rawOrders);

        const processedOrders: UIOrder[] = [];

        for (const order of rawOrders as any[]) {
          try {
            const isValid =
              typeof order.size === "object" &&
              typeof order.contact_info === "object" &&
              typeof order.delivery_option === "object" &&
              typeof order.payment_method === "object" &&
              Array.isArray(order.order_additional_options);

            if (!isValid) {
              console.warn("Nieprawidłowe dane zamówienia:", order);
              continue;
            }

            const additionalOptions = order.order_additional_options
              .map((entry: any) => entry.additional_options)
              .filter((opt: any) => opt);

            processedOrders.push({
              ...order,
              additional_options: additionalOptions,
            } as UIOrder);
          } catch (e) {
            console.error("Błąd przetwarzania zamówienia:", order, e);
          }
        }

        setOrders(processedOrders);
      } catch (err) {
        console.error("Błąd podczas pobierania zamówień:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Wystąpił błąd podczas pobierania zamówień"
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[normalizedStatus as keyof typeof colors] || colors.default;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("pl-PL", {
      style: "currency",
      currency: "PLN",
    });
  };

  return (
    <AuthGuard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Zamówienia</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            Błąd: {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Brak zamówień do wyświetlenia
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Klient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Produkt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Cena
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id || index}
                    className={index % 2 === 0 ? "bg-card" : "bg-muted/5"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.id || `#${index + 1}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.contact_info.first_name}{" "}
                      {order.contact_info.last_name}
                      <br />
                      <span className="text-muted-foreground">
                        {order.contact_info.phone || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.size.name}
                      {order.additional_options.length > 0 && (
                        <span className="text-muted-foreground block">
                          + {order.additional_options.length} dodatki
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-primary hover:text-primary/80 transition-colors mr-2">
                        Szczegóły
                      </button>
                      <button className="text-red-500 hover:text-red-600 transition-colors">
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
