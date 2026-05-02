'use client';
import Link from 'next/link';
import { MessageSquare, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  // Заглушки данных. Позже их можно подтянуть из Supabase
  const recentChats = [
    { id: '1', name: 'Клиент #842', date: 'Только что', message: 'Здравствуйте, сколько стоит дизайн?' },
    { id: '2', name: 'Клиент #841', date: '10 мин назад', message: 'Оформил заказ в корзине.' },
    { id: '3', name: 'Клиент #840', date: 'Час назад', message: 'Расскажите про услуги' },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Главная</h1>
      </header>

      {/* СТАТИСТИКА (Новый порядок, белые карточки без теней) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[24px] flex flex-col justify-between">
          <span className="text-gray-500 font-medium text-sm">Пользователей</span>
          <span className="text-3xl font-bold text-gray-900 mt-2">1,204</span>
        </div>
        <div className="bg-white p-5 rounded-[24px] flex flex-col justify-between">
          <span className="text-gray-500 font-medium text-sm">Диалогов с ИИ</span>
          <span className="text-3xl font-bold text-gray-900 mt-2">84</span>
        </div>
        <div className="bg-white p-5 rounded-[24px] flex flex-col justify-between">
          <span className="text-gray-500 font-medium text-sm">Новых заявок</span>
          <span className="text-3xl font-bold text-gray-900 mt-2">12</span>
        </div>
        <div className="bg-white p-5 rounded-[24px] flex flex-col justify-between">
          <span className="text-gray-500 font-medium text-sm">Клики контактов</span>
          <span className="text-3xl font-bold text-gray-900 mt-2">340</span>
        </div>
      </div>

      {/* ПОСЛЕДНИЕ ДИАЛОГИ (Белая карточка в стиле iOS-списка) */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 ml-4">Последние диалоги</h2>
        <div className="bg-white rounded-[24px] overflow-hidden divide-y divide-gray-100">
          {recentChats.map((chat) => (
            <Link key={chat.id} href={`/admin/chats?id=${chat.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-gray-400 flex-shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div className="overflow-hidden">
                  <div className="font-semibold text-gray-900 text-base">{chat.name}</div>
                  <div className="text-gray-500 text-sm truncate">{chat.message}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <span className="text-sm text-gray-400">{chat.date}</span>
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            </Link>
          ))}
          {recentChats.length === 0 && (
            <div className="p-8 text-center text-gray-400">Нет недавних диалогов</div>
          )}
        </div>
      </div>
    </div>
  );
}