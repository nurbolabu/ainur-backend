'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ChatsPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Для теста добавил больше сообщений Анне, чтобы показать как работает внутренний скролл
  const dialogs = [
    { 
      id: '842', time: '14:30', name: 'Анна', status: 'online', 
      messages: [
        {role: 'client', text: 'Добрый день, нужна консультация.'}, 
        {role: 'ai', text: 'Здравствуйте! Я ИИ-ассистент, чем могу помочь?'},
        {role: 'client', text: 'Расскажите про ваши услуги и цены на дизайн.'},
        {role: 'ai', text: 'Мы делаем полный цикл дизайна: от логотипов до сложных интерфейсов (UX/UI). Стоимость лендинга начинается от 150 000 ₸. Вас интересует что-то конкретное?'},
        {role: 'client', text: 'Да, нужен интернет-магазин.'}
      ] 
    },
    { 
      id: '841', time: 'Вчера', name: 'Игорь', status: 'offline', 
      messages: [{role: 'client', text: 'Сколько стоит дизайн?'}] 
    }
  ];
  
  const activeChat = dialogs.find(d => d.id === activeChatId);

  return (
    // md:h-[550px] задает общую высоту блока (Заголовок + Контейнер), чтобы она идеально совпадала с меню слева
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100dvh-180px)] md:h-[550px] w-full px-1 md:px-0">
      
      {/* Заголовок страницы (shrink-0 чтобы не сжимался) */}
      <div className={`mb-6 shrink-0 ${activeChatId ? 'hidden md:block' : 'block'}`}>
        <h1 className="ios-large-title mb-0">Чаты</h1>
      </div>

      {/* ГЛАВНЫЙ КОНТЕЙНЕР
        flex-1 заставляет этот блок занять всё оставшееся место от 550px.
        overflow-hidden предотвращает растягивание блока контентом.
      */}
      <div className="flex-1 flex flex-col md:flex-row w-full bg-transparent md:bg-[#FFFFFF] md:rounded-[24px] md:overflow-hidden">
        
        {/* ЛЕВАЯ КОЛОНКА (Список чатов) */}
        <div className={`w-full md:w-[320px] md:border-r border-[#E5E5EA] flex flex-col bg-transparent md:bg-[#FFFFFF] shrink-0 
          ${activeChatId ? 'hidden md:flex' : 'flex'} h-full overflow-hidden`}>
          
          {/* Прокрутка списка чатов */}
          <div className="flex-1 overflow-y-auto space-y-3 md:space-y-0 pb-4 md:pb-0">
            {dialogs.map((dialog) => (
              <button key={dialog.id} onClick={() => setActiveChatId(dialog.id)} 
                className={`w-full flex flex-col px-5 py-4 transition-colors outline-none text-left shrink-0
                  ${activeChatId === dialog.id ? 'bg-[#F2F2F7] md:bg-[#F2F2F7]' : 'bg-[#FFFFFF] hover:bg-[#F9F9F9]'} 
                  rounded-[24px] md:rounded-none md:border-b border-[#E5E5EA]`}>
                
                <div className="flex justify-between items-center w-full mb-1.5">
                  <span className="font-semibold text-[17px] text-[#000000] flex items-center gap-2">
                    {dialog.name}
                    {dialog.status === 'online' && <div className="w-2 h-2 rounded-full bg-[#34C759]"></div>}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[15px] text-[#8E8E93]">{dialog.time}</span>
                    <ChevronRight size={18} className="text-[#C6C6C8] md:hidden" />
                  </div>
                </div>
                <span className="text-[15px] text-[#8E8E93] truncate w-full line-clamp-2 whitespace-normal leading-snug">
                  {dialog.messages[dialog.messages.length - 1].text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Сам диалог чата) */}
        <div className={`flex-1 flex flex-col bg-[#FFFFFF] rounded-[24px] md:rounded-none
          ${!activeChatId ? 'hidden md:flex' : 'flex'} h-full overflow-hidden`}>
          
          {activeChat ? (
            <>
              {/* Шапка диалога (shrink-0 фиксирует её сверху) */}
              <div className="flex items-center justify-between px-2 py-2 border-b border-[#E5E5EA] bg-[#F9F9F9] md:bg-[#FFFFFF]/90 backdrop-blur-md shrink-0 z-10">
                
                <button onClick={() => setActiveChatId(null)} 
                  className="md:hidden text-[#007AFF] flex items-center font-normal text-[17px] active:opacity-50 px-1 transition-opacity">
                  <ChevronLeft size={28} strokeWidth={2} className="-ml-2" />
                  <span className="-ml-1">Назад</span>
                </button>
                
                <div className="hidden md:block w-[70px]"></div>

                {/* Имя и Статус */}
                <div className="flex flex-col items-center flex-1 pr-8 md:pr-0">
                  <span className="font-semibold text-[17px] text-[#000000]">{activeChat.name}</span>
                  {activeChat.status === 'online' ? (
                    <span className="text-[13px] text-[#8E8E93] flex items-center gap-1 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></div> В сети
                    </span>
                  ) : (
                    <span className="text-[13px] text-[#8E8E93] flex items-center gap-1 mt-0.5">
                      Был(а) недавно
                    </span>
                  )}
                </div>
                
                <div className="w-[70px]"></div>
              </div>
              
              {/* Область сообщений (flex-1 и overflow-y-auto делают внутренний скролл) */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4 bg-[#FFFFFF]">
                {activeChat.messages.map((msg, i) => (
                  <div key={i} className={`flex w-full shrink-0 ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] md:max-w-[80%] px-4 py-3 text-[17px] leading-snug rounded-[20px] ${
                      msg.role === 'ai' ? 'bg-[#F2F2F7] text-[#000000] rounded-bl-[4px]' : 'bg-[#8BFDA8] text-[#000000] rounded-br-[4px]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Поле ввода (shrink-0 жестко фиксирует его внизу контейнера) */}
              <div className="p-3 border-t border-[#E5E5EA] bg-[#FFFFFF] shrink-0 pb-[calc(env(safe-area-inset-bottom)+12px)] md:pb-4 z-10">
                {activeChat.status === 'online' ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Сообщение..." 
                      className="flex-1 bg-[#F5F5F7] border border-[#E5E5EA] rounded-full h-[40px] px-4 text-[15px] outline-none text-[#000000] placeholder-[#8E8E93] focus:bg-[#FFFFFF] focus:border-[#8BFDA8] transition-colors"
                    />
                    <button className="w-[40px] h-[40px] shrink-0 rounded-full bg-[#8BFDA8] flex items-center justify-center text-[#000000] font-bold active:scale-95 transition-transform">
                      ↑
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[#F2F2F7] border border-[#E5E5EA] rounded-full h-[40px] px-4 flex items-center justify-center">
                      <span className="text-[#8E8E93] text-[15px]">Пользователь не в сети</span>
                    </div>
                    <button disabled className="w-[40px] h-[40px] shrink-0 rounded-full bg-[#E5E5EA] flex items-center justify-center text-[#8E8E93] font-bold cursor-not-allowed">
                      ↑
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#8E8E93] text-[17px] bg-[#FFFFFF]">
              Выберите диалог для просмотра
            </div>
          )}
        </div>

      </div>
    </div>
  );
}