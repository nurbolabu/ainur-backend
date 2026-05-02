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
    <div className="min-h-[100dvh] bg-[#f5f5f7] flex flex-col md:flex-row md:p-4 gap-6 font-sans">
      
      {/* ДЕСКТОПНОЕ МЕНЮ */}
      <aside className="hidden md:flex w-64 h-[calc(100vh-32px)] bg-transparent flex-col sticky top-4">
        <Link href="/admin/settings" className="flex items-center gap-3 mb-10 px-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {logo ? <img src={logo} className="w-full h-full object-cover" alt="" /> : <span className="font-bold text-gray-500">A</span>}
          </div>
          <span className="font-semibold text-lg tracking-tight text-gray-900">Aura Admin</span>
        </Link>

        <nav className="flex flex-col gap-2">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-200/50 hover:text-black'}`}>
                <div className={isActive ? 'text-[#8BFDA8]' : 'text-gray-400'}>{item.icon}</div>
                <span>{item.text}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto">
          <Link href="/admin/settings" className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium ${pathname === '/admin/settings' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-200/50 hover:text-black'}`}>
            <div className={pathname === '/admin/settings' ? 'text-[#8BFDA8]' : 'text-gray-400'}><Settings size={22} /></div>
            <span>Настройки</span>
          </Link>
        </div>
      </aside>

      {/* ГЛАВНЫЙ ЭКРАН (Без белой подложки, карточки будут белыми сами по себе) */}
      <main className="flex-1 w-full h-[100dvh] md:h-auto overflow-y-auto pb-24 md:pb-0 px-4 md:px-0 md:pr-4 pt-6 md:pt-4">
        <div className="flex md:hidden items-center gap-3 mb-8 px-2">
          <Link href="/admin/settings" className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            {logo ? <img src={logo} className="w-full h-full object-cover" alt="" /> : <span className="font-bold text-gray-500">A</span>}
          </Link>
          <span className="font-semibold text-2xl tracking-tight text-gray-900">Aura Admin</span>
        </div>
        {children}
      </main>

      {/* МОБИЛЬНОЕ МЕНЮ (Без изменений) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/85 backdrop-blur-2xl border-t border-gray-200/50 z-50 px-1 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 flex justify-around items-center">
        {[...navItems, { href: '/admin/settings', icon: <Settings size={22} />, text: 'Настройки' }].map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center w-14 h-12 relative active:scale-95 transition-transform">
              <div className={`flex items-center justify-center w-[30px] h-[30px] rounded-full mb-1 transition-colors duration-300 ${isActive ? 'text-[#8BFDA8] bg-black' : 'text-gray-400 bg-transparent'}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-black font-semibold' : 'text-gray-400'}`}>{item.text}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}