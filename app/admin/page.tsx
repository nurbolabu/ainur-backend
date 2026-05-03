'use client';
import Link from 'next/link';
import { ChevronRight, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const recentChats = [
    { id: '842', date: '02.05.2026', time: '14:30', msg: 'Здравствуйте! Как оформить...' },
    { id: '841', date: '02.05.2026', time: '12:15', msg: 'Где вы находитесь?' },
    { id: '840', date: '01.05.2026', time: '18:45', msg: 'Спасибо, жду звонка' },
  ];

  return (
    <div className="animate-in fade-in duration-500 w-full md:w-[900px] max-w-full">
      
      {/* СТАТИСТИКА: Линия на ПК, Плитка на мобильном */}
      <div className="bg-white rounded-[24px] border border-[#E5E5EA] md:h-[160px] flex flex-col md:flex-row overflow-hidden mb-8">
        
        <div className="flex-1 flex md:flex-col items-center md:justify-center justify-between p-6 md:p-0 border-b md:border-b-0 md:border-r border-[#E5E5EA]">
          <span className="text-gray-500 text-sm font-medium">Посетители</span>
          <span className="text-2xl md:text-3xl font-bold mt-1">1,240</span>
        </div>
        
        <div className="flex-1 flex md:flex-col items-center md:justify-center justify-between p-6 md:p-0 border-b md:border-b-0 md:border-r border-[#E5E5EA]">
          <span className="text-gray-500 text-sm font-medium">Нажатия</span>
          <span className="text-2xl md:text-3xl font-bold mt-1">456</span>
        </div>
        
        <div className="flex-1 flex md:flex-col items-center md:justify-center justify-between p-6 md:p-0 border-b md:border-b-0 md:border-r border-[#E5E5EA]">
          <span className="text-gray-500 text-sm font-medium">Заявки</span>
          <span className="text-2xl md:text-3xl font-bold mt-1">24</span>
        </div>
        
        <div className="flex-1 flex md:flex-col items-center md:justify-center justify-between p-6 md:p-0">
          <span className="text-gray-500 text-sm font-medium">Конверсия</span>
          <span className="text-xl md:text-2xl font-bold mt-1 md:mt-2 text-[#8BFDA8] bg-black px-3 py-1 rounded-[10px]">5.2%</span>
        </div>

      </div>

      <h2 className="text-[#8E8E93] text-xl md:text-2xl font-bold mb-4 px-2 md:px-0">История чатов</h2>

      {/* ИСТОРИЯ ЧАТОВ (iOS Inset List) */}
      <div className="ios-list">
        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} className="ios-list-item group">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-[#F2F2F7] flex items-center justify-center text-gray-400 shrink-0">
                <MessageSquare size={20} />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-[17px] text-gray-900">Диалог #{chat.id}</div>
                <div className="text-[14px] text-gray-500 truncate mt-0.5">{chat.msg}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <span className="text-[15px] text-gray-400 font-medium hidden md:block">{chat.date}, {chat.time}</span>
              <ChevronRight size={20} className="text-[#C7C7CC] group-hover:text-black transition-colors" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}