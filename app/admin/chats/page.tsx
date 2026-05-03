'use client';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('842');
  const dialogs = [{ id: '842', time: '14:30', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем помочь?'}] }];
  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100vh-100px)] md:h-[600px] w-full px-4 md:px-0">
      <h1 className={`ios-large-title mt-4 ${activeChatId ? 'hidden md:block' : 'block'}`}>Чаты</h1>

      <div className="flex gap-4 flex-1 overflow-hidden pb-4">
        
        {/* Список (Бабл 1) */}
        <div className={`ios-bubble mb-0 w-full md:w-[320px] flex-col overflow-y-auto ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {dialogs.map((dialog) => (
            <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
              className={`flex items-center gap-3 p-4 text-left border-b border-[#C6C6C8] transition-colors ${activeChatId === dialog.id ? 'bg-[#8BFDA8]/20' : 'bg-white active:bg-[#E5E5EA]'}`}>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-semibold text-[17px] text-black">Клиент #{dialog.id}</span>
                  <span className="text-[15px] text-[#8E8E93]">{dialog.time}</span>
                </div>
                <div className="text-[15px] text-[#8E8E93] truncate">{dialog.messages[0].text}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Диалог (Бабл 2) */}
        <div className={`ios-bubble mb-0 flex-1 flex-col bg-white ${!activeChatId ? 'hidden md:flex items-center justify-center text-[#8E8E93]' : 'flex'}`}>
          {activeChat ? (
            <>
              <div className="flex items-center gap-2 p-3 bg-[#F2F2F7] shrink-0 border-b border-[#C6C6C8]">
                <button onClick={() => setActiveChatId(null)} className="md:hidden flex items-center text-black active:opacity-50">
                  <ChevronLeft size={28} /><span className="text-[17px] -ml-1">Назад</span>
                </button>
                <div className="flex-1 flex justify-center md:justify-start md:pl-2">
                  <span className="text-[15px] font-semibold text-black">Клиент #{activeChatId}</span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] px-4 py-2 text-[17px] leading-snug rounded-[20px] ${msg.role === 'ai' ? 'bg-[#E5E5EA] text-black rounded-bl-[4px]' : 'bg-[#8BFDA8] text-black rounded-br-[4px]'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="text-[17px]">Выберите диалог</div>}
        </div>

      </div>
    </div>
  );
}