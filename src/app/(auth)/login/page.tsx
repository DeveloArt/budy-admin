"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Ładowanie...</h1>
          <p className="mt-2 text-gray-600">Proszę czekać...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Logowanie do panelu
          </CardTitle>
          <CardDescription className="text-center">
            Wprowadź swoje dane aby się zalogować
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm">
              <Link
                href="#"
                className="text-primary hover:text-primary/90 transition-colors"
              >
                Zapomniałeś hasła?
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
