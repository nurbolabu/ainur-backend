'use client';
import { useState } from 'react';
import { ChevronLeft, MessageSquare } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('842');

  // Заглушка. Позже подтянем из Supabase
  const dialogs = [
    { id: '842', date: '02.05.2026, 14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем могу помочь?'}] },
    { id: '841', date: '01.05.2026, 09:15', messages: [{role: 'client', text: 'Где вы находитесь?'}] }
  ];

  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col max-w-6xl mx-auto pb-20 md:pb-0">
      <header className="mb-6 shrink-0"><h1 className="text-3xl font-bold tracking-tight">Чаты</h1></header>
      
      {/* Контейнер равной высоты */}
      <div className="flex gap-6 flex-1 overflow-hidden pb-6">
        
        {/* Список баблов (Скрывается на мобильном, если открыт чат) */}
        <div className={`w-full md:w-80 space-y-3 overflow-y-auto ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {dialogs.map((dialog) => (
            <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
              className={`ios-bubble w-full flex items-center gap-4 p-4 text-left hover:scale-[0.99] transition-all border-[3px] ${activeChatId === dialog.id ? 'border-[#8BFDA8]' : 'border-transparent'}`}>
              <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center text-gray-400 flex-shrink-0"><MessageSquare size={22} /></div>
              <div className="overflow-hidden">
                <div className="font-bold text-lg">Клиент #{dialog.id}</div>
                <div className="text-gray-500 text-sm truncate mt-0.5">Последнее сообщение...</div>
              </div>
              <div className="text-xs text-gray-400 mb-auto">{dialog.date.split(',')[1]}</div>
            </button>
          ))}
        </div>

        {/* Окно самого чата (Один большой белый "баббл") */}
        <div className={`flex-1 ios-bubble flex-col ${!activeChatId ? 'hidden md:flex items-center justify-center bg-transparent border-2 border-dashed border-gray-300 text-gray-300' : 'flex'}`}>
          {!activeChatId ? (
            <div className="text-gray-400 font-bold text-lg flex items-center gap-3"><MessageSquare size={28}/> Выберите диалог</div>
          ) : (
            <>
              {/* Шапка чата для мобилок */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0 md:hidden">
                <button onClick={() => setActiveChatId(null)} className="p-2 -ml-2 text-black bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                <span className="font-bold text-xl">Диалог #{activeChatId}</span>
              </div>
              
              {/* Зона сообщений (iMessage Style) */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3 bg-white">
                {activeChat?.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-5 py-3.5 text-[16px] leading-snug rounded-[22px] ${
                      msg.role === 'ai' ? 'bg-[#f5f5f7] text-black rounded-bl-sm' : 'bg-[#8BFDA8] text-black rounded-br-sm'
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
    </div>
  );
}