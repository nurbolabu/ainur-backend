'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronRight } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ company_name: '', theme_color: '#8BFDA8', logo_url: '', system_prompt: '', knowledge_base: '', welcome_message: '' });

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single();
      if (data) setFormData({ company_name: data.company_name || '', theme_color: data.theme_color || '#8BFDA8', logo_url: data.logo_url || '', system_prompt: data.system_prompt || '', knowledge_base: data.knowledge_base || '', welcome_message: data.welcome_message || '' });
      setIsLoading(false);
    }
    loadData();
  }, []);

  async function handleSave() {
    setIsSaving(true);
    const { error } = await supabase.from('projects').update(formData).eq('id', MY_PROJECT_ID);
    setIsSaving(false);
    if (!error) alert('Настройки сохранены!'); else alert('Ошибка сохранения.');
  }

  if (isLoading) return <div className="p-8 text-gray-500">Загрузка настроек...</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-20">
      <header className="mb-8 flex justify-between items-end">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Настройки</h1>
        <button onClick={handleSave} disabled={isSaving} className="bg-black text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-95 transition-all disabled:opacity-50">{isSaving ? '...' : 'Сохранить'}</button>
      </header>

      <div className="space-y-8">
        {/* Группа 1: База знаний ИИ */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">База знаний ИИ</h2>
          <div className="bg-white rounded-[24px] overflow-hidden divide-y divide-gray-100">
            <div className="p-4">
              <label className="text-sm font-medium text-gray-900 block mb-1">Роль ИИ</label>
              <textarea rows={2} value={formData.system_prompt} onChange={e => setFormData({...formData, system_prompt: e.target.value})} className="w-full text-base text-gray-600 bg-transparent outline-none resize-none" placeholder="Вы — дружелюбный ассистент..." />
            </div>
            <div className="p-4">
              <label className="text-sm font-medium text-gray-900 block mb-1">Знания для ИИ</label>
              <textarea rows={4} value={formData.knowledge_base} onChange={e => setFormData({...formData, knowledge_base: e.target.value})} className="w-full text-base text-gray-600 bg-transparent outline-none resize-none" placeholder="Факты, цены, правила компании..." />
            </div>
            <div className="p-4">
              <label className="text-sm font-medium text-gray-900 block mb-1">Приветственное сообщение</label>
              <input type="text" value={formData.welcome_message} onChange={e => setFormData({...formData, welcome_message: e.target.value})} className="w-full text-base text-gray-600 bg-transparent outline-none" placeholder="Здравствуйте! Чем могу помочь?" />
            </div>
          </div>
        </section>

        {/* Группа 2: Дизайн */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Дизайн виджета</h2>
          <div className="bg-white rounded-[24px] overflow-hidden divide-y divide-gray-100">
            <div className="p-4 flex items-center justify-between">
              <label className="text-base font-medium text-gray-900">Название компании</label>
              <input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="text-base text-gray-600 bg-transparent outline-none text-right w-1/2" placeholder="Ваш бренд" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <label className="text-base font-medium text-gray-900">Логотип (URL)</label>
              <input type="text" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="text-base text-gray-600 bg-transparent outline-none text-right w-1/2 truncate" placeholder="https://" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <label className="text-base font-medium text-gray-900">Основной цвет</label>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 uppercase text-sm">{formData.theme_color}</span>
                <input type="color" value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 overflow-hidden bg-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Группа 3: Подписка и помощь */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ml-4">Подписка и помощь</h2>
          <div className="bg-white rounded-[24px] overflow-hidden divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="text-base font-medium text-gray-900">Подписка и оплата</span>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="text-base font-medium text-gray-900">Правила использования</span>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <span className="text-base font-medium text-gray-900">Справочный центр</span>
              <ChevronRight size={20} className="text-gray-300" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}