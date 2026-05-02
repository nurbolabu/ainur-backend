import React from 'react';
import { LayoutDashboard, ShoppingBag, MessageCircle, Settings, PlayCircle } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { name: 'Дашборд', icon: LayoutDashboard, href: '/admin' },
    { name: 'Каталог', icon: ShoppingBag, href: '/admin/catalog' },
    { name: 'Чаты', icon: MessageCircle, href: '/admin/chats' },
    { name: 'Сторис', icon: PlayCircle, href: '/admin/stories' },
    { name: 'Настройки', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-black font-sans antialiased">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-full w-64 border-r border-white/20 bg-white/60 backdrop-blur-xl md:flex flex-col p-6 z-50">
        <div className="mb-8 px-2 font-bold text-xl tracking-tight">Aura Admin</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <a key={item.name} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all hover:bg-black/5 active:scale-95 group">
              <item.icon className="w-5 h-5 text-[#8E8E93] group-hover:text-black" />
              <span className="font-medium">{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="md:pl-64 pb-24 md:pb-0">
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-2xl border-t border-black/5 flex items-center justify-around px-4 md:hidden z-50 pb-safe">
        {navItems.map((item) => (
          <a key={item.name} href={item.href} className="flex flex-col items-center gap-1">
            <item.icon className="w-6 h-6 text-[#8E8E93]" />
            <span className="text-[10px] font-medium text-[#8E8E93]">{item.name}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}