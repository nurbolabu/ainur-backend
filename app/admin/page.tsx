import Link from 'next/link';
// ДОБАВИЛИ PlaySquare В ИМПОРТ:
import { Settings, Plus, ChevronRight, PlaySquare } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="w-full max-w-[690px] mx-auto px-4 md:px-0 pt-2.5 animate-in fade-in duration-300 flex flex-col gap-8">
      
      {/* 1. HEADER (Логотип и Настройки) */}
      <div className="w-full h-[70px] bg-[#FFFFFF] rounded-[22px] flex items-center justify-between px-5 shadow-sm border border-[#E5E5EA]">
        {/* Логотип из полосок */}
        <div className="flex items-end gap-1">
          <div className="w-[8px] h-[19px] rounded-sm bg-gradient-to-b from-[#8BFDA8] to-[#61D6FB]"></div>
          <div className="w-[8px] h-[14px] rounded-sm bg-gradient-to-b from-[#8BFDA8] to-[#61D6FB]"></div>
          <div className="w-[8px] h-[20px] rounded-sm bg-gradient-to-b from-[#8BFDA8] to-[#61D6FB]"></div>
        </div>
        
        {/* Кнопка настроек */}
        <Link href="/admin/settings" className="w-[50px] h-[50px] bg-[#8BFDA8] rounded-[11px] flex items-center justify-center active:scale-95 transition-transform">
          <Settings size={24} className="text-[#000000]" />
        </Link>
      </div>

      {/* 2. БЛОК STORIES */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-[#949494] text-[14px] font-medium uppercase tracking-wide px-1">Stories</h2>
        
        {/* Горизонтальный скролл для карточек */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          
          {/* Кнопка Добавить */}
          <Link href="/admin/stories" className="w-[140px] h-[165px] md:w-[165px] bg-[#000000] rounded-[22px] p-4 flex flex-col justify-between shrink-0 active:scale-95 transition-transform">
             <div className="w-10 h-10 rounded-full border-[1.5px] border-[#8BFDA8] flex items-center justify-center text-[#8BFDA8] bg-transparent">
               <Plus size={20} />
             </div>
             <div className="text-[#FFFFFF] text-[18px] md:text-[20px] font-medium leading-tight">Добавить<br/>Stories</div>
          </Link>

          {/* Пример залитой сторис */}
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-[140px] h-[165px] md:w-[165px] bg-[#FFFFFF] rounded-[22px] p-4 flex flex-col justify-between shrink-0 shadow-sm border border-[#E5E5EA]">
               <div className="w-10 h-10 rounded-[20px] bg-[#F2F2F7] flex items-center justify-center text-[#FF3B30]">
                 <PlaySquare size={18} fill="currentColor" stroke="none" />
               </div>
               <div className="text-[#949494] text-[14px] md:text-[16px] font-medium">01.05.2026</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. БЛОК СТАТИСТИКИ */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-[#949494] text-[14px] font-medium uppercase tracking-wide px-1">Статистика</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="bg-[#FFFFFF] rounded-[22px] p-5 flex flex-col justify-between h-[150px] shadow-sm border border-[#E5E5EA]">
            <span className="text-[#000000] text-[15px] font-medium leading-tight">Посетителей сайта</span>
            <span className="text-[#000000] text-[24px] font-bold">1200</span>
          </div>
          <div className="bg-[#FFFFFF] rounded-[22px] p-5 flex flex-col justify-between h-[150px] shadow-sm border border-[#E5E5EA]">
            <span className="text-[#000000] text-[15px] font-medium leading-tight">Открытий виджета</span>
            <span className="text-[#000000] text-[24px] font-bold">224</span>
          </div>
          <div className="bg-[#FFFFFF] rounded-[22px] p-5 flex flex-col justify-between h-[150px] shadow-sm border border-[#E5E5EA]">
            <span className="text-[#000000] text-[15px] font-medium leading-tight">Оставили заявку</span>
            <span className="text-[#000000] text-[24px] font-bold">100</span>
          </div>
          <div className="bg-[#FFFFFF] rounded-[22px] p-5 flex flex-col justify-between h-[150px] shadow-sm border border-[#E5E5EA]">
            <span className="text-[#000000] text-[15px] font-medium leading-tight">Нажатий на соцсети</span>
            <span className="text-[#000000] text-[24px] font-bold">62</span>
          </div>
        </div>
      </div>

      {/* 4. БЛОК ПОСЛЕДНИХ ЧАТОВ */}
      <div className="flex flex-col gap-2.5 pb-6">
        <h2 className="text-[#949494] text-[14px] font-medium uppercase tracking-wide px-1">Последние чаты</h2>
        
        <div className="flex flex-col gap-2.5">
          {[1, 2].map((chat) => (
            <Link key={chat} href="/admin/chats" className="bg-[#FFFFFF] rounded-[22px] p-5 flex items-center justify-between shadow-sm border border-[#E5E5EA] active:scale-[0.98] transition-transform">
              <div className="flex flex-col gap-1">
                <span className="text-[#000000] text-[14px]">12:52, 01.05.2026</span>
                <span className="text-[#000000] text-[20px] font-bold uppercase">chat #1234</span>
              </div>
              <div className="text-[#949494]">
                <ChevronRight size={24} />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}