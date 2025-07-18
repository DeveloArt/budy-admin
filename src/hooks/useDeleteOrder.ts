import { supabase } from "@/lib/supabase/client";

export const useDeleteOrder = () => {
  const deleteOrder = async (orderId: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    return { error };
  };

  return { deleteOrder };
};
