'use client';
import Link from 'next/link';
import { MessageSquare, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const recentChats = [
    { id: '842', name: 'Клиент #842', date: 'Только что', message: 'Здравствуйте, сколько стоит дизайн?' },
    { id: '841', name: 'Клиент #841', date: '10 мин назад', message: 'Оформил заказ в корзине.' },
    { id: '840', name: 'Клиент #840', date: 'Час назад', message: 'Расскажите про услуги' },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl">
      <header className="mb-8"><h1 className="text-3xl font-bold tracking-tight">Главная</h1></header>

      {/* СТАТИСТИКА (Белый "баббл") */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 ios-bubble p-6">
        <div className="flex flex-col items-center p-3">
          <span className="text-gray-500 font-medium text-sm">Посетителей</span>
          <span className="text-4xl font-bold mt-2">1,204</span>
        </div>
        <div className="flex flex-col items-center p-3">
          <span className="text-gray-500 font-medium text-sm">Нажатий виджета</span>
          <span className="text-4xl font-bold mt-2">84</span>
        </div>
        <div className="flex flex-col items-center p-3">
          <span className="text-gray-500 font-medium text-sm">Новых заявок</span>
          <span className="text-4xl font-bold mt-2">12</span>
        </div>
        <div className="flex flex-col items-center p-3 relative overflow-hidden bg-black/5 rounded-xl">
          <span className="text-gray-500 font-medium text-sm z-10">Конверсия</span>
          <span className="text-4xl font-black mt-2 text-black z-10">5.2%</span>
        </div>
      </div>

      {/* ПОСЛЕДНИЕ ДИАЛОГИ */}
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-4">Последние диалоги</h2>
        <div className="space-y-3">
          {recentChats.map((chat) => (
            <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} className="ios-bubble flex items-center justify-between p-4 hover:scale-[0.99] transition-transform">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-gray-400 shrink-0"><MessageSquare size={22} /></div>
                <div className="overflow-hidden">
                  <div className="font-bold text-base">{chat.name}</div>
                  <div className="text-gray-500 text-sm truncate mt-0.5">{chat.message}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="text-sm text-gray-400">{chat.date}</span>
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}