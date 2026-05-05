'use client';
import { useState } from 'react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>('842');

  const dialogs = [
    { id: '842', time: '14:30', name: 'Анна', messages: [{role: 'client', text: 'Добрый день, нужна консультация.'}, {role: 'ai', text: 'Здравствуйте! Я ИИ-ассистент, чем могу помочь?'}] },
    { id: '841', time: 'Вчера', name: 'Игорь', messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] }
  ];
  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100dvh-120px)] md:h-[calc(100vh-80px)] w-full">
      <div className="ios-module flex-1 flex flex-col md:flex-row mb-0 overflow-hidden">
        
        {/* ЛЕВАЯ КОЛОНКА (Master - 300px) */}
        <div className={`w-full md:w-[300px] border-r border-[#E5E5EA] flex-col overflow-y-auto bg-[#FFFFFF] shrink-0 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 pb-4 border-b border-[#E5E5EA]">
            <h1 className="ios-large-title !mb-0 !text-[28px]">Чаты</h1>
          </div>
          <div className="flex-1">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full flex flex-col px-6 py-4 border-b border-[#E5E5EA] transition-colors outline-none ${activeChatId === dialog.id ? 'bg-[#F2F2F7]' : 'bg-[#FFFFFF] hover:bg-[#F9F9F9]'}`}>
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-semibold text-[17px] text-[#000000]">{dialog.name}</span>
                  <span className="text-[15px] text-[#8E8E93]">{dialog.time}</span>
                </div>
                <span className="text-[15px] text-[#8E8E93] truncate w-full text-left line-clamp-2 whitespace-normal">{dialog.messages[0].text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Detail) */}
        <div className={`flex-1 flex-col bg-[#FFFFFF] ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              {/* Шапка чата */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5EA] bg-[#FFFFFF]/90 backdrop-blur-md">
                <button onClick={() => setActiveChatId(null)} className="md:hidden text-[#8BFDA8] font-medium text-[17px] active:opacity-50">Назад</button>
                <div className="font-semibold text-[17px] text-[#000000] flex-1 text-center md:text-left">Чат #{activeChatId}</div>
                <div className="w-12 md:hidden"></div>
              </div>
              
              {/* Сообщения */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] px-4 py-3 text-[17px] leading-snug rounded-[20px] ${
                      msg.role === 'ai' ? 'bg-[#F2F2F7] text-[#000000] rounded-bl-[4px]' : 'bg-[#8BFDA8] text-[#000000] rounded-br-[4px]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : <div className="flex-1 flex items-center justify-center text-[#8E8E93] text-[17px]">Выберите диалог для просмотра</div>}
        </div>

      </div>
    </div>
  );
}