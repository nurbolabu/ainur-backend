'use client';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const dialogs = [
    { id: '842', time: '14:30', msg: 'Привет!', messages: [{role: 'client', text: 'Привет!'}, {role: 'ai', text: 'Здравствуйте! Чем могу помочь?'}] },
    { id: '841', time: 'Вчера', msg: 'Где вы находитесь?', messages: [{role: 'client', text: 'Где вы находитесь?'}] }
  ];
  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100vh-100px)] md:h-[600px] w-full">
      <h1 className={`ios-title mt-4 ${activeChatId ? 'hidden md:block' : 'block'}`}>Чаты</h1>

      <div className="bg-white rounded-[10px] md:border border-[#E5E5EA] flex overflow-hidden flex-1 mx-4 md:mx-0 shadow-sm">
        
        {/* Список (Слева) */}
        <div className={`w-full md:w-[320px] md:border-r border-[#E5E5EA] flex-col overflow-y-auto ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {dialogs.map((dialog) => (
            <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
              className={`flex items-start gap-3 p-4 text-left border-b border-[#E5E5EA] transition-colors ${activeChatId === dialog.id ? 'bg-[#2C62FF]/10' : 'bg-white active:bg-[#F2F2F7]'}`}>
              <div className="w-[45px] h-[45px] rounded-full bg-gray-200 shrink-0"></div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-semibold text-[17px] text-black">Клиент #{dialog.id}</span>
                  <span className="text-[15px] text-[#8E8E93]">{dialog.time}</span>
                </div>
                <div className="text-[15px] text-[#8E8E93] truncate">{dialog.msg}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Диалог (iMessage) */}
        <div className={`flex-1 flex-col bg-white ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              <div className="flex items-center gap-2 p-3 border-b border-[#E5E5EA] bg-[#F2F2F7]/80 backdrop-blur-md shrink-0">
                <button onClick={() => setActiveChatId(null)} className="md:hidden flex items-center text-[#007AFF] active:opacity-50">
                  <ChevronLeft size={28} /><span className="text-[17px] -ml-1">Назад</span>
                </button>
                <div className="flex flex-col items-center flex-1 pr-8 md:pr-0">
                  <span className="text-[13px] text-[#8E8E93]">Кому:</span>
                  <span className="text-[15px] font-medium">Клиент #{activeChatId}</span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] px-3.5 py-2 text-[17px] leading-snug rounded-[18px] ${
                      msg.role === 'ai' ? 'bg-[#E9E9EB] text-black rounded-bl-[4px]' : 'bg-[#007AFF] text-white rounded-br-[4px]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex-1 flex items-center justify-center text-[#8E8E93] text-[17px]">Выберите диалог</div>}
        </div>
      </div>
    </div>
  );
}