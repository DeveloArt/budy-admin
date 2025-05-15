import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Funkcja middleware wykonywana przed każdym żądaniem
export async function middleware(request: NextRequest) {
  // Pobierz ścieżkę URL
  const path = request.nextUrl.pathname;

  // Określ ścieżki, które są publicznie dostępne
  const isPublicPath =
    path === "/login" || path === "/register" || path === "/forgot-password";

  // Utwórz odpowiedź, którą później możemy zmodyfikować
  let response = NextResponse.next();

  // Utwórz klienta Supabase do sprawdzenia sesji
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value;
      },
      set(name, value, options) {
        // Ustawiamy ciasteczka w odpowiedzi
        request.cookies.set(name, value);
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set(name, value, options);
      },
      remove(name, options) {
        // Usuwamy ciasteczka z odpowiedzi
        request.cookies.delete(name);
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set(name, "", { ...options, maxAge: 0 });
      },
    },
  });

  // Pobierz sesję użytkownika
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Przekierowanie niezalogowanych użytkowników do logowania
  if (!isPublicPath && !session) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  // Przekierowanie zalogowanych użytkowników z publicznych ścieżek do dashboardu
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// Konfiguracja określająca, na jakich ścieżkach middleware ma działać
export const config = {
  matcher: [
    // Dopasowanie wszystkich ścieżek prócz statycznych plików, API, callback i favicon
    "/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)",
  ],
};
