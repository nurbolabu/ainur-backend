'use client';
import { useState } from 'react';
import { ChevronLeft, MessageSquare } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Заглушка (Позже будет fetch)
  const dialogs = [
    { id: '842', time: '14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем помочь?'}] },
    { id: '841', time: '09:15', messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] }
  ];
  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100vh-100px)] md:h-[650px] w-full">
      <h1 className={`text-3xl font-bold mb-6 px-1 shrink-0 ${activeChatId ? 'hidden md:block' : 'block'}`}>История</h1>

      <div className="flex gap-6 flex-1 overflow-hidden pb-6">
        
        {/* ЛЕВЫЙ БАБЛ (Список диалогов) */}
        <div className={`ios-bubble mb-0 w-full md:w-[320px] flex-col overflow-y-auto ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-gray-100 bg-[#F5F5F7] shrink-0">
            <h2 className="font-bold text-xl">Все диалоги</h2>
          </div>
          <div className="divide-y divide-gray-100 flex-1">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full flex items-start gap-4 p-5 text-left transition-colors ${activeChatId === dialog.id ? 'bg-[#8BFDA8]/10' : 'bg-white hover:bg-[#F2F2F7]'}`}>
                <div className="w-[42px] h-[42px] rounded-full bg-[#F2F2F7] flex items-center justify-center shrink-0 text-gray-400"><MessageSquare size={18}/></div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-bold text-lg text-black">Клиент #{dialog.id}</span>
                    <span className="text-sm font-bold text-gray-400">{dialog.time}</span>
                  </div>
                  {/* ИСПРАВЛЕНИЕ: Добавлен ? для безопасности */}
                  <div className="text-sm text-gray-500 truncate">{dialog.messages[0]?.text}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВЫЙ БАБЛ (Окно переписки) */}
        <div className={`ios-bubble mb-0 flex-1 flex-col ${!activeChatId ? 'hidden md:flex items-center justify-center bg-[#F5F5F7] border-2 border-dashed border-gray-300' : 'flex'}`}>
          {!activeChatId ? (
            <div className="text-gray-400 font-bold text-lg flex items-center gap-3"><MessageSquare size={24}/> Выберите диалог</div>
          ) : (
            <>
              {/* Шапка чата для мобильных */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-[#F2F2F7] shrink-0 md:hidden">
                <button onClick={() => setActiveChatId(null)} className="p-2 -ml-2 text-black bg-white rounded-full active:scale-95"><ChevronLeft size={20} /></button>
                <span className="font-bold text-xl">Диалог #{activeChatId}</span>
              </div>
              
              <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-4 bg-white">
                {/* ИСПРАВЛЕНИЕ ОШИБКИ VERCEL: Добавлен ? после activeChat */}
                {activeChat?.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-5 py-3 text-[16px] leading-snug rounded-[20px] ${
                      msg.role === 'ai' ? 'bg-[#F2F2F7] text-black rounded-bl-[4px]' : 'bg-[#8BFDA8] text-black rounded-br-[4px]'
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