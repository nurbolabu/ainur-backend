'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, ShoppingBag, Clapperboard, Users, MessageSquare } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const NavItem = ({ href, icon, text }: { href: string, icon: React.ReactNode, text: string }) => {
    const isActive = pathname === href;
    return (
      <Link 
        href={href} 
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium active:scale-95 ${isActive ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-white/50 hover:text-black'}`}
      >
        {icon}
        <span>{text}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex p-4 gap-6 font-sans">
      <aside className="w-64 h-[calc(100vh-32px)] bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-[30px] p-6 flex flex-col sticky top-4">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-full bg-[#8BFDA8] flex items-center justify-center shadow-md">
            <span className="font-bold text-black">A</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-gray-900">Aura Admin</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} text="Дашборд" />
          <NavItem href="/admin/leads" icon={<Users size={20} />} text="Заявки" />
          <NavItem href="/admin/chats" icon={<MessageSquare size={20} />} text="Диалоги ИИ" />
          <NavItem href="/admin/catalog" icon={<ShoppingBag size={20} />} text="Каталог" />
          <NavItem href="/admin/stories" icon={<Clapperboard size={20} />} text="Stories" />
        </nav>

        <div className="mt-auto">
          <NavItem href="/admin/settings" icon={<Settings size={20} />} text="Настройки" />
        </div>
      </aside>

      <main className="flex-1 h-[calc(100vh-32px)] overflow-y-auto">
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-[30px] min-h-full p-8">
          {children}
        </div>
      </main>
    </div>
  );
}