'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Bot, 
  Database, 
  Palette, 
  MessageSquare, 
  Bell, 
  CreditCard, 
  LogOut, 
  ChevronRight,
  Building2
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('ainur_admin_project_id');
    if (id) {
      setProjectId(id);
    }
  }, []);

  function handleLogout() {
    if (confirm('Выйти из текущего проекта?')) {
      localStorage.removeItem('ainur_admin_project_id');
      router.push('/login'); // Перенаправляем на страницу входа
    }
  }

  // Вспомогательный компонент для строки настроек (как в iOS)
  const SettingsRow = ({ icon: Icon, color, title, isLast = false, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 cursor-pointer active:bg-[#F2F2F7] transition-colors ${!isLast ? 'border-b border-[#E5E5EA]' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Иконка в цветном квадрате со скруглением, как в iPhone */}
        <div className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#FFFFFF]`} style={{ backgroundColor: color }}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <span className="text-[16px] font-medium text-[#000000]">{title}</span>
      </div>
      <ChevronRight size={20} strokeWidth={1.5} className="text-[#C6C6C8]" />
    </div>
  );

  return (
    <div className="w-full max-w-[690px] mx-auto px-[17px] md:px-0 pt-[100px] animate-in fade-in duration-300 flex flex-col gap-6 pb-[100px]">
      
      {/* 1. ФИКСИРОВАННЫЙ HEADER */}
      <div className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[calc(100%-34px)] md:w-full max-w-[690px] z-40 bg-[#FFFFFF] rounded-[22px] flex items-center justify-between pl-[20px] pr-[10px] py-[10px] border border-[#E5E5EA]">
        <Link href="/admin">
          <svg width="99" height="14" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="black"/>
            <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="black"/>
            <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="black"/>
            <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
          </svg>
        </Link>
        {/* Вместо кнопки настроек ставим заглушку, так как мы уже в настройках */}
        <div className="w-[50px] h-[50px]"></div>
      </div>

      <div className="px-1 mt-2">
        <h1 className="text-[28px] font-bold text-[#000000]">Настройки</h1>
      </div>

      {/* 2. КАРТОЧКА КОМПАНИИ ПРОФИЛЯ */}
      <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-5 flex items-center gap-4">
        <div className="w-[70px] h-[70px] bg-[#F2F2F7] rounded-full flex items-center justify-center shrink-0 border border-[#E5E5EA]">
          <Building2 size={32} strokeWidth={1} className="text-[#8E8E93]" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-[20px] font-bold text-[#000000] leading-tight">Моя Компания</h2>
          <p className="text-[14px] text-[#8E8E93] mt-1 font-mono">{projectId ? `ID: ${projectId.substring(0, 8)}...` : 'Загрузка...'}</p>
        </div>
      </div>

      {/* 3. НАСТРОЙКИ: ИИ и База знаний */}
      <div className="flex flex-col gap-2">
        <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Интеллект</span>
        <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
          <SettingsRow 
            icon={Bot} color="#007AFF" title="Промпт и поведение" 
            onClick={() => alert('Здесь будет настройка промпта')} 
          />
          <SettingsRow 
            icon={Database} color="#5856D6" title="База знаний (Файлы)" isLast={true} 
            onClick={() => alert('Здесь будет загрузка PDF/TXT файлов')} 
          />
        </div>
      </div>

      {/* 4. НАСТРОЙКИ: Виджет */}
      <div className="flex flex-col gap-2">
        <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Виджет</span>
        <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
          <SettingsRow 
            icon={Palette} color="#FF9500" title="Внешний вид и цвета" 
            onClick={() => alert('Здесь будут настройки дизайна')} 
          />
          <SettingsRow 
            icon={MessageSquare} color="#34C759" title="Приветственное сообщение" isLast={true} 
            onClick={() => alert('Здесь будет настройка стартового текста')} 
          />
        </div>
      </div>

      {/* 5. НАСТРОЙКИ: Дополнительно */}
      <div className="flex flex-col gap-2">
        <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Дополнительно</span>
        <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
          <SettingsRow 
            icon={Bell} color="#FF3B30" title="Уведомления в Telegram" 
            onClick={() => alert('Здесь будет привязка Telegram-бота')} 
          />
          <SettingsRow 
            icon={CreditCard} color="#8E8E93" title="Тариф и подписка" isLast={true} 
            onClick={() => alert('Здесь будет инфа по тарифу')} 
          />
        </div>
      </div>

      {/* 6. КНОПКА ВЫХОДА */}
      <div className="mt-4">
        <div 
          onClick={handleLogout}
          className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-4 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <LogOut size={20} strokeWidth={1.5} className="text-[#FF3B30]" />
          <span className="text-[16px] font-semibold text-[#FF3B30]">Выйти из проекта</span>
        </div>
      </div>

    </div>
  );
}