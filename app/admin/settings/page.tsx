'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ company_name: '', theme_color: '#8BFDA8', logo_url: '', system_prompt: '', knowledge_base: '', welcome_message: '' });

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single().then(({ data }) => {
      if (data) setFormData({ company_name: data.company_name || '', theme_color: data.theme_color || '#8BFDA8', logo_url: data.logo_url || '', system_prompt: data.system_prompt || '', knowledge_base: data.knowledge_base || '', welcome_message: data.welcome_message || '' });
      setIsLoading(false);
    });
  }, []);

  async function handleSave() {
    setIsSaving(true);
    await supabase.from('projects').update(formData).eq('id', MY_PROJECT_ID);
    setIsSaving(false); alert('Сохранено!');
  }

  if (isLoading) return <div className="p-8 text-gray-500">Загрузка настроек...</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto pb-20">
      <header className="mb-8 flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <button onClick={handleSave} disabled={isSaving} className="btn-main w-auto px-6">
          {isSaving ? <Loader2 size={20} className="animate-spin"/> : null} Сохранить
        </button>
      </header>

      <div className="space-y-10">
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-4">База знаний ИИ</h2>
          <div className="ios-bubble p-6 space-y-4">
            <textarea rows={2} value={formData.system_prompt} onChange={e => setFormData({...formData, system_prompt: e.target.value})} className="input-ios resize-none" placeholder="Вы — дружелюбный ассистент..." />
            <textarea rows={4} value={formData.knowledge_base} onChange={e => setFormData({...formData, knowledge_base: e.target.value})} className="input-ios resize-none" placeholder="Факты, цены, правила компании..." />
            <input type="text" value={formData.welcome_message} onChange={e => setFormData({...formData, welcome_message: e.target.value})} className="input-ios" placeholder="Приветственное сообщение" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-4">Дизайн виджета</h2>
          <div className="ios-bubble p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="input-ios" placeholder="Название компании" />
            <input type="text" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="input-ios" placeholder="Логотип (URL)" />
            <div className="flex items-center gap-4 bg-[#EDEDED] rounded-[16px] px-4 py-2 border border-gray-200">
               <span className="text-sm font-bold text-gray-500 uppercase flex-1">{formData.theme_color}</span>
               <input type="color" value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className="w-11 h-11 rounded-full cursor-pointer border-0 p-0 overflow-hidden" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}