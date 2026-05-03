'use client';
import Link from 'next/link';
import { ChevronRight, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const recentChats = [
    { id: '842', time: '14:30', msg: 'Здравствуйте! Как оформить...' },
    { id: '841', time: 'Вчера', msg: 'Где вы находитесь?' },
    { id: '840', time: 'Вторник', msg: 'Спасибо, жду звонка' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="ios-large-title mt-4">Сегодня</h1>

      {/* Статистика: Сетка баблов */}
      <div className="grid grid-cols-2 gap-4 ios-bubble-margin mb-8">
        <div className="ios-bubble mb-0 p-4 min-h-[110px] flex flex-col justify-between">
          <span className="text-[13px] text-[#3C3C43] font-medium">Посетители</span>
          <span className="text-[28px] font-bold text-black">1,240</span>
        </div>
        <div className="ios-bubble mb-0 p-4 min-h-[110px] flex flex-col justify-between">
          <span className="text-[13px] text-[#3C3C43] font-medium">Нажатия</span>
          <span className="text-[28px] font-bold text-black">456</span>
        </div>
        <div className="ios-bubble mb-0 p-4 min-h-[110px] flex flex-col justify-between">
          <span className="text-[13px] text-[#3C3C43] font-medium">Новые заявки</span>
          <span className="text-[28px] font-bold text-black">24</span>
        </div>
        <div className="ios-bubble mb-0 p-4 min-h-[110px] flex flex-col justify-between bg-[#8BFDA8]">
          <span className="text-[13px] text-black/60 font-medium">Конверсия</span>
          <span className="text-[28px] font-bold text-black">5.2%</span>
        </div>
      </div>

      <h2 className="ios-section-header">Последние диалоги</h2>
      
      {/* Inset Grouped List для чатов */}
      <div className="ios-bubble ios-bubble-margin">
        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} className="ios-list-row group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93] shrink-0">
                <MessageSquare size={20} />
              </div>
              <div className="overflow-hidden">
                <div className="text-[17px] font-medium text-black">Клиент #{chat.id}</div>
                <div className="text-[15px] text-[#3C3C43] opacity-60 truncate">{chat.msg}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 pl-4">
              <span className="text-[15px] text-[#3C3C43] opacity-60">{chat.time}</span>
              <ChevronRight size={20} className="text-[#C6C6C8]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}