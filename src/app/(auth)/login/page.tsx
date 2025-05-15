import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Logowanie do panelu
          </h2>
        </div>

        <LoginForm />

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            <Link
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Zapomniałeś hasła?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
