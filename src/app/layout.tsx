import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import GameShell from "@/components/layout/GameShell";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "جابلقابیز - امپراتوری کسب‌وکار",
  description: "از هیچ شروع کن، کسب‌وکار بساز، تجارت کن، رقابت کن و بازار رو تصاحب کن.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${geistMono.variable} antialiased`}>
        <GameShell>{children}</GameShell>
      </body>
    </html>
  );
}
