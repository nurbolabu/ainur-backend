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
    <div className="animate-in fade-in duration-300 w-full">
      <h1 className="text-3xl font-bold mb-8 px-1">Обзор</h1>

      {/* СТАТИСТИКА (Симметричный gap-4) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="ios-bubble p-5 flex flex-col justify-center items-center text-center min-h-[120px] mb-0">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Посетители</span>
          <span className="text-[32px] font-black text-black leading-none">1,240</span>
        </div>
        <div className="ios-bubble p-5 flex flex-col justify-center items-center text-center min-h-[120px] mb-0">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Нажатия</span>
          <span className="text-[32px] font-black text-black leading-none">456</span>
        </div>
        <div className="ios-bubble p-5 flex flex-col justify-center items-center text-center min-h-[120px] mb-0">
          <span className="text-gray-500 font-bold uppercase tracking-wider text-xs mb-2">Заявки</span>
          <span className="text-[32px] font-black text-black leading-none">24</span>
        </div>
        <div className="ios-bubble p-5 flex flex-col justify-center items-center text-center min-h-[120px] mb-0 bg-black border-black">
          <span className="text-[#8BFDA8] font-bold uppercase tracking-wider text-xs mb-2">Конверсия</span>
          <span className="text-[32px] font-black text-white leading-none">5.2%</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-400 mb-5 px-1">Последние диалоги</h2>

      {/* ИСТОРИЯ ЧАТОВ */}
      <div className="space-y-4">
        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} className="ios-bubble flex items-center justify-between p-5 hover:scale-[0.99] transition-transform group mb-0">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-12 h-12 rounded-full bg-[#F2F2F7] flex items-center justify-center text-gray-500 shrink-0 group-hover:bg-black group-hover:text-[#8BFDA8] transition-colors">
                <MessageSquare size={20} />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-lg text-black">{chat.name}</div>
                <div className="text-gray-500 text-sm mt-0.5 truncate">{chat.message}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
              <ChevronRight size={20} className="text-gray-300" />
              <span className="text-xs font-bold text-gray-400">{chat.date}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}