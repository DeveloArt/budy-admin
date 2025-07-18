import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useNotificationState } from "./useNotificationState";
import { UIOrder } from "@/types/UIOrder";

export function useOrderNotifications() {
  const { notificationsEnabled } = useNotificationState();

  useEffect(() => {
    if (!notificationsEnabled || typeof Notification === "undefined") return;

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

          const name = [order.contact_info?.first_name, order.contact_info?.last_name].filter(Boolean).join(" ").trim();
          const size = order.size?.name;

          const body = name && size ? `Nowe zamówienie od ${name}: ${size}` : "Klient złożył nowe zamówienie.";

          const notification = new Notification("Nowe zamówienie!", {
            body,
            icon: "/icon-192.png",
            data: {
              url: "/orders",
            },
          });

          notification.onclick = () => {
            window.focus();
            window.location.href = "/orders";
          };
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [notificationsEnabled]);
}
