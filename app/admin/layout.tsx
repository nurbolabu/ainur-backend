'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Package, ClipboardList, Settings, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Главная' },
    { href: '/admin/chats', icon: MessageCircle, label: 'Чаты' },
    { href: '/admin/catalog', icon: Package, label: 'Каталог' },
    { href: '/admin/leads', icon: ClipboardList, label: 'Заявки' },
    { href: '/admin/settings', icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex flex-col relative font-sans text-[#000000]">
      
      {/* ГЛАВНЫЙ КОНТЕЙНЕР КОНТЕНТА 
        max-w-[1200px] - ширина на десктопе.
        pb-[100px] - чтобы контент не прятался под плавающим меню в самом низу.
      */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto flex flex-col pt-4 px-3 md:px-0 pb-[100px]">
        {children}
      </main>

      {/* ПЛАВАЮЩЕЕ МЕНЮ ВНИЗУ (DOCK)
        На телефонах: width 100% и px-2.5 (дает отступы по 10px).
        На ПК: max-w-[1200px] и центрирование.
      */}
      <div className="fixed bottom-[10px] left-0 right-0 z-50 flex justify-center pointer-events-none px-[10px] md:px-0">
        
        {/* Сам бабл меню: скругление 16px, белый фон, легкая тень */}
        <nav className="pointer-events-auto bg-[#FFFFFF] h-[72px] w-full max-w-[1200px] rounded-[16px] border border-[#E5E5EA] shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex items-center justify-around px-2 md:px-6">
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
                <span className={`text-[11px] font-medium tracking-wide ${isActive ? 'text-[#000000]' : 'text-[#8E8E93]'}`}>
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