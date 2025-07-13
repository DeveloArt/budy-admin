import { supabase } from "@/lib/supabase/client";
import type { NextApiRequest, NextApiResponse } from "next";

function parseJsonFields<T>(obj: T, fields: (keyof T)[]): T {
  const result = { ...obj };
  for (const field of fields) {
    if (typeof result[field] === "string") {
      try {
        result[field] = JSON.parse(result[field] as string);
      } catch {
        console.warn(`Failed to parse field "${String(field)}":`, result[field]);
      }
    }
  }
  return result;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { status, size } = req.query;
    let query = supabase.from("orders").select("*");
    if (status) query = query.eq("status", status);
    if (size) query = query.eq("size", size);

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    const orders = (data ?? []).map((order) => parseJsonFields(order, ["size", "additional_options", "delivery_option", "payment_method", "contact_info"]));
    res.status(200).json({ orders });
  } catch {
    res.status(500).json({ error: "Unexpected server error" });
  }
}
