'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const recentChats = [
    { id: '842', date: '02.05.2026', time: '14:30' },
    { id: '841', date: '02.05.2026', time: '12:15' },
    { id: '840', date: '01.05.2026', time: '18:45' },
    { id: '839', date: '01.05.2026', time: '10:00' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* КОНТЕЙНЕР СТАТИСТИКИ (900x160) */}
      <div className="w-[900px] h-[160px] bg-white rounded-[24px] flex items-center shadow-sm border border-gray-100">
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-gray-400 text-sm font-medium">Посетители</span>
          <span className="text-3xl font-bold mt-1">1,240</span>
        </div>
        <div className="w-[1px] h-[120px] bg-gray-100"></div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-gray-400 text-sm font-medium">Нажатия</span>
          <span className="text-3xl font-bold mt-1">456</span>
        </div>
        <div className="w-[1px] h-[120px] bg-gray-100"></div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-gray-400 text-sm font-medium">Заявки</span>
          <span className="text-3xl font-bold mt-1">24</span>
        </div>
        <div className="w-[1px] h-[120px] bg-gray-100"></div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <span className="text-gray-400 text-sm font-medium">Конверсия</span>
          <span className="text-3xl font-bold mt-1 text-[#8BFDA8] bg-black px-3 py-1 rounded-lg">5.2%</span>
        </div>
      </div>

      <h2 className="text-[#8E8E93] text-2xl font-bold mt-[20px] mb-[20px]">История чатов</h2>

      {/* КОНТЕЙНЕР ИСТОРИИ (900px) */}
      <div className="w-[900px] bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} 
            className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
            <div className="font-bold text-lg">Диалог #{chat.id}</div>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 font-medium">{chat.date}, {chat.time}</span>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-black transition-colors" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}