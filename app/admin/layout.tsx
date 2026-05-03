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
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex justify-center font-sans text-black">
      {/* КОНТЕЙНЕР: на ПК по центру с отступами, на телефоне на всю ширину */}
      <div className="flex w-full md:max-w-[1220px] gap-6 md:pt-10 px-4 md:px-0">
        
        {/* ЛЕВОЕ МЕНЮ (ПК - строго 280x520) */}
        <aside className="hidden md:block w-[280px] h-[520px] bg-white rounded-[24px] p-5 shrink-0 border border-[#E5E5EA] sticky top-10">
          <div className="mb-8 px-2 flex items-center gap-3">
             <div className="w-9 h-9 rounded-[10px] bg-black flex items-center justify-center text-[#8BFDA8] font-bold text-lg">A</div>
             <span className="font-bold text-xl tracking-tight">AI NUR</span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200 font-medium ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-[#F2F2F7]'}`}>
                  <div className={isActive ? 'text-[#8BFDA8]' : 'text-gray-400'}>{item.icon}</div>
                  <span>{item.text}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* ГЛАВНЫЙ КОНТЕНТ */}
        <main className="flex-1 w-full pb-28 md:pb-20 pt-6 md:pt-0">
           {/* Мобильная шапка */}
           <div className="md:hidden flex items-center gap-3 mb-6 px-2">
             <div className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center font-bold text-black border border-[#E5E5EA]">A</div>
             <span className="font-bold text-2xl tracking-tight">AI NUR</span>
           </div>
           
           {children}
        </main>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (Внизу, стекло, квадраты с закруглениями) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#F2F2F7]/85 backdrop-blur-2xl border-t border-[#E5E5EA] z-50 px-2 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 flex justify-around">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
              <div className={`w-12 h-10 rounded-[14px] flex items-center justify-center transition-colors ${isActive ? 'bg-black text-[#8BFDA8]' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-black font-bold' : 'text-gray-400'}`}>{item.text}</span>
            </Link>
          )
        })}
      </nav>

      <style jsx global>{`
        .btn-primary { @apply bg-[#8BFDA8] text-black font-semibold rounded-[14px] px-6 py-3 transition-all active:scale-95 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2; }
        .btn-secondary { @apply bg-black text-white font-semibold rounded-[14px] px-6 py-3 transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2; }
        .input-ios { @apply bg-[#F2F2F7] border border-[#E5E5EA] rounded-[14px] px-4 py-3 outline-none focus:bg-white focus:border-gray-400 transition-all text-base text-gray-900 w-full; }
        
        /* Классический iOS список (Inset Grouped) */
        .ios-list { @apply bg-white rounded-[24px] border border-[#E5E5EA] overflow-hidden; }
        .ios-list-item { @apply flex items-center justify-between p-4 bg-white active:bg-[#F2F2F7] transition-colors relative; }
        .ios-list-item:not(:last-child)::after { content: ''; position: absolute; bottom: 0; left: 60px; right: 0; height: 1px; background-color: #E5E5EA; }
      `}</style>
    </div>
  );
}