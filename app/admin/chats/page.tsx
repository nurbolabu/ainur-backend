'use client';
import { useState } from 'react';
import { ChevronLeft, MessageSquare } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const dialogs = [
    { id: '842', date: '14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем могу помочь?'}] },
    { id: '841', date: '09:15', messages: [{role: 'client', text: 'Где вы находитесь?'}] }
  ];

  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-500 h-[calc(100vh-100px)] flex flex-col max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Чаты</h1>
        {activeChatId && <h2 className="text-xl font-bold text-gray-400 hidden md:block">Диалог №{activeChatId}</h2>}
      </header>
      
      {/* Контейнер равной высоты */}
      <div className="flex gap-6 flex-1 overflow-hidden pb-6">
        
        {/* Список диалогов (скрывается на мобильном при открытом чате) */}
        <div className={`w-full md:w-80 flex-col card-ios shadow-sm ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
            <h2 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Все сообщения</h2>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${activeChatId === dialog.id ? 'bg-[#8BFDA8]/10' : 'hover:bg-gray-50'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${activeChatId === dialog.id ? 'bg-[#8BFDA8] text-black' : 'bg-[#f5f5f7] text-gray-400'}`}>
                  <MessageSquare size={20} />
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="font-bold text-base truncate">Клиент #{dialog.id}</div>
                  <div className="text-sm truncate text-gray-500">Последнее сообщение...</div>
                </div>
                <div className="text-xs font-medium text-gray-400 mb-auto">{dialog.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Окно самого чата */}
        <div className={`flex-1 card-ios flex-col shadow-sm ${!activeChatId ? 'hidden md:flex items-center justify-center bg-gray-50' : 'flex'}`}>
          {!activeChatId ? (
            <div className="text-gray-400 font-medium flex items-center gap-2"><MessageSquare/> Выберите диалог слева</div>
          ) : (
            <>
              {/* Шапка чата для мобилок */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0 md:hidden">
                <button onClick={() => setActiveChatId(null)} className="p-2 -ml-2 text-black bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
                <span className="font-bold text-lg">Диалог №{activeChatId}</span>
              </div>
              
              {/* Зона сообщений (iMessage Style) */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4 bg-white">
                {activeChat?.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-5 py-3 text-[15px] leading-relaxed rounded-[20px] ${
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