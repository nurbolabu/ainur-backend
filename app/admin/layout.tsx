'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, ShoppingBag, Clapperboard, Users, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: <LayoutDashboard size={22} />, text: 'Обзор' },
    { href: '/admin/leads', icon: <Users size={22} />, text: 'Заявки' },
    { href: '/admin/chats', icon: <MessageSquare size={22} />, text: 'Чаты' },
    { href: '/admin/catalog', icon: <ShoppingBag size={22} />, text: 'Каталог' },
    { href: '/admin/stories', icon: <Clapperboard size={22} />, text: 'Stories' },
    { href: '/admin/settings', icon: <Settings size={22} />, text: 'Настройки' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] flex flex-col md:flex-row md:p-4 gap-6 font-sans">
      
      {/* ДЕСКТОП: Боковое меню (Скрыто на мобильных) */}
      <aside className="hidden md:flex w-64 h-[calc(100vh-32px)] bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-[30px] p-6 flex-col sticky top-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-full bg-[#8BFDA8] flex items-center justify-center shadow-md">
            <span className="font-bold text-black">A</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-gray-900">Aura Admin</span>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.slice(0, 5).map(item => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium active:scale-95 ${pathname === item.href ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-white/50 hover:text-black'}`}>
              {item.icon}<span>{item.text}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium active:scale-95 ${pathname === '/admin/settings' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-white/50 hover:text-black'}`}>
            {navItems[5].icon}<span>{navItems[5].text}</span>
          </Link>
        </div>
      </aside>

      {/* ГЛАВНЫЙ ЭКРАН: Контент */}
      <main className="flex-1 w-full h-[100dvh] md:h-[calc(100vh-32px)] overflow-y-auto pb-24 md:pb-0">
        <div className="md:bg-white/60 md:backdrop-blur-xl md:border border-white/40 md:shadow-sm md:rounded-[30px] min-h-full p-4 pt-6 md:p-8">
          
          {/* МОБИЛЬНАЯ ШАПКА */}
          <div className="flex md:hidden items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-[#8BFDA8] flex items-center justify-center shadow-md">
              <span className="font-bold text-black">A</span>
            </div>
            <span className="font-semibold text-2xl tracking-tight text-gray-900">Aura Admin</span>
          </div>

          {children}
        </div>
      </main>

      {/* МОБИЛЬНОЕ: Нижнее меню (iOS Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/85 backdrop-blur-2xl border-t border-gray-200/50 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] z-50 px-1 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 flex justify-around items-center">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-14 h-12 relative active:scale-95 transition-transform">
              <div className={`flex items-center justify-center w-[30px] h-[30px] rounded-full mb-1 transition-colors duration-300 ${isActive ? 'text-[#8BFDA8] bg-black shadow-md' : 'text-gray-400 bg-transparent'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-black font-semibold' : 'text-gray-400'}`}>
                {item.text}
              </span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}