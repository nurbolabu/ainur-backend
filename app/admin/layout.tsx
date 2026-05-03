'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, ShoppingBag, Clapperboard, Users, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [logo, setLogo] = useState('');

  useEffect(() => {
    supabase.from('projects').select('logo_url').eq('id', MY_PROJECT_ID).single()
      .then(({ data }) => { if (data?.logo_url) setLogo(data.logo_url); });
  }, []);

  const navItems = [
    { href: '/admin', icon: <LayoutDashboard size={22} />, text: 'Главная' },
    { href: '/admin/leads', icon: <Users size={22} />, text: 'Заявки' },
    { href: '/admin/chats', icon: <MessageSquare size={22} />, text: 'Чаты' },
    { href: '/admin/catalog', icon: <ShoppingBag size={22} />, text: 'Каталог' },
    { href: '/admin/stories', icon: <Clapperboard size={22} />, text: 'Stories' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#f5f5f7] flex flex-col md:flex-row md:p-4 gap-6 font-sans text-black">
      
      {/* ДЕСКТОП: Стеклянное меню (Shape 280x520, rounded 24) */}
      <aside className="hidden md:flex w-64 h-[calc(100vh-32px)] bg-white rounded-[24px] p-6 flex-col sticky top-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <Link href="/admin/settings" className="flex items-center gap-3 mb-10 px-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f7] overflow-hidden flex items-center justify-center border border-gray-200">
            {logo ? <img src={logo} className="w-full h-full object-cover" alt="" /> : <span className="font-bold text-gray-400">A</span>}
          </div>
          <span className="font-bold text-lg tracking-tight">Aura Admin</span>
        </Link>

        <nav className="flex flex-col gap-2">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                <div className={isActive ? 'text-[#8BFDA8]' : 'text-gray-400'}>{item.icon}</div>
                <span>{item.text}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          <Link href="/admin/settings" className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${pathname === '/admin/settings' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <div className={pathname === '/admin/settings' ? 'text-[#8BFDA8]' : 'text-gray-400'}><Settings size={22} /></div>
            <span>Настройки</span>
          </Link>
        </div>
      </aside>

      {/* ГЛАВНЫЙ ЭКРАН (Серый фон) */}
      <main className="flex-1 w-full h-[100dvh] md:h-auto overflow-y-auto pb-24 md:pb-0 px-4 md:px-0 md:pr-4 pt-6 md:pt-4">
        <div className="flex md:hidden items-center gap-3 mb-8 px-2">
          <Link href="/admin/settings" className="w-11 h-11 rounded-full bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
            {logo ? <img src={logo} className="w-full h-full object-cover" alt="" /> : <span className="font-bold text-gray-500">A</span>}
          </Link>
          <span className="font-bold text-2xl tracking-tight text-gray-900">Aura</span>
        </div>
        {children}
      </main>

      {/* МОБИЛЬНОЕ МЕНЮ (Круглые большие индикаторы) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-gray-100 z-50 px-1 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 flex justify-around items-center">
        {[...navItems, { href: '/admin/settings', icon: <Settings size={22} />, text: 'Настройки' }].map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center active:scale-95 transition-transform">
              <div className={`flex items-center justify-center w-[48px] h-[48px] rounded-full mb-1 transition-colors duration-300 ${isActive ? 'text-[#8BFDA8] bg-black' : 'text-gray-400'}`}>
                {item.icon}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ГЛОБАЛЬНЫЕ СТИЛИ ДИЗАЙН-СИСТЕМЫ */}
      <style jsx global>{`
        /* 1. Главные кнопки: ЗЕЛЕНЫЙ фон, черный текст */
        .btn-main { @apply bg-[#8BFDA8] text-black font-bold rounded-[16px] px-6 py-3.5 transition-all active:scale-95 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 text-center; }
        /* 2. Второстепенные: ОБВОДКА черная, без фона */
        .btn-sec { @apply bg-transparent border-2 border-black text-black font-bold rounded-[16px] px-6 py-3.5 transition-all active:scale-95 hover:bg-black hover:text-white flex items-center justify-center gap-2 text-center; }
        
        /* Поля ввода (Apple Style: Серые) */
        .input-ios { @apply bg-[#EDEDED] border border-gray-200 rounded-[16px] px-4 py-3.5 outline-none focus:bg-white focus:border-gray-400 transition-all text-base text-gray-900 w-full; }
        
        /* Белые "Баблы" скруглением 24px */
        .ios-bubble { @apply bg-white rounded-[24px] overflow-hidden; }
      `}</style>
    </div>
  );
}