'use client';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const recentChats = [
    { id: '842', name: 'Анна', date: 'Только что', status: 'Активный' },
    { id: '841', name: 'Игорь', date: '10 мин назад', status: 'Завершен' },
    { id: '840', name: 'Алексей', date: 'Вчера', status: 'Завершен' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="ios-large-title">Обзор</h1>

      {/* Метрики (Сетка баблов) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-8">
        <div className="ios-module p-5 flex flex-col justify-between min-h-[140px] mb-0">
          <span className="text-[15px] text-[#8E8E93] font-medium">Всего посетителей</span>
          <span className="text-[34px] font-bold text-[#000000]">2,840</span>
        </div>
        <div className="ios-module p-5 flex flex-col justify-between min-h-[140px] mb-0">
          <span className="text-[15px] text-[#8E8E93] font-medium">Активные чаты</span>
          <span className="text-[34px] font-bold text-[#000000]">12</span>
        </div>
        <div className="ios-module p-5 flex flex-col justify-between min-h-[140px] mb-0">
          <span className="text-[15px] text-[#8E8E93] font-medium">Новые заявки</span>
          <span className="text-[34px] font-bold text-[#000000]">8</span>
        </div>
        <div className="ios-module p-5 flex flex-col justify-between min-h-[140px] mb-0 bg-[#8BFDA8]">
          <span className="text-[15px] text-[#000000] font-medium opacity-60">Конверсия</span>
          <span className="text-[34px] font-bold text-[#000000]">4.2%</span>
        </div>
      </div>

      <h2 className="ios-section-header">Последние чаты</h2>
      
      {/* Список последних чатов (Inset Grouped с линией 1px) */}
      <div className="ios-module">
        {recentChats.map((chat) => (
          <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} className="ios-list-item group">
            <div className="flex flex-col">
              <span className="text-[17px] font-semibold text-[#000000]">Чат #{chat.id} — {chat.name}</span>
              <span className="text-[15px] text-[#8E8E93] mt-1">{chat.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[17px] text-[#8E8E93]">{chat.date}</span>
              <ChevronRight size={20} className="text-[#C6C6C8]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}