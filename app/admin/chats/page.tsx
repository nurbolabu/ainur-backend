'use client';
import { useState } from 'react';
import { ChevronLeft, MessageSquare } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('842');

  const dialogs = [
    { id: '842', date: '02.05.2026', time: '14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем могу помочь?'}] },
    { id: '841', date: '01.05.2026', time: '09:15', messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] }
  ];
  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-[calc(100vh-100px)] md:h-[600px] w-full">
      <h1 className="text-2xl font-bold text-gray-400 mb-6 px-2 shrink-0">История чатов</h1>

      {/* Огромный белый бабл на весь экран */}
      <div className="card-ios flex overflow-hidden flex-1 w-full">
        
        {/* Список (Слева) */}
        <div className={`w-full md:w-[340px] border-r border-gray-100 flex-col overflow-y-auto ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 border-b border-gray-50 bg-[#F2F2F7]">
            <h2 className="font-bold text-xl">Все диалоги</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full flex items-start gap-4 p-5 text-left transition-colors ${activeChatId === dialog.id ? 'bg-[#8BFDA8]/10' : 'bg-white hover:bg-gray-50'}`}>
                <div className="w-[48px] h-[48px] rounded-full bg-[#F2F2F7] flex items-center justify-center shrink-0 text-gray-400"><MessageSquare size={20}/></div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-bold text-[18px] text-black mb-1">Клиент #{dialog.id}</div>
                  <div className="text-[15px] text-gray-500 truncate">{dialog.messages[0].text}</div>
                </div>
                <div className="text-[13px] font-bold text-gray-400">{dialog.time}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Зона переписки (Справа) */}
        <div className={`flex-1 flex-col bg-white ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              <div className="flex items-center gap-3 p-5 border-b border-gray-100 shrink-0">
                <button onClick={() => setActiveChatId(null)} className="md:hidden p-2 bg-[#F2F2F7] rounded-full text-black active:scale-95"><ChevronLeft size={24} /></button>
                <div className="font-bold text-xl">Диалог #{activeChatId}</div>
              </div>
              <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-4">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-5 py-3.5 text-[16px] leading-snug rounded-[24px] ${
                      msg.role === 'ai' ? 'bg-[#F2F2F7] text-black rounded-bl-sm' : 'bg-[#8BFDA8] text-black rounded-br-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex-1 flex items-center justify-center text-gray-300 font-bold text-xl">Выберите диалог</div>}
        </div>

      </div>
    </div>
  );
}