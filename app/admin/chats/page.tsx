'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('842');

  const dialogs = [
    { id: '842', date: '02.05.2026', time: '14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем могу помочь?'}] },
    { id: '841', date: '01.05.2026', time: '09:15', messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] }
  ];

  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-500 w-full md:w-[900px]">
      <h1 className="text-[#8E8E93] text-xl font-bold mb-4 ml-2">История чатов</h1>
      
      {/* ГЛАВНЫЙ КОНТЕНТ (Большая белая карточка 900x600) */}
      <div className="bg-white rounded-[24px] shadow-sm h-[600px] flex overflow-hidden">
        
        {/* ЛЕВАЯ КОЛОНКА (300px) */}
        <div className="w-full md:w-[300px] border-r border-gray-100 flex flex-col overflow-y-auto divide-y divide-gray-50">
          {dialogs.map((dialog) => (
            <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
              className={`p-5 text-left transition-colors flex items-center justify-between ${activeChatId === dialog.id ? 'bg-[#F2F2F7]' : 'hover:bg-gray-50'}`}>
              <div>
                <div className="font-bold text-lg">Диалог #{dialog.id}</div>
                <div className="text-gray-400 text-sm font-medium mt-0.5">{dialog.date}</div>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* ПРАВАЯ КОЛОНКА (600px) */}
        <div className="hidden md:flex flex-col w-[600px] bg-white">
          {!activeChat ? (
             <div className="flex-1 flex items-center justify-center text-gray-300">Выберите диалог</div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-50 flex items-center justify-between shadow-sm z-10">
                <span className="font-bold text-lg">Диалог №{activeChatId}</span>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Live</span>
              </div>
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-white">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-5 py-3 text-[16px] leading-snug rounded-[22px] ${
                      msg.role === 'ai' ? 'bg-[#F2F2F7] text-black rounded-bl-sm' : 'bg-[#8BFDA8] text-black rounded-br-sm'
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