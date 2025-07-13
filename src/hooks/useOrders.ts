import { useEffect, useState } from "react";
import { UIOrder } from "@/types/UIOrder";

type UseOrdersParams = {
  status?: string;
  size?: string;
};

export function useOrders({ status, size }: UseOrdersParams) {
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (size) params.append("size", size);

        const res = await fetch(`/api/orders?${params.toString()}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Wystąpił błąd");
        }

        setOrders(json.orders || []);
      } catch (err) {
        console.error("Błąd w useOrders:", err);
        setError(err instanceof Error ? err.message : "Nieznany błąd");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status, size]);

  return { orders, loading, error };
}
