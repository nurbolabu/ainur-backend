'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { MessageSquare, Box, LayoutList, LayoutGrid, PlaySquare, Loader2 } from 'lucide-react';

// Инициализация Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Состояния для защиты маршрута
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const navItems = [
    { href: '/admin', icon: LayoutGrid, label: 'Главная' },
    { href: '/admin/stories', icon: PlaySquare, label: 'Stories' },
    { href: '/admin/catalog', icon: Box, label: 'Каталог' },
    { href: '/admin/leads', icon: LayoutList, label: 'Заявки' },
    { href: '/admin/chats', icon: MessageSquare, label: 'Чаты' },
  ];

  // Пока проверяем сессию, показываем лоадер
  if (isLoading) {
    return (
      <div className="w-full h-[100dvh] bg-[#F2F2F7] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#8E8E93] mb-4" size={40} />
      </div>
    );
  }

  // Если сессии нет (редирект в процессе), прячем контент
  if (!isAuthenticated) return null;

  // Если всё ок — показываем твой дизайн админки
  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex flex-col relative font-sans">
      
      <main className="flex-1 w-full mx-auto flex flex-col pb-[100px]">
        {children}
      </main>

      {/* ЧЕРНОЕ ПЛАВАЮЩЕЕ МЕНЮ */}
      <div className="fixed bottom-[10px] left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <nav className="pointer-events-auto bg-[#000000] w-[340px] h-[70px] rounded-[22px] shadow-xl flex items-center justify-between px-[17px]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className="flex flex-col items-center justify-center w-[50px] gap-1 active:scale-95 transition-transform"
              >
                {/* Единая толщина strokeWidth={1.5} для всех состояний */}
                <Icon 
                  size={24} 
                  strokeWidth={1.5}
                  className={isActive ? 'text-[#8BFDA8]' : 'text-[#949494]'} 
                />
                <span className={`text-[11px] font-medium tracking-tight ${isActive ? 'text-[#FFFFFF]' : 'text-[#949494]'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

    </div>
  );
}