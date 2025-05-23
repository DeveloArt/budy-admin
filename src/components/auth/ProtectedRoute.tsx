"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jeśli dane są wczytywane, poczekaj
    if (loading) return;

    // Jeśli użytkownik nie jest zalogowany, przekieruj do strony logowania
    if (!user) {
      router.push("/login");
    }
  }, [loading, user, router]);

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

  return <>{children}</>;
}
