import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budy Admin",
  description: "Panel administracyjny dla systemu Budy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen bg-background">
            {/* Sidebar z absolutnym pozycjonowaniem i stałą szerokością */}
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
