'use client';
import { useState } from 'react';
import { ChevronLeft, MessageSquare } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Заглушка. Позже подтянем из Supabase
  const dialogs = [
    { id: '1', date: '02.05.2026, 14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем могу помочь?'}, {role: 'client', text: 'Сколько стоит дизайн?'}, {role: 'ai', text: 'У нас есть несколько пакетов. Откройте каталог!'}] },
    { id: '2', date: '01.05.2026, 09:15', messages: [{role: 'client', text: 'Где вы находитесь?'}, {role: 'ai', text: 'Наш адрес: Алматы, ул. Абая 123.'}] }
  ];

  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col md:flex-row gap-6 max-w-5xl mx-auto pb-20 md:pb-0">
      
      {/* Список диалогов (скрывается на мобильном, если открыт чат) */}
      <div className={`w-full md:w-1/3 flex flex-col ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-6">Диалоги</h1>
        <div className="bg-white rounded-[24px] overflow-hidden divide-y divide-gray-100 flex-grow shadow-sm">
          {dialogs.map((dialog, idx) => (
            <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} className={`w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors ${activeChatId === dialog.id ? 'bg-gray-50' : ''}`}>
               <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center text-gray-400 flex-shrink-0"><MessageSquare size={20} /></div>
               <div className="overflow-hidden">
                 <div className="font-semibold text-gray-900">Диалог #{dialogs.length - idx}</div>
                 <div className="text-gray-500 text-sm truncate">{dialog.date}</div>
               </div>
            </button>
          ))}
        </div>
      </div>

      {/* Окно самого чата (стиль Виджета) */}
      <div className={`w-full md:w-2/3 bg-white rounded-[30px] flex flex-col overflow-hidden h-[70vh] md:h-[calc(100vh-120px)] border border-gray-100 shadow-sm ${!activeChatId ? 'hidden md:flex items-center justify-center text-gray-400' : 'flex'}`}>
        
        {!activeChatId ? (
          <div>Выберите диалог слева</div>
        ) : (
          <>
            {/* Шапка чата */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white/80 backdrop-blur-md z-10 sticky top-0">
              <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 -ml-2 text-gray-500"><ChevronLeft size={24} /></button>
              <div className="font-bold text-lg">История диалога</div>
            </div>
            
            {/* Баблы как в виджете */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-[#ffffff]">
              {activeChat?.messages.map((msg, i) => (
                <div key={i} className={`flex flex-col w-full ${msg.role === 'ai' ? 'items-start' : 'items-end'}`}>
                  <div className={`max-w-[80%] p-3 px-4 text-[15px] leading-snug ${
                    msg.role === 'ai' 
                    ? 'bg-[#E9E9EB] text-black rounded-[20px] rounded-bl-sm' 
                    : 'bg-[#8BFDA8] text-black rounded-[20px] rounded-br-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}