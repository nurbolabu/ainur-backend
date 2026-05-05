'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ChatsPage() {
  // По умолчанию null, чтобы на мобилке всегда сначала открывался список
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const dialogs = [
    { id: '842', time: '14:30', name: 'Анна', messages: [{role: 'client', text: 'Добрый день, нужна консультация.'}, {role: 'ai', text: 'Здравствуйте! Я ИИ-ассистент, чем могу помочь?'}] },
    { id: '841', time: 'Вчера', name: 'Игорь', messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] }
  ];
  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-full w-full px-1 md:px-0">
      
      {/* Заголовок страницы (Скрывается на мобилке, если открыт диалог) */}
      <div className={`mb-6 ${activeChatId ? 'hidden md:block' : 'block'}`}>
        <h1 className="ios-large-title mb-0">Чаты</h1>
      </div>

      {/* ГЛАВНЫЙ КОНТЕЙНЕР
        На десктопе: это один большой бабл (md:ios-module), внутри которого две колонки.
        На мобилке: это просто прозрачный контейнер, внутри которого баблы переключаются.
      */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-[calc(100dvh-180px)] md:h-[650px] md:ios-module md:overflow-hidden md:!mb-0">
        
        {/* ЛЕВАЯ КОЛОНКА (Список чатов) */}
        <div className={`w-full md:w-[320px] md:border-r border-[#E5E5EA] flex-col bg-[#FFFFFF] shrink-0 
          ${activeChatId ? 'hidden md:flex' : 'flex'} 
          ios-module md:!rounded-none md:!mb-0 md:!shadow-none overflow-y-auto`}>
          
          <div className="flex-1">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full flex flex-col px-4 py-3 border-b border-[#E5E5EA] transition-colors outline-none 
                  ${activeChatId === dialog.id ? 'bg-[#F2F2F7] md:bg-[#F2F2F7]' : 'bg-[#FFFFFF] hover:bg-[#F9F9F9]'}`}>
                <div className="flex justify-between items-center w-full mb-1">
                  <span className="font-semibold text-[17px] text-[#000000]">{dialog.name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[15px] text-[#8E8E93]">{dialog.time}</span>
                    <ChevronRight size={18} className="text-[#C6C6C8] md:hidden" />
                  </div>
                </div>
                <span className="text-[15px] text-[#8E8E93] truncate w-full text-left line-clamp-2 whitespace-normal leading-snug">
                  {dialog.messages[0].text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Сам диалог чата) */}
        <div className={`flex-1 flex-col bg-[#FFFFFF] 
          ${!activeChatId ? 'hidden md:flex' : 'flex'} 
          ios-module md:!rounded-none md:!mb-0 md:!shadow-none overflow-hidden h-full`}>
          
          {activeChat ? (
            <>
              {/* Шапка диалога */}
              <div className="flex items-center justify-between px-2 py-3 border-b border-[#E5E5EA] bg-[#F9F9F9] md:bg-[#FFFFFF]/90 backdrop-blur-md shrink-0">
                
                {/* Кнопка Назад (Только мобилка) в строгом стиле iOS */}
                <button onClick={() => setActiveChatId(null)} 
                  className="md:hidden text-[#007AFF] flex items-center font-normal text-[17px] active:opacity-50 px-1 transition-opacity">
                  <ChevronLeft size={28} strokeWidth={2} className="-ml-2" />
                  <span className="-ml-1">Назад</span>
                </button>
                
                <div className="hidden md:block w-[70px]"></div> {/* Пустышка для десктопа */}

                <div className="font-semibold text-[17px] text-[#000000] flex-1 text-center truncate pr-8 md:pr-0">
                  {activeChat.name}
                </div>
                
                <div className="w-[70px]"></div> {/* Балансир для центрирования заголовка */}
              </div>
              
              {/* Сообщения */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4 bg-[#FFFFFF]">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] md:max-w-[80%] px-4 py-3 text-[17px] leading-snug rounded-[20px] ${
                      msg.role === 'ai' ? 'bg-[#F2F2F7] text-[#000000] rounded-bl-[4px]' : 'bg-[#8BFDA8] text-[#000000] rounded-br-[4px]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Поле ввода (заглушка для красоты) */}
              <div className="p-3 border-t border-[#E5E5EA] bg-[#FFFFFF] shrink-0 pb-[calc(env(safe-area-inset-bottom)+12px)] md:pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#F5F5F7] border border-[#E5E5EA] rounded-full h-[40px] px-4 flex items-center">
                    <span className="text-[#8E8E93] text-[15px]">Сообщение...</span>
                  </div>
                  <button className="w-[40px] h-[40px] rounded-full bg-[#8BFDA8] flex items-center justify-center text-[#000000] font-bold active:scale-95 transition-transform">
                    ↑
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#8E8E93] text-[17px] bg-[#F2F2F7] md:bg-[#FFFFFF]">
              Выберите диалог для просмотра
            </div>
          )}
        </div>

      </div>
    </div>
  );
}