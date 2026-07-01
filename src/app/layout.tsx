import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/i18n/context";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CEMAC Summit 2026 — Management Platform",
  description: "Management platform for the CEMAC Data Center, Energy & AI Infrastructure Summit 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} h-full antialiased`}>
      <body className="h-full font-sans">
        <AuthProvider>
          <I18nProvider>
            <StoreProvider>{children}</StoreProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
