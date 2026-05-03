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
    { href: '/admin', icon: LayoutDashboard, text: 'Главная' },
    { href: '/admin/leads', icon: Users, text: 'Заявки' },
    { href: '/admin/chats', icon: MessageSquare, text: 'Чаты' },
    { href: '/admin/catalog', icon: ShoppingBag, text: 'Каталог' },
    { href: '/admin/stories', icon: Clapperboard, text: 'Stories' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex justify-center font-sans text-black">
      <div className="flex w-full md:max-w-[1220px] gap-6 md:pt-10 px-4 md:px-0">
        
        {/* ДЕСКТОП: Боковое меню (Стиль macOS/iPadOS) */}
        <aside className="hidden md:block w-[260px] shrink-0 sticky top-10 h-fit">
          <div className="mb-6 px-4 flex items-center gap-3">
             <div className="w-10 h-10 rounded-[10px] bg-black flex items-center justify-center text-[#8BFDA8] font-bold text-lg">A</div>
             <span className="font-semibold text-xl tracking-tight">AI NUR</span>
          </div>

          <nav className="flex flex-col gap-1">
            {[...navItems, { href: '/admin/settings', icon: Settings, text: 'Настройки' }].map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} 
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-[10px] transition-colors ${isActive ? 'bg-[#E3E3E8] text-black font-semibold' : 'text-[#8E8E93] hover:bg-[#E3E3E8]/50 font-normal'}`}>
                  <Icon size={20} className={isActive ? 'text-black' : 'text-[#8E8E93]'} />
                  <span className="text-[17px]">{item.text}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* ГЛАВНЫЙ КОНТЕНТ */}
        <main className="flex-1 w-full pb-28 md:pb-20 pt-12 md:pt-0 max-w-[800px]">
           {children}
        </main>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (Стиль App Store) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#F2F2F7]/85 backdrop-blur-2xl border-t border-[#C6C6C8] z-50 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 flex justify-around">
        {[...navItems, { href: '/admin/settings', icon: Settings, text: 'Настройки' }].map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 active:opacity-50 transition-opacity w-[60px]">
              <Icon size={24} className={isActive ? 'text-black fill-current stroke-2' : 'text-[#999999] stroke-[1.5]'} />
              <span className={`text-[10px] text-center ${isActive ? 'text-black font-semibold' : 'text-[#999999] font-medium'}`}>{item.text}</span>
            </Link>
          )
        })}
      </nav>

      {/* ГЛОБАЛЬНЫЕ СТИЛИ (Строго по Apple HIG) */}
      <style jsx global>{`
        .ios-title { @apply text-[34px] font-bold tracking-tight text-black mb-4 px-4 md:px-0; }
        .ios-section-title { @apply text-[13px] font-normal text-[#8E8E93] uppercase tracking-wide mb-2 ml-4; }
        
        /* Группированные списки как в Настройках */
        .ios-list { @apply bg-white rounded-[10px] flex flex-col mb-8 overflow-hidden mx-4 md:mx-0; }
        .ios-list-item { @apply flex items-center justify-between p-3.5 bg-white active:bg-[#E5E5EA] transition-colors relative min-h-[44px]; }
        .ios-list-item:not(:last-child)::after { content: ''; position: absolute; bottom: 0; left: 16px; right: 0; height: 0.5px; background-color: #C6C6C8; }
        
        .ios-list-text { @apply text-[17px] font-normal text-black; }
        .ios-list-value { @apply text-[17px] font-normal text-[#8E8E93] flex items-center gap-2; }

        /* Поля ввода и кнопки */
        .input-ios { @apply bg-[#E3E3E8]/60 rounded-[10px] px-4 py-2.5 outline-none focus:bg-[#E3E3E8] transition-all text-[17px] text-black w-full; }
        .btn-primary { @apply bg-black text-[#8BFDA8] text-[17px] font-semibold rounded-[10px] px-4 py-3 transition-all active:scale-95 disabled:opacity-50 w-full text-center; }
        .btn-secondary { @apply bg-[#E3E3E8] text-black text-[17px] font-semibold rounded-[10px] px-4 py-3 transition-all active:scale-95 w-full text-center; }
      `}</style>
    </div>
  );
}