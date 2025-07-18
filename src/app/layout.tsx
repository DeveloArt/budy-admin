import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { Providers } from "@/components/providers/Providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import NotificationListener from "@/components/NotificationListener";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budy Admin",
  description: "Panel administracyjny dla systemu Budy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#495057" />
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ServiceWorkerRegister />
          <NotificationListener />
          <div className="relative min-h-screen bg-background">
            <div className="relative min-h-screen bg-background">
              <Sidebar />
              <main className="lg:pl-64 overflow-x-hidden min-h-screen">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
