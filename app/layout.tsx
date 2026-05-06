import type { Metadata } from "next";
// Подключаем Montserrat из Google Fonts
import { Montserrat } from "next/font/google";
import "./globals.css";

// Настраиваем шрифт
const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"], // Загружаем нужные толщины
});

export const metadata: Metadata = {
  title: "AI NUR Admin",
  description: "SaaS Platform Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Применяем переменную шрифта ко всему HTML
    <html lang="ru" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F2F2F7]">
        {children}
      </body>
    </html>
  );
}