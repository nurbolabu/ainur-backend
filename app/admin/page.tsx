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
      <h1 className="ios-title mt-4">Сегодня</h1>

      {/* Статистика (Виджеты iOS) */}
      <div className="grid grid-cols-2 gap-4 px-4 md:px-0 mb-8">
        <div className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-[110px] shadow-sm">
          <span className="text-[15px] font-medium text-[#8E8E93]">Посетители</span>
          <span className="text-[28px] font-semibold text-black">1,240</span>
        </div>
        <div className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-[110px] shadow-sm">
          <span className="text-[15px] font-medium text-[#8E8E93]">Нажатия</span>
          <span className="text-[28px] font-semibold text-black">456</span>
        </div>
        <div className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-[110px] shadow-sm">
          <span className="text-[15px] font-medium text-[#8E8E93]">Заявки</span>
          <span className="text-[28px] font-semibold text-black">24</span>
        </div>
        <div className="bg-white rounded-[20px] p-4 flex flex-col justify-between h-[110px] shadow-sm relative overflow-hidden">
          <span className="text-[15px] font-medium text-[#8E8E93] z-10">Конверсия</span>
          <span className="text-[28px] font-semibold text-black z-10">5.2%</span>
          <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#8BFDA8]/30 rounded-full blur-xl"></div>
        </div>
      </div>

      <h2 className="ios-section-title">Последние диалоги</h2>
      <div className="ios-list">
        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} className="ios-list-item">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93] shrink-0">
                <MessageSquare size={20} />
              </div>
              <div className="overflow-hidden">
                <div className="text-[17px] font-normal text-black">Клиент #{chat.id}</div>
                <div className="text-[15px] text-[#8E8E93] truncate">{chat.msg}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-[15px] text-[#8E8E93]">{chat.time}</span>
              <ChevronRight size={20} className="text-[#C7C7CC]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}