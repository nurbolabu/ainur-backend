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
    <div className="animate-in fade-in duration-500 w-full">
      
      {/* СТАТИСТИКА (4 раздельные белые карточки) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <div className="card-ios p-6 flex flex-col items-center justify-center text-center h-[160px]">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Посетители</span>
          <span className="text-4xl font-black text-black">1,240</span>
        </div>
        <div className="card-ios p-6 flex flex-col items-center justify-center text-center h-[160px]">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Нажатия</span>
          <span className="text-4xl font-black text-black">456</span>
        </div>
        <div className="card-ios p-6 flex flex-col items-center justify-center text-center h-[160px]">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Заявки</span>
          <span className="text-4xl font-black text-black">24</span>
        </div>
        <div className="card-ios p-6 flex flex-col items-center justify-center text-center h-[160px] bg-black">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Конверсия</span>
          <span className="text-4xl font-black text-[#8BFDA8]">5.2%</span>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-400 mb-6 px-2">Последние диалоги</h2>

      {/* ИСТОРИЯ ЧАТОВ (Каждый чат — отдельная карточка) */}
      <div className="space-y-4">
        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} className="card-ios flex items-center justify-between p-5 hover:scale-[0.99] transition-transform active:bg-gray-50 group">
            <div className="flex items-center gap-5 overflow-hidden">
              <div className="w-14 h-14 rounded-full bg-[#F2F2F7] flex items-center justify-center text-gray-400 shrink-0 group-hover:bg-black group-hover:text-[#8BFDA8] transition-colors">
                <MessageSquare size={24} />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-xl text-black">{chat.name}</div>
                <div className="text-gray-500 text-base mt-1 truncate">{chat.message}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0 ml-4">
              <span className="text-sm font-bold text-gray-400">{chat.date}</span>
              <ChevronRight size={24} className="text-gray-300" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}