'use client';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('842');

  const dialogs = [
    { id: '842', date: '02.05.2026', time: '14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем могу помочь?'}] },
    { id: '841', date: '01.05.2026', time: '09:15', messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] }
  ];

  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-[#8E8E93] text-2xl font-bold mb-5">История чатов</h1>
      
      {/* КОНТЕЙНЕР 900px С ДВУМЯ КОЛОНКАМИ */}
      <div className="w-[900px] h-[600px] bg-white rounded-[24px] shadow-sm border border-gray-100 flex overflow-hidden">
        
        {/* ЛЕВАЯ КОЛОНКА (300px) */}
        <div className="w-[300px] border-r border-gray-100 flex flex-col overflow-y-auto divide-y divide-gray-100">
          {dialogs.map((dialog) => (
            <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
              className={`p-5 text-left transition-colors ${activeChatId === dialog.id ? 'bg-[#f5f5f7]' : 'hover:bg-gray-50'}`}>
              <div className="font-bold text-lg">Диалог #{dialog.id}</div>
              <div className="text-gray-400 text-sm font-medium mt-1">{dialog.date}</div>
            </button>
          ))}
        </div>

        {/* ПРАВАЯ КОЛОНКА (600px) */}
        <div className="w-[600px] flex flex-col">
          {!activeChat ? (
             <div className="flex-1 flex items-center justify-center text-gray-300">Выберите чат</div>
          ) : (
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-white">
              {activeChat.messages.map((msg, i) => (
                <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[80%] px-5 py-3 text-[16px] leading-relaxed rounded-[20px] ${
                    msg.role === 'ai' ? 'bg-[#f5f5f7] text-black rounded-bl-sm' : 'bg-[#8BFDA8] text-black rounded-br-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}