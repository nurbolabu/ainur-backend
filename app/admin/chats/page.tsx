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
    <div className="animate-in fade-in duration-500 h-full flex flex-col max-w-6xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Чаты</h1>
        {activeChatId && <h2 className="text-xl font-semibold text-gray-400">Диалог №{activeChatId}</h2>}
      </header>
      
      <div className="flex gap-6 h-[calc(100vh-160px)]">
        {/* Список */}
        <div className={`w-full md:w-80 flex flex-col card-ios ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="divide-y divide-gray-100 overflow-y-auto">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full flex items-center gap-4 p-4 text-left transition-colors ${activeChatId === dialog.id ? 'bg-black text-white' : 'hover:bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activeChatId === dialog.id ? 'bg-gray-800 text-[#8BFDA8]' : 'bg-[#f5f5f7] text-gray-400'}`}>
                  <MessageSquare size={20} />
                </div>
                <div className="overflow-hidden flex-1">
                  <div className={`font-semibold ${activeChatId === dialog.id ? 'text-white' : 'text-gray-900'}`}>Клиент #{dialog.id}</div>
                  <div className={`text-sm truncate ${activeChatId === dialog.id ? 'text-gray-400' : 'text-gray-500'}`}>Последнее сообщение...</div>
                </div>
                <div className="text-xs opacity-50">{dialog.date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Чат */}
        <div className={`flex-1 card-ios flex flex-col ${!activeChatId ? 'hidden md:flex items-center justify-center text-gray-400' : 'flex'}`}>
          {!activeChatId ? (
            <span>Выберите диалог для просмотра</span>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 md:hidden">
                <button onClick={() => setActiveChatId(null)}><ChevronLeft /></button>
                <span className="font-bold">Диалог №{activeChatId}</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3">
                {activeChat?.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 text-[15px] rounded-[20px] ${
                      msg.role === 'ai' ? 'bg-[#EDEDED] text-black rounded-bl-none' : 'bg-[#8BFDA8] text-black rounded-br-none'
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