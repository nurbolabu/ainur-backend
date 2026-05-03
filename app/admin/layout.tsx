'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, ShoppingBag, Clapperboard, Users, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', icon: <LayoutDashboard size={20} />, text: 'Главная' },
    { href: '/admin/leads', icon: <Users size={20} />, text: 'Заявки' },
    { href: '/admin/chats', icon: <MessageSquare size={20} />, text: 'История чатов' },
    { href: '/admin/catalog', icon: <ShoppingBag size={20} />, text: 'Каталог' },
    { href: '/admin/stories', icon: <Clapperboard size={20} />, text: 'Сторисы' },
    { href: '/admin/settings', icon: <Settings size={20} />, text: 'Настройки' }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex justify-center font-sans text-black">
      <div className="flex w-full max-w-[1220px] gap-5 pt-10">
        
        {/* ЛЕВОЕ МЕНЮ (Shape 280x520) */}
        <aside className="hidden md:block w-[280px] h-[520px] bg-white rounded-[24px] p-5 shrink-0 shadow-sm border border-gray-100">
          <div className="mb-8 px-2 flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-[#8BFDA8] font-bold">A</div>
             <span className="font-bold text-xl tracking-tight">AI NUR</span>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200 font-medium ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                  <div className={isActive ? 'text-[#8BFDA8]' : 'text-gray-400'}>{item.icon}</div>
                  <span>{item.text}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* ГЛАВНЫЙ КОНТЕНТ */}
        <main className="flex-1 pb-20">
           {children}
        </main>
      </div>

      {/* Мобильное меню (оставляем старую логику, но в новых цветах) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-gray-200 z-50 px-2 pb-6 pt-2 flex justify-around">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-black text-[#8BFDA8]' : 'text-gray-400'}`}>{item.icon}</div>
            </Link>
          )
        })}
      </nav>
    </div>
  );
}