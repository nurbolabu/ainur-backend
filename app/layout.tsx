'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Package, ClipboardList, Settings, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Список пунктов меню
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Главная' },
    { href: '/admin/chats', icon: MessageCircle, label: 'Чаты' },
    { href: '/admin/catalog', icon: Package, label: 'Каталог' },
    { href: '/admin/leads', icon: ClipboardList, label: 'Заявки' },
    { href: '/admin/settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex flex-col relative font-sans text-[#000000]">
      
      {/* ГЛАВНЫЙ КОНТЕЙНЕР ДЛЯ КОНТЕНТА 
        pb-[90px] нужен, чтобы контент можно было доскроллить до конца,
        и он не перекрывался плавающим меню.
      */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto overflow-hidden flex flex-col pt-4 pb-[90px] px-2.5 md:px-0">
        {children}
      </main>

      {/* НИЖНЕЕ ПЛАВАЮЩЕЕ МЕНЮ (Dock)
        На мобилках: ширина 100% - 20px (по 10px по бокам).
        На ПК: макс ширина 1200px.
      */}
      <div className="fixed bottom-[10px] left-1/2 -translate-x-1/2 w-[calc(100%-20px)] md:w-full max-w-[1200px] z-50">
        <nav className="bg-[#FFFFFF] h-[68px] rounded-[16px] border border-[#E5E5EA] shadow-sm flex items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="flex flex-col items-center justify-center w-[70px] h-full gap-1 active:scale-95 transition-transform"
              >
                {/* Иконка: Черная если активно, Серая если нет */}
                <Icon 
                  size={24} 
                  className={isActive ? 'text-[#000000]' : 'text-[#8E8E93]'} 
                />
                {/* Текст: Черный если активно, Серый если нет */}
                <span className={`text-[10px] font-medium ${isActive ? 'text-[#000000]' : 'text-[#8E8E93]'}`}>
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