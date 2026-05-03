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
    { href: '/admin/leads', icon: <Users size={22} />, text: 'Заявки' },
    { href: '/admin/chats', icon: <MessageSquare size={22} />, text: 'История' },
    { href: '/admin/catalog', icon: <ShoppingBag size={22} />, text: 'Каталог' },
    { href: '/admin/stories', icon: <Clapperboard size={22} />, text: 'Stories' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex justify-center font-sans text-black">
      <div className="flex w-full md:max-w-[1200px] gap-8 md:pt-10 px-4 md:px-0">
        
        {/* ЛЕВОЕ МЕНЮ (Белый бабл 280px) */}
        <aside className="hidden md:flex w-[280px] h-fit bg-white rounded-[24px] p-6 flex-col sticky top-10 border border-gray-100">
          <Link href="/admin/settings" className="flex items-center gap-4 mb-10 px-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-[14px] bg-[#F2F2F7] overflow-hidden flex items-center justify-center border border-gray-200 shrink-0">
              {projectData?.logo_url ? <img src={projectData.logo_url} className="w-full h-full object-cover" alt="" /> : <span className="font-bold text-gray-400">A</span>}
            </div>
            <span className="font-bold text-xl tracking-tight truncate">{projectData?.company_name || 'AI NUR'}</span>
          </Link>

          <nav className="flex flex-col gap-2">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-4 py-3.5 rounded-[16px] transition-all duration-200 font-bold ${isActive ? 'bg-black text-white' : 'text-gray-500 hover:bg-[#F2F2F7]'}`}>
                  <div className={isActive ? 'text-[#8BFDA8]' : 'text-gray-400'}>{item.icon}</div>
                  <span className="text-[16px]">{item.text}</span>
                </Link>
              )
            })}
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link href="/admin/settings" className={`flex items-center gap-4 px-4 py-3.5 rounded-[16px] transition-all duration-200 font-bold ${pathname === '/admin/settings' ? 'bg-black text-white' : 'text-gray-500 hover:bg-[#F2F2F7]'}`}>
              <div className={pathname === '/admin/settings' ? 'text-[#8BFDA8]' : 'text-gray-400'}><Settings size={22} /></div>
              <span className="text-[16px]">Настройки</span>
            </Link>
          </div>
        </aside>

        {/* ГЛАВНЫЙ КОНТЕНТ */}
        <main className="flex-1 w-full pb-32 md:pb-20 pt-8 md:pt-0 max-w-[900px]">
          <div className="flex md:hidden items-center gap-3 mb-8 px-1">
            <Link href="/admin/settings" className="w-11 h-11 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
              {projectData?.logo_url ? <img src={projectData.logo_url} className="w-full h-full object-cover" alt="" /> : <span className="font-bold text-gray-500">A</span>}
            </Link>
            <span className="font-bold text-2xl tracking-tight text-gray-900 truncate">{projectData?.company_name || 'AI NUR'}</span>
          </div>
          {children}
        </main>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (Круглые индикаторы) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-2xl border-t border-gray-200 z-50 px-2 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 flex justify-around items-center">
        {[...navItems, { href: '/admin/settings', icon: <Settings size={22} />, text: 'Настройки' }].map(item => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center active:scale-95 transition-transform">
              <div className={`flex items-center justify-center w-[50px] h-[50px] rounded-full mb-1 transition-colors duration-300 shadow-sm ${isActive ? 'text-[#8BFDA8] bg-black' : 'text-gray-400 bg-[#F2F2F7]'}`}>
                {item.icon}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ФИРМЕННЫЙ СТИЛЬ (Баблы 24px, Зеленые/Обводные кнопки) */}
      <style jsx global>{`
        .ios-bubble { background-color: #FFFFFF; border-radius: 24px; overflow: hidden; margin-bottom: 24px; border: 1px solid #E5E5EA; }
        
        /* Главная кнопка (Зеленая с черным текстом) */
        .btn-main { background-color: #8BFDA8; color: #000000; font-weight: 700; border-radius: 16px; padding: 14px 24px; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; border: 2px solid #8BFDA8; }
        .btn-main:active { transform: scale(0.96); opacity: 0.8; }
        .btn-main:disabled { opacity: 0.5; pointer-events: none; }

        /* Второстепенная кнопка (Черная обводка, без фона) */
        .btn-sec { background-color: transparent; border: 2px solid #000000; color: #000000; font-weight: 700; border-radius: 16px; padding: 14px 24px; transition: all 0.2s ease; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-size: 16px; }
        .btn-sec:hover { background-color: #000000; color: #FFFFFF; }
        .btn-sec:active { transform: scale(0.96); }

        .input-ios { background-color: #EDEDED; border: 1px solid transparent; border-radius: 16px; padding: 16px 20px; outline: none; transition: all 0.2s ease; font-size: 16px; width: 100%; color: #000; }
        .input-ios:focus { background-color: #FFFFFF; border-color: #8BFDA8; }
        .input-ios:disabled { opacity: 0.6; }
      `}</style>
    </div>
  );
}