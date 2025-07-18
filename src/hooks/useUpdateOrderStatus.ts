import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export const useUpdateOrderStatus = () => {
  const [error, setError] = useState<Error | null>(null);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);

    setError(error);
    return { error };
  };

  return { updateStatus, error };
};
