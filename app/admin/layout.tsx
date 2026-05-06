'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Package, ClipboardList, LayoutDashboard, PlaySquare } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Пункты меню (добавили Stories)
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Главная' },
    { href: '/admin/stories', icon: PlaySquare, label: 'Stories' },
    { href: '/admin/catalog', icon: Package, label: 'Каталог' },
    { href: '/admin/leads', icon: ClipboardList, label: 'Заявки' },
    { href: '/admin/chats', icon: MessageCircle, label: 'Чаты' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex flex-col relative font-sans">
      
      {/* Главный контейнер для всех страниц. 
          Мы не ставим здесь 690px, потому что другие страницы (чаты) могут требовать другой ширины. 
          Ширину 690px мы зададим внутри самой Главной страницы. */}
      <main className="flex-1 w-full mx-auto flex flex-col pb-[100px]">
        {children}
      </main>

      {/* ЧЕРНОЕ ПЛАВАЮЩЕЕ МЕНЮ (340px всегда) */}
      <div className="fixed bottom-[10px] left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <nav className="pointer-events-auto bg-[#000000] w-[340px] h-[70px] rounded-[22px] shadow-xl flex items-center justify-between px-[17px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="flex flex-col items-center justify-center w-[50px] gap-1 active:scale-95 transition-transform"
              >
                {/* Иконка: Зеленая если активно, Серая если нет */}
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'text-[#8BFDA8]' : 'text-[#949494]'} 
                />
                {/* Текст: Белый если активно, Серый если нет */}
                <span className={`text-[11px] font-medium tracking-tight ${isActive ? 'text-[#FFFFFF]' : 'text-[#949494]'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
}