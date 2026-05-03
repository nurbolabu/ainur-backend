'use client';
import { useState } from 'react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('842');

  const dialogs = [
    { id: '842', time: '14:30', messages: [{role: 'client', text: 'Добрый день, нужна консультация.'}, {role: 'ai', text: 'Здравствуйте! Я ИИ-ассистент, чем могу помочь?'}] },
    { id: '841', time: 'Вчера', messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] }
  ];
  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100vh-120px)] md:h-[650px] w-full">
      
      {/* Контейнер 900px, скругление 24px, без теней */}
      <div className="ios-module flex-1 flex flex-col md:flex-row mb-0">
        
        {/* ЛЕВАЯ КОЛОНКА (300px) */}
        <div className={`w-full md:w-[300px] border-r border-[#E5E5EA] flex-col overflow-y-auto ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 pb-2">
            <h1 className="ios-title-2 mb-0">Чаты</h1>
          </div>
          <div className="flex-1">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full flex flex-col p-4 border-b border-[#E5E5EA] transition-colors ${activeChatId === dialog.id ? 'bg-[#F5F5F7]' : 'bg-[#FFFFFF]'}`}>
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-semibold text-[17px] text-[#000000]">Чат #{dialog.id}</span>
                  <span className="text-[15px] text-[#8E8E93]">{dialog.time}</span>
                </div>
                <span className="text-[15px] text-[#8E8E93] truncate w-full text-left">{dialog.messages[0].text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (600px) */}
        <div className={`flex-1 flex-col bg-[#FFFFFF] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Шапка чата */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5EA] bg-[#FFFFFF]/90 backdrop-blur-md">
                <button onClick={() => setActiveChatId(null)} className="md:hidden text-[#8E8E93] font-medium text-[17px]">Назад</button>
                <div className="font-semibold text-[17px] text-[#000000]">Чат #{activeChatId}</div>
                <div className="w-10"></div>
              </div>
              
              {/* Баблы (Сообщения) */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] px-4 py-2.5 text-[17px] leading-snug rounded-[20px] ${
                      msg.role === 'ai' ? 'bg-[#F5F5F7] text-[#000000] rounded-bl-[4px]' : 'bg-[#8BFDA8] text-[#000000] rounded-br-[4px]'
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