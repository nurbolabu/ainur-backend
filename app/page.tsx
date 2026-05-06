import { Bot } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-full w-full">
      {/* Заголовок страницы (24px, как договаривались) */}
      <h1 className="text-[24px] font-bold mb-4 px-1">Главная</h1>

      {/* Главный модуль (16px скругление) */}
      <div className="bg-[#FFFFFF] rounded-[16px] border border-[#E5E5EA] p-6 flex-1 flex flex-col items-center justify-center text-center shadow-sm">
        
        <div className="w-20 h-20 bg-[#8BFDA8]/20 text-[#8BFDA8] rounded-full flex items-center justify-center mb-5">
          <Bot size={40} className="text-[#34C759]" />
        </div>
        
        <h2 className="text-[20px] font-bold text-[#000000] mb-2">
          Добро пожаловать в AI NUR
        </h2>
        
        <p className="text-[15px] text-[#8E8E93] max-w-[320px] mb-8 leading-snug">
          Это ваша панель управления. Здесь вы можете следить за чатами, управлять каталогом товаров и настраивать ИИ-ассистента.
        </p>
        
        {/* Фирменная зеленая кнопка (8px скругление) */}
        <button className="bg-[#8BFDA8] text-[#000000] font-semibold text-[15px] px-8 py-3.5 rounded-[8px] transition-transform active:scale-[0.98]">
          Перейти к настройкам
        </button>

      </div>
    </div>
  );
}