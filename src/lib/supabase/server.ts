import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // Nie próbujemy ustawiać ciasteczek po stronie serwera w trybie tylko do odczytu
            // cookieStore w Next.js jest tylko do odczytu w czasie renderowania
          } catch (error) {
            // Obsługa błędu, gdy cookieStore jest tylko do odczytu
            console.error("Błąd ustawiania ciasteczka:", error);
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 });
          } catch (error) {
            // Obsługa błędu, gdy cookieStore jest tylko do odczytu
            console.error("Błąd usuwania ciasteczka:", error);
          }
        },
      },
    }
  );
}
