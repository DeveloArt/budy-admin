"use client";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState, useRef, useMemo } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { UIOrder } from "../../types/UIOrder";
import { TableHeaderRow } from "@/components/orders/TableHeaderRow";

function OrderRow({
  order,
  index,
  getStatusColor,
  formatDate,
  formatPrice,
}: {
  order: UIOrder;
  index: number;
  getStatusColor: (status: string) => string;
  formatDate: (dateString?: string) => string;
  formatPrice: (price: number) => string;
}) {
  return (
    <tr className={index % 2 === 0 ? "bg-card" : "bg-muted/5"}>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.id || `#${index + 1}`}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(order.created_at)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {order.contact_info.first_name} {order.contact_info.last_name}
        <br />
        <span className="text-muted-foreground">{order.contact_info.phone || "-"}</span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {order.size.name}
        {order.additional_options.length > 0 && <span className="text-muted-foreground block">+ {order.additional_options.length} dodatki</span>}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">{formatPrice(order.total_price)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <button className="text-primary hover:text-primary/80 transition-colors mr-2">Szczegóły</button>
        <button className="text-red-500 hover:text-red-600 transition-colors">Usuń</button>
      </td>
    </tr>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"created_at" | "status" | "size" | "total_price" | null>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [statusSortDirection, setStatusSortDirection] = useState<"asc" | "desc">("asc");
  const [productFilter, setProductFilter] = useState<string | null>(null);
  const [productSortDirection, setProductSortDirection] = useState<"asc" | "desc">("asc");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const productButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase.from("orders").select(`
            *,
            size,
            delivery_option,
            payment_method,
            contact_info
        `);

        // Status filter (SQL-side)
        if (statusFilter && statusFilter.toLowerCase() !== "all") {
          query = query.eq("status", statusFilter);
        }
        // Product/size filter (left on frontend for simplicity)
        const { data: rawOrders, error: fetchError } = await query;

        if (fetchError) {
          console.error("Supabase error:", fetchError);
          throw new Error("Błąd zapytania do bazy danych");
        }

        if (!rawOrders) {
          throw new Error("Brak danych z API");
        }

        // Parse JSON fields if needed
        const processedOrders: UIOrder[] = [];
        for (const order of rawOrders as UIOrder[]) {
          try {
            const size = typeof order.size === "string" ? JSON.parse(order.size) : order.size;
            const delivery_option = typeof order.delivery_option === "string" ? JSON.parse(order.delivery_option) : order.delivery_option;
            const payment_method = typeof order.payment_method === "string" ? JSON.parse(order.payment_method) : order.payment_method;
            const contact_info = typeof order.contact_info === "string" ? JSON.parse(order.contact_info) : order.contact_info;
            const additional_options = typeof order.additional_options === "string" ? JSON.parse(order.additional_options) : order.additional_options ?? [];

            processedOrders.push({
              ...order,
              size,
              delivery_option,
              payment_method,
              contact_info,
              additional_options,
            } as UIOrder);
          } catch (e) {
            console.error("Błąd przetwarzania zamówienia:", order, e);
          }
        }

        setOrders(processedOrders);
      } catch (err) {
        console.error("Błąd podczas pobierania zamówień:", err);
        setError(err instanceof Error ? err.message : "Wystąpił błąd podczas pobierania zamówień");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, statusFilter]);

  // Generate dynamic status and size lists
  const allStatuses = useMemo(() => Array.from(new Set(orders.map((o) => o.status).filter(Boolean))).sort(), [orders]);
  const allSizes = useMemo(() => Array.from(new Set(orders.map((o) => o.size?.name).filter(Boolean))).sort(), [orders]);

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

  // Frontend filtering by product/size
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const productMatch = !productFilter || order.size.name.toLowerCase() === productFilter.toLowerCase();
      return productMatch;
    });
  }, [orders, productFilter]);

  // Sorting (dynamic status and size order)
  const sortedOrders = useMemo(() => {
    const statusOrder = allStatuses;
    const sizeOrder = allSizes;

    return [...filteredOrders].sort((a, b) => {
      if (sortKey === "created_at") {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }
      if (sortKey === "total_price") {
        return sortDirection === "asc" ? a.total_price - b.total_price : b.total_price - a.total_price;
      }
      if (sortKey === "status") {
        const aIndex = statusOrder.findIndex((status) => status.toLowerCase() === a.status.toLowerCase());
        const bIndex = statusOrder.findIndex((status) => status.toLowerCase() === b.status.toLowerCase());
        return statusSortDirection === "asc" ? aIndex - bIndex : bIndex - aIndex;
      }
      if (sortKey === "size") {
        const aIndex = sizeOrder.findIndex((size) => size.toLowerCase() === a.size.name.toLowerCase());
        const bIndex = sizeOrder.findIndex((size) => size.toLowerCase() === b.size.name.toLowerCase());
        if (aIndex === bIndex) {
          const aAdd = a.additional_options.length;
          const bAdd = b.additional_options.length;
          return productSortDirection === "asc" ? aAdd - bAdd : bAdd - aAdd;
        }
        return productSortDirection === "asc" ? aIndex - bIndex : bIndex - aIndex;
      }
      return 0;
    });
  }, [filteredOrders, sortKey, sortDirection, statusSortDirection, productSortDirection, allStatuses, allSizes]);

  return (
    <AuthGuard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Zamówienia</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">Błąd: {error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Brak zamówień do wyświetlenia</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <TableHeaderRow
                  sortKey={sortKey ?? "created_at"}
                  sortDirection={sortDirection}
                  statusSortDirection={statusSortDirection}
                  productSortDirection={productSortDirection}
                  onSortDate={() => {
                    setSortKey("created_at");
                    setSortDirection((prev) => (sortKey === "created_at" ? (prev === "asc" ? "desc" : "asc") : "desc"));
                  }}
                  onSortStatus={() => {
                    setSortKey("status");
                    setStatusSortDirection((prev) => (sortKey === "status" ? (prev === "asc" ? "desc" : "asc") : "asc"));
                  }}
                  onSortProduct={() => {
                    setSortKey("size");
                    setProductSortDirection((prev) => (sortKey === "size" ? (prev === "asc" ? "desc" : "asc") : "asc"));
                  }}
                  onSortPrice={() => {
                    setSortKey("total_price");
                    setSortDirection((prev) => (sortKey === "total_price" ? (prev === "asc" ? "desc" : "asc") : "desc"));
                  }}
                  statusButtonRef={statusButtonRef}
                  showStatusDropdown={showStatusDropdown}
                  setShowStatusDropdown={setShowStatusDropdown}
                  allStatuses={allStatuses}
                  onStatusFilter={setStatusFilter}
                  statusFilter={statusFilter}
                  productButtonRef={productButtonRef}
                  showProductDropdown={showProductDropdown}
                  setShowProductDropdown={setShowProductDropdown}
                  allSizes={allSizes}
                  onProductFilter={setProductFilter}
                  productFilter={productFilter}
                />
              </thead>
              <tbody>
                {sortedOrders.map((order, index) => (
                  <OrderRow key={order.id || index} order={order} index={index} getStatusColor={getStatusColor} formatDate={formatDate} formatPrice={formatPrice} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
