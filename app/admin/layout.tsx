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
    { href: '/admin', icon: <LayoutDashboard size={20} />, text: 'Главная' },
    { href: '/admin/leads', icon: <Users size={20} />, text: 'Заявки' },
    { href: '/admin/chats', icon: <MessageSquare size={20} />, text: 'История чатов' },
    { href: '/admin/catalog', icon: <ShoppingBag size={20} />, text: 'Каталог' },
    { href: '/admin/stories', icon: <Clapperboard size={20} />, text: 'Сторисы' },
    { href: '/admin/settings', icon: <Settings size={20} />, text: 'Настройки' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex justify-center font-sans text-black">
      <div className="flex w-full md:max-w-[1220px] gap-5 md:pt-10 px-4 md:px-0">
        
        {/* ЛЕВОЕ МЕНЮ (Shape 280x520) */}
        <aside className="hidden md:block w-[280px] h-[520px] bg-white rounded-[24px] p-5 shrink-0 border border-[#E5E5EA] sticky top-10">
          <Link href="/admin/settings" className="mb-8 px-2 flex items-center gap-3 hover:opacity-80 transition-opacity">
             <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                {logo ? <img src={logo} className="w-full h-full object-cover" alt="" /> : <span className="font-bold text-black">A</span>}
             </div>
             <span className="font-bold text-xl tracking-tight">AI NUR</span>
          </Link>

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
           {children}
        </main>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (Крупные круглые кнопки) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-2xl border-t border-gray-200 z-50 px-2 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-3 flex justify-around">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center active:scale-95 transition-transform">
              <div className={`w-[46px] h-[46px] rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-black text-[#8BFDA8]' : 'text-gray-400'}`}>
                {item.icon}
              </div>
            </Link>
          )
        })}
      </nav>

      <style jsx global>{`
        .card-ios { @apply bg-white rounded-[24px] border border-[#E5E5EA] overflow-hidden; }
        .btn-primary { @apply bg-[#8BFDA8] text-black font-bold rounded-[16px] px-6 py-3.5 transition-all active:scale-95 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2; }
        .btn-secondary { @apply bg-black text-white font-bold rounded-[16px] px-6 py-3.5 transition-all active:scale-95 hover:opacity-90 flex items-center justify-center gap-2; }
        .input-ios { @apply bg-[#F2F2F7] border border-[#E5E5EA] rounded-[16px] px-4 py-3.5 outline-none focus:bg-white focus:border-gray-400 transition-all text-base; }
      `}</style>
    </div>
  );
}