'use client';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const dialogs = [
    { id: '842', date: '02.05.2026', time: '14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем могу помочь?'}] },
    { id: '841', date: '01.05.2026', time: '09:15', messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] }
  ];

  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-500 w-full md:w-[900px] max-w-full h-full md:h-auto flex flex-col">
      <h1 className="text-[#8E8E93] text-xl md:text-2xl font-bold mb-4 px-2 md:px-0 shrink-0 hidden md:block">История чатов</h1>
      
      {/* КОНТЕЙНЕР (ПК: 900x600, Мобайл: на весь экран) */}
      <div className="bg-white rounded-[24px] border border-[#E5E5EA] flex overflow-hidden flex-1 md:h-[600px]">
        
        {/* ЛЕВАЯ КОЛОНКА (Список) */}
        <div className={`w-full md:w-[300px] md:border-r border-[#E5E5EA] flex-col overflow-y-auto ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 md:hidden border-b border-[#E5E5EA] bg-[#F2F2F7]">
             <h1 className="text-xl font-bold">Чаты</h1>
          </div>
          <div className="divide-y divide-[#E5E5EA]">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full p-4 text-left transition-colors flex items-center justify-between ${activeChatId === dialog.id ? 'bg-[#F2F2F7]' : 'hover:bg-[#F2F2F7]/50 active:bg-[#F2F2F7]'}`}>
                <div>
                  <div className="font-bold text-[17px] text-gray-900">Диалог #{dialog.id}</div>
                  <div className="text-gray-400 text-[14px] mt-0.5">{dialog.messages[0].text.substring(0, 20)}...</div>
                </div>
                <div className="text-gray-400 text-[13px] font-medium">{dialog.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Сам чат) */}
        <div className={`w-full md:w-[600px] flex-col bg-white ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {!activeChat ? (
             <div className="flex-1 flex items-center justify-center text-gray-400 text-[17px]">Выберите чат из списка</div>
          ) : (
            <>
              {/* Шапка для мобильного */}
              <div className="md:hidden flex items-center gap-2 p-3 border-b border-[#E5E5EA] bg-[#F2F2F7] shrink-0">
                <button onClick={() => setActiveChatId(null)} className="flex items-center text-black active:opacity-50">
                  <ChevronLeft size={28} />
                  <span className="font-medium text-[17px] -ml-1">Назад</span>
                </button>
                <div className="font-bold text-[17px] ml-auto pr-4">#{activeChatId}</div>
              </div>

              {/* История сообщений */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] md:max-w-[75%] px-4 py-2.5 text-[16px] leading-snug rounded-[20px] ${
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