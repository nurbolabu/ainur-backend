'use client';
import Link from 'next/link';
import { ChevronRight, MessageSquare } from 'lucide-react';

export default function AdminDashboard() {
  const recentChats = [
    { id: '842', date: '02.05.2026', time: '14:30' },
    { id: '841', date: '02.05.2026', time: '12:15' },
    { id: '840', date: '01.05.2026', time: '18:45' },
    { id: '839', date: '01.05.2026', time: '10:00' },
  ];

  return (
    <div className="animate-in fade-in duration-500 w-full md:w-[900px]">
      
      {/* СТАТИСТИКА (Белая карточка с тенями 900x160) */}
      <div className="bg-white rounded-[24px] shadow-sm md:h-[160px] flex flex-col md:flex-row items-center mb-8">
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-0">
          <span className="text-gray-400 text-sm font-bold uppercase tracking-tight">Посетители</span>
          <span className="text-3xl font-black mt-1">1,240</span>
        </div>
        <div className="hidden md:block w-[1px] h-[120px] bg-gray-100"></div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-0">
          <span className="text-gray-400 text-sm font-bold uppercase tracking-tight">Нажатия</span>
          <span className="text-3xl font-black mt-1">456</span>
        </div>
        <div className="hidden md:block w-[1px] h-[120px] bg-gray-100"></div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-0">
          <span className="text-gray-400 text-sm font-bold uppercase tracking-tight">Заявки</span>
          <span className="text-3xl font-black mt-1">24</span>
        </div>
        <div className="hidden md:block w-[1px] h-[120px] bg-gray-100"></div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-0">
          <span className="text-gray-400 text-sm font-bold uppercase tracking-tight">Конверсия</span>
          <span className="text-3xl font-black mt-1 text-[#8BFDA8] bg-black px-4 py-1 rounded-[12px]">5.2%</span>
        </div>
      </div>

      <h2 className="text-[#8E8E93] text-xl font-bold mb-4 ml-2">История чатов</h2>

      {/* ИСТОРИЯ ЧАТОВ (Каждый чат в своей белой карточке с промежутками) */}
      <div className="flex flex-col gap-3">
        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} 
            className="bg-white rounded-[24px] shadow-sm flex items-center justify-between p-5 hover:scale-[0.99] active:scale-95 transition-transform group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F2F2F7] flex items-center justify-center text-gray-400">
                <MessageSquare size={22} />
              </div>
              <div className="font-bold text-lg text-gray-900">Диалог #{chat.id}</div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-gray-400 font-medium text-sm">{chat.date}, {chat.time}</span>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-black transition-colors" />
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}