'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronRight, Search } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [formData, setFormData] = useState({ company_name: 'Название', theme_color: '#8BFDA8', logo_url: '', system_prompt: '', knowledge_base: '', welcome_message: '' });

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single().then(({ data }) => {
      if (data) setFormData({ ...formData, ...data });
    });
  }, []);

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="ios-title mt-4">Настройки</h1>

      {/* iOS Search Bar */}
      <div className="px-4 md:px-0 mb-6">
        <div className="bg-[#E3E3E8]/60 flex items-center gap-2 px-3 py-1.5 rounded-[10px]">
          <Search size={18} className="text-[#8E8E93]" />
          <input type="text" placeholder="Поиск" className="bg-transparent border-none outline-none text-[17px] w-full placeholder:text-[#8E8E93]" />
        </div>
      </div>

      {/* Apple ID Style Card */}
      <div className="ios-list p-3">
        <button className="flex items-center justify-between active:opacity-50 transition-opacity w-full text-left">
          <div className="flex items-center gap-4">
            <div className="w-[60px] h-[60px] rounded-full bg-gray-200 overflow-hidden">
              {formData.logo_url ? <img src={formData.logo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#8BFDA8]"></div>}
            </div>
            <div>
              <div className="text-[20px] font-normal text-black leading-tight">{formData.company_name}</div>
              <div className="text-[13px] font-normal text-[#8E8E93] mt-0.5">Аккаунт, настройки и другое</div>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#C7C7CC]" />
        </button>
      </div>

      <div className="ios-list">
        <button className="ios-list-item group">
          <span className="ios-list-text">Роль ИИ</span>
          <div className="ios-list-value"><span className="truncate max-w-[120px]">Ассистент</span> <ChevronRight size={20} className="text-[#C7C7CC]" /></div>
        </button>
        <button className="ios-list-item group">
          <span className="ios-list-text">База знаний</span>
          <div className="ios-list-value"><ChevronRight size={20} className="text-[#C7C7CC]" /></div>
        </button>
        <button className="ios-list-item group">
          <span className="ios-list-text">Приветствие</span>
          <div className="ios-list-value"><ChevronRight size={20} className="text-[#C7C7CC]" /></div>
        </button>
      </div>

      <div className="ios-list">
        <button className="ios-list-item group">
          <span className="ios-list-text">Логотип (URL)</span>
          <div className="ios-list-value"><ChevronRight size={20} className="text-[#C7C7CC]" /></div>
        </button>
        <div className="ios-list-item">
          <span className="ios-list-text">Цвет виджета</span>
          <div className="flex items-center gap-3">
            <span className="text-[17px] text-[#8E8E93] uppercase">{formData.theme_color}</span>
            <input type="color" value={formData.theme_color} readOnly className="w-8 h-8 rounded-full border-none p-0 bg-transparent" />
          </div>
        </div>
      </div>

      <div className="ios-list">
        <button className="ios-list-item group">
          <span className="ios-list-text">Подписка и оплата</span>
          <div className="ios-list-value"><div className="w-5 h-5 rounded-full bg-red-500 text-white text-[12px] flex items-center justify-center font-bold">1</div><ChevronRight size={20} className="text-[#C7C7CC]" /></div>
        </button>
      </div>
    </div>
  );
}