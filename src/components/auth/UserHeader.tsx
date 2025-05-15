"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UserHeader() {
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col items-center border-b border-gray-700 pb-4">
      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
        {user.email?.substring(0, 2).toUpperCase() || "U"}
      </div>
      <div className="mt-2 text-center">
        <p className="font-medium">{user.email}</p>
        <p className="text-xs text-gray-400">
          {user.user_metadata?.role || "Użytkownik"}
        </p>
      </div>
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="mt-3 text-sm px-4 py-1 bg-gray-700 hover:bg-gray-600 rounded-full"
      >
        {isLoggingOut ? "Wylogowywanie..." : "Wyloguj się"}
      </button>
    </div>
  );
}
