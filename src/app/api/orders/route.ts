import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-static";
export const revalidate = 0;

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const size = searchParams.get("size");
  const search = searchParams.get("search");

  let query = supabase.from("orders").select("*");

  if (status) query = query.eq("status", status);

  if (size) {
    try {
      const sizeObj = JSON.parse(size);
      if (sizeObj.id) {
        query = query.contains("size", { id: sizeObj.id });
      } else {
        query = query.contains("size", { name: size });
      }
    } catch {
      query = query.contains("size", { name: size });
    }
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let orders = (data ?? []).map((order) => parseJsonFields(order, ["size", "delivery_option", "payment_method", "contact_info", "additional_options"]));

  if (search) {
    const term = search.toLowerCase();
    orders = orders.filter((order) => {
      const orderString = JSON.stringify(order).toLowerCase();
      return orderString.includes(term);
    });
  }

  return NextResponse.json({ orders });
}
