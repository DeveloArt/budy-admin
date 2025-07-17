import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { UIOrder } from "@/types/UIOrder";
import { useRouter } from "next/navigation";

export function useOrderNotifications({ enabled, onNewOrder }: { enabled: boolean; onNewOrder?: (order: UIOrder) => void }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled || typeof Notification === "undefined") return;

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          const order = payload.new as UIOrder;
          if (Notification.permission === "granted") {
            const name = [order.contact_info?.first_name, order.contact_info?.last_name].filter(Boolean).join(" ").trim();

            const size = order.size?.name;

            const body = name && size ? `Nowe zamówienie od ${name}: ${size}` : "Klient złożył nowe zamówienie.";

            const notification = new Notification("Nowe zamówienie!", {
              body,
            });

            notification.onclick = () => {
              window.focus();
              router.push("/orders");
            };
          }

          onNewOrder?.(order);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, onNewOrder, router]);
}
