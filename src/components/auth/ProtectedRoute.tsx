"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jeśli dane są wczytywane, poczekaj
    if (loading) return;

    // Jeśli użytkownik nie jest zalogowany, przekieruj do strony logowania
    if (!user) {
      router.push("/login");
      return;
    }

    // Jeśli wymagana jest rola i użytkownik jej nie posiada, przekieruj
    if (requiredRole && requiredRole.length > 0) {
      const userRole = user.user_metadata?.role || "user";
      if (!requiredRole.includes(userRole)) {
        router.push("/dashboard"); // lub strona błędu dostępu
      }
    }
  }, [loading, user, router, requiredRole]);

  // Podczas ładowania, pokaż wskaźnik ładowania
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Jeśli użytkownik nie jest zalogowany, nie renderuj zawartości
  if (!user) {
    return null;
  }

  // Jeśli wymagana jest rola i użytkownik jej nie posiada, nie renderuj zawartości
  if (requiredRole && requiredRole.length > 0) {
    const userRole = user.user_metadata?.role || "user";
    if (!requiredRole.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}
