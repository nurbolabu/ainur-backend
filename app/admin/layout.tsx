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
  const [projectData, setProjectData] = useState<any>(null);

  useEffect(() => {
    supabase.from('projects').select('logo_url, company_name').eq('id', MY_PROJECT_ID).single()
      .then(({ data }) => { if (data) setProjectData(data); });
  }, []);

  const navItems = [
    { href: '/admin', icon: <LayoutDashboard size={22} />, text: 'Главная' },
    { href: '/admin/catalog', icon: <ShoppingBag size={22} />, text: 'Каталог' },
    { href: '/admin/leads', icon: <Users size={22} />, text: 'Заявки' },
    { href: '/admin/chats', icon: <MessageSquare size={22} />, text: 'Чаты' },
    { href: '/admin/stories', icon: <Clapperboard size={22} />, text: 'Stories' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex justify-center font-sans text-[#000000] selection:bg-[#8BFDA8]">
      
      {/* СЕТКА (Max 1200px) */}
      <div className="flex w-full md:max-w-[1200px] gap-[20px] md:pt-10 px-4 md:px-0">
        
        {/* ЛЕВАЯ КОЛОНКА: Сайдбар (280px) */}
        <aside className="hidden md:flex w-[280px] h-fit bg-[#FFFFFF] rounded-[24px] p-6 flex-col sticky top-10">
          <div className="mb-10 flex flex-col items-center justify-center text-center">
             <div className="w-[48px] h-[48px] rounded-full bg-[#F2F2F7] overflow-hidden flex items-center justify-center mb-3">
                {projectData?.logo_url ? <img src={projectData.logo_url} className="w-full h-full object-cover" /> : <span className="font-bold text-[#8E8E93] text-[20px]">A</span>}
             </div>
             <span className="font-bold text-[17px] tracking-tight">{projectData?.company_name || 'AI NUR'}</span>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} 
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-[16px] transition-colors ${isActive ? 'bg-[#8BFDA8] text-[#000000] font-semibold' : 'bg-transparent text-[#8E8E93] hover:bg-[#F2F2F7] font-normal'}`}>
                  <div className={isActive ? 'text-[#000000]' : 'text-[#8E8E93]'}>{item.icon}</div>
                  <span className="text-[17px]">{item.text}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-12 pt-6 border-t border-[#E5E5EA]">
            <Link href="/admin/settings" className={`flex items-center gap-4 px-4 py-3.5 rounded-[16px] transition-colors ${pathname === '/admin/settings' ? 'bg-[#8BFDA8] text-[#000000] font-semibold' : 'bg-transparent text-[#8E8E93] hover:bg-[#F2F2F7] font-normal'}`}>
              <div className={pathname === '/admin/settings' ? 'text-[#000000]' : 'text-[#8E8E93]'}><Settings size={22} /></div>
              <span className="text-[17px]">Настройки</span>
            </Link>
          </div>
        </aside>

        {/* ПРАВАЯ КОЛОНКА: Контент (900px) */}
        <main className="flex-1 w-full md:w-[900px] pb-32 md:pb-20 pt-10 md:pt-0 max-w-[900px]">
           {children}
        </main>
      </div>

      {/* МОБИЛЬНЫЙ BOTTOM TAB BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#F2F2F7]/90 backdrop-blur-2xl border-t border-[#C6C6C8] z-50 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-3 flex justify-around">
        {[...navItems, { href: '/admin/settings', icon: <Settings size={24} />, text: 'Настройки' }].map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 min-w-[60px] active:opacity-50">
              <div className={isActive ? 'text-[#000000]' : 'text-[#8E8E93]'}>{item.icon}</div>
              <span className={`text-[10px] mt-1 ${isActive ? 'text-[#000000] font-semibold' : 'text-[#8E8E93] font-medium'}`}>{item.text}</span>
            </Link>
          )
        })}
      </nav>

      {/* ГЛОБАЛЬНЫЕ СТИЛИ (Zero Shadows, Apple HIG) */}
      <style jsx global>{`
        /* Типографика */
        .ios-large-title { font-size: 34px; font-weight: 700; color: #000000; margin-bottom: 24px; letter-spacing: 0.3px; }
        .ios-title-2 { font-size: 22px; font-weight: 600; color: #000000; margin-bottom: 16px; }
        .ios-section-header { font-size: 13px; text-transform: uppercase; color: #3C3C43; opacity: 0.6; margin-bottom: 8px; margin-left: 16px; font-weight: 400; }
        
        /* Модули (Баблы) - НОЛЬ ТЕНЕЙ */
        .ios-module { background-color: #FFFFFF; border-radius: 24px; overflow: hidden; margin-bottom: 32px; }
        
        /* Списки внутри модулей */
        .ios-list-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; background-color: #FFFFFF; position: relative; transition: background-color 0.2s; cursor: pointer; min-height: 44px; }
        .ios-list-item:active { background-color: #F2F2F7; }
        .ios-list-item:not(:last-child)::after { content: ''; position: absolute; bottom: 0; left: 16px; right: 0; height: 1px; background-color: #E5E5EA; }
        
        /* Кнопки */
        .btn-primary { background-color: #8BFDA8; color: #000000; font-size: 17px; font-weight: 600; border-radius: 16px; min-height: 52px; padding: 0 24px; transition: transform 0.1s, opacity 0.1s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary:active { transform: scale(0.96); opacity: 0.8; }
        .btn-primary:disabled { opacity: 0.5; pointer-events: none; }

        .btn-secondary { background-color: #000000; color: #FFFFFF; font-size: 17px; font-weight: 600; border-radius: 16px; min-height: 52px; padding: 0 24px; transition: transform 0.1s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-secondary:active { transform: scale(0.96); opacity: 0.8; }

        /* Поля ввода */
        .input-ios { background-color: #F5F5F7; border: 1px solid #E5E5EA; border-radius: 14px; padding: 16px; font-size: 17px; color: #000000; outline: none; transition: background-color 0.2s; width: 100%; }
        .input-ios:focus { background-color: #FFFFFF; }
        .input-ios::placeholder { color: #8E8E93; }
      `}</style>
    </div>
  );
}