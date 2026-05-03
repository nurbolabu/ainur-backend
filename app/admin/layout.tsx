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
    { href: '/admin', icon: LayoutDashboard, text: 'Главная' },
    { href: '/admin/catalog', icon: ShoppingBag, text: 'Каталог' },
    { href: '/admin/leads', icon: Users, text: 'Заявки' },
    { href: '/admin/chats', icon: MessageSquare, text: 'История' },
    { href: '/admin/stories', icon: Clapperboard, text: 'Stories' }
  ];

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex justify-center font-sans text-[#000000] selection:bg-[#8BFDA8]">
      
      {/* Сетка */}
      <div className="flex w-full md:max-w-[1200px] gap-8 md:pt-10 px-4 md:px-0">
        
        {/* SIDEBAR (Desktop) */}
        <aside className="hidden md:flex w-[260px] h-fit flex-col sticky top-10">
          <div className="mb-6 px-4 flex items-center gap-4">
             <div className="w-[44px] h-[44px] rounded-[12px] bg-black flex items-center justify-center text-[#8BFDA8] font-bold text-xl">A</div>
             <span className="font-semibold text-[22px] tracking-tight truncate">{projectData?.company_name || 'AI NUR'}</span>
          </div>

          <nav className="flex flex-col gap-1">
            {[...navItems, { href: '/admin/settings', icon: Settings, text: 'Настройки' }].map(item => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} 
                  className={`flex items-center gap-3.5 px-4 py-2.5 rounded-[12px] min-h-[44px] transition-colors ${isActive ? 'bg-[#E3E3E8] text-black font-semibold' : 'text-[#3C3C43] hover:bg-[#E3E3E8]/50 font-normal'}`}>
                  <Icon size={22} className={isActive ? 'text-[#8BFDA8] fill-black stroke-black stroke-2' : 'text-[#8E8E93]'} />
                  <span className="text-[17px]">{item.text}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full pb-28 md:pb-20 pt-10 md:pt-0 max-w-[800px]">
           {children}
        </main>
      </div>

      {/* MOBILE BOTTOM BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#F2F2F7]/90 backdrop-blur-2xl border-t border-[#C6C6C8] z-50 px-2 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 flex justify-around">
        {[...navItems, { href: '/admin/settings', icon: Settings, text: 'Настройки' }].map(item => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 min-w-[60px] active:opacity-50 transition-opacity">
              <Icon size={26} className={isActive ? 'text-black fill-black stroke-black' : 'text-[#8E8E93] stroke-[1.5]'} />
              <span className={`text-[10px] text-center ${isActive ? 'text-black font-semibold' : 'text-[#8E8E93] font-medium'}`}>{item.text}</span>
            </Link>
          )
        })}
      </nav>

      {/* APPLE HIG GLOBAL STYLES */}
      <style jsx global>{`
        .ios-large-title { font-size: 34px; font-weight: 700; color: #000000; margin-bottom: 24px; padding: 0 16px; letter-spacing: 0.3px; }
        @media (min-width: 768px) { .ios-large-title { padding: 0; } }
        .ios-title-2 { font-size: 22px; font-weight: 600; color: #000000; margin-bottom: 16px; }
        .ios-section-header { font-size: 13px; text-transform: uppercase; color: #3C3C43; opacity: 0.6; margin-bottom: 8px; margin-left: 16px; font-weight: 400; }
        
        .ios-bubble { background-color: #FFFFFF; border-radius: 16px; overflow: hidden; margin-bottom: 32px; }
        .ios-bubble-margin { margin-left: 16px; margin-right: 16px; }
        @media (min-width: 768px) { .ios-bubble-margin { margin-left: 0; margin-right: 0; } }

        .ios-list-row { display: flex; align-items: center; justify-content: space-between; min-height: 44px; padding: 12px 16px; background-color: #FFFFFF; position: relative; cursor: pointer; transition: background-color 0.2s; }
        .ios-list-row:active { background-color: #E5E5EA; }
        .ios-list-row:not(:last-child)::after { content: ''; position: absolute; bottom: 0; left: 16px; right: 0; height: 0.5px; background-color: #C6C6C8; }
        
        .btn-primary { background-color: #8BFDA8; color: #000000; font-size: 17px; font-weight: 600; border-radius: 14px; min-height: 50px; padding: 0 20px; transition: transform 0.1s, opacity 0.1s; display: inline-flex; align-items: center; justify-content: center; width: 100%; gap: 6px; }
        .btn-primary:active { transform: scale(0.96); opacity: 0.8; }
        .btn-primary:disabled { opacity: 0.5; pointer-events: none; }

        .btn-secondary { background-color: transparent; color: #000000; font-size: 17px; font-weight: 600; border-radius: 14px; min-height: 50px; padding: 0 20px; border: 2px solid #E5E5EA; transition: background-color 0.1s; display: inline-flex; align-items: center; justify-content: center; width: 100%; gap: 6px; }
        .btn-secondary:active { background-color: #E5E5EA; }

        .btn-text { color: #8BFDA8; font-size: 17px; font-weight: 600; padding: 8px 16px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; }
        .btn-text:active { opacity: 0.5; }

        .input-bare { font-size: 17px; color: #000000; width: 100%; background: transparent; outline: none; padding: 0; }
        .input-bare::placeholder { color: rgba(60,60,67,0.3); }
        .input-bare:disabled { color: #8E8E93; opacity: 1; -webkit-text-fill-color: #8E8E93; }
      `}</style>
    </div>
  );
}