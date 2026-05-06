import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// Возвращаем стандартный относительный путь!
import "./globals.css"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI NUR Admin",
  description: "SaaS Platform Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F2F2F7]">
        {children}
      </body>
    </html>
  );
}