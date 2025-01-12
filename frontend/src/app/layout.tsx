"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {!isHomePage && (
            <>
              <Navbar />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-9rem)] max-h-[calc(100vh-9rem)] mt-10">
                {children}
              </div>
            </>
          )}
          {isHomePage && <>{children}</>}
        </AuthProvider>
      </body>
    </html>
  );
}
