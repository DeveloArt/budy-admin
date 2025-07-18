"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useDebounce } from "@/hooks/useDebounce";
import { useNotificationState } from "@/hooks/useNotificationState";

import { AuthGuard } from "@/components/AuthGuard";
import { TableHeaderRow } from "@/components/orders/TableHeaderRow";
import { OrderRow } from "@/components/orders/OrderRow";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { UIOrder } from "@/types/UIOrder";
import { Search, X } from "lucide-react";

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [productFilter, setProductFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const [sortKey, setSortKey] = useState<"created_at" | "status" | "size" | "total_price" | null>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [statusSortDirection, setStatusSortDirection] = useState<"asc" | "desc">("asc");
  const [productSortDirection, setProductSortDirection] = useState<"asc" | "desc">("asc");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UIOrder | null>(null);
  const statusButtonRef = useRef<HTMLButtonElement>(null);
  const productButtonRef = useRef<HTMLButtonElement>(null);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);
  const { notificationsEnabled, setNotificationsEnabled } = useNotificationState();

  useEffect(() => {
    if (notificationsEnabled && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      const update = () => setPermissionStatus(Notification.permission);
      update();
      window.addEventListener("focus", update);
      return () => window.removeEventListener("focus", update);
    }
  }, []);

  const { orders, loading, error } = useOrders({
    status: statusFilter ?? undefined,
    size: productFilter ?? undefined,
    search: debouncedSearchTerm || undefined,
  });

  const allStatuses = useMemo(() => Array.from(new Set(orders.map((o) => o.status).filter(Boolean))).sort(), [orders]);
  const allSizes = useMemo(() => Array.from(new Set(orders.map((o) => o.size?.name).filter(Boolean))).sort(), [orders]);

  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase();
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };
    return colors[normalized as keyof typeof colors] || colors.default;
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

  const sortedOrders = useMemo(() => {
    const statusOrder = allStatuses;
    const sizeOrder = allSizes;

    return [...orders].sort((a, b) => {
      if (sortKey === "created_at") {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }
      if (sortKey === "total_price") {
        return sortDirection === "asc" ? a.total_price - b.total_price : b.total_price - a.total_price;
      }
      if (sortKey === "status") {
        const aIndex = statusOrder.findIndex((s) => s.toLowerCase() === a.status.toLowerCase());
        const bIndex = statusOrder.findIndex((s) => s.toLowerCase() === b.status.toLowerCase());
        return statusSortDirection === "asc" ? aIndex - bIndex : bIndex - aIndex;
      }
      if (sortKey === "size") {
        const aIndex = sizeOrder.findIndex((s) => s.toLowerCase() === a.size?.name.toLowerCase());
        const bIndex = sizeOrder.findIndex((s) => s.toLowerCase() === b.size?.name.toLowerCase());
        if (aIndex === bIndex) {
          const aAdd = a.additional_options?.length ?? 0;
          const bAdd = b.additional_options?.length ?? 0;
          return productSortDirection === "asc" ? aAdd - bAdd : bAdd - aAdd;
        }
        return productSortDirection === "asc" ? aIndex - bIndex : bIndex - aIndex;
      }
      return 0;
    });
  }, [orders, sortKey, sortDirection, statusSortDirection, productSortDirection, allStatuses, allSizes]);

  return (
    <AuthGuard>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Zamówienia</h1>
          <div className="flex items-center gap-4">
            {permissionStatus === "denied" && notificationsEnabled && (
              <p className="text-sm text-red-500 text-end">
                Powiadomienia są zablokowane w przeglądarce.
                <br />
                Włącz je ręcznie w ustawieniach strony.
              </p>
            )}
            <div className="flex items-center gap-2">
              <Switch className="" id="notifications" checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
              <label htmlFor="notifications" className="text-sm text-muted-foreground">
                Powiadomienia
              </label>
            </div>
            <div className="relative w-100">
              <Input placeholder="Szukaj zamówień..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-8" />
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
              {searchTerm && <X className="absolute right-2.5 top-3 h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setSearchTerm("")} />}
            </div>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">Błąd: {error}</div>}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
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
                {sortedOrders.map((order, index) => {
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <React.Fragment key={order.id || index}>
                      <OrderRow
                        order={order}
                        index={index}
                        getStatusColor={getStatusColor}
                        formatDate={formatDate}
                        formatPrice={formatPrice}
                        onShowDetails={() => setSelectedOrder(isSelected ? null : order)}
                      />
                      {isSelected && (
                        <tr className="bg-muted/10">
                          <td colSpan={7} className="p-4 animate-slideDown transition-all">
                            <div className="p-4 border border-border rounded-md bg-card">
                              <h2 className="text-lg font-semibold mb-2">
                                Szczegóły zamówienia <code className="font-normal text-base">#{order.id}</code>
                              </h2>
                              <p>
                                <strong>Data:</strong> {formatDate(order.created_at)}
                              </p>
                              <p>
                                <strong>Status:</strong> <span className={`${getStatusColor(order.status)} px-2 py-1 rounded-full`}>{order.status}</span>
                              </p>
                              <p>
                                <strong>Klient:</strong> {order.contact_info?.first_name} {order.contact_info?.last_name}
                              </p>
                              <p>
                                <strong>Telefon:</strong> {order.contact_info?.phone || "-"}
                              </p>
                              <p>
                                <strong>Email:</strong> {order.contact_info?.email || "-"}
                              </p>
                              <p>
                                <strong>Adres:</strong> {order.contact_info?.street} {order.contact_info?.house_number}, {order.contact_info?.postal_code} {order.contact_info?.city}
                              </p>
                              <p>
                                <strong>Dostawa:</strong> {order.delivery_option?.name}
                              </p>
                              <p>
                                <strong>Płatność:</strong> {order.payment_method?.name}
                              </p>
                              <p>
                                <strong>Rozmiar:</strong> {order.size?.name}
                              </p>
                              <p>
                                <strong>Dodatki:</strong> {order.additional_options?.length > 0 ? order.additional_options.map((o) => o.name).join(", ") : "Brak"}
                              </p>
                              <p>
                                <strong>Cena:</strong> {formatPrice(order.total_price)}
                              </p>
                              <button className="mt-4 px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded border transition-colors cursor-pointer" onClick={() => setSelectedOrder(null)}>
                                Zamknij
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
