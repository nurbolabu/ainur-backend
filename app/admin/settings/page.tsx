'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ company_name: '', theme_color: '#8BFDA8', logo_url: '', system_prompt: '', knowledge_base: '', welcome_message: '' });

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single().then(({ data }) => {
      if (data) setFormData({ company_name: data.company_name || '', theme_color: data.theme_color || '#8BFDA8', logo_url: data.logo_url || '', system_prompt: data.system_prompt || '', knowledge_base: data.knowledge_base || '', welcome_message: data.welcome_message || '' });
    });
  }, []);

  async function handleSave() {
    setIsSaving(true);
    await supabase.from('projects').update(formData).eq('id', MY_PROJECT_ID);
    setIsSaving(false); alert('Сохранено!');
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-20">
      <header className="mb-8 flex justify-between items-end">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Настройки</h1>
        <button onClick={handleSave} disabled={isSaving} className="bg-black text-white font-semibold px-6 py-2.5 rounded-xl hover:scale-95 transition-all disabled:opacity-50">{isSaving ? '...' : 'Сохранить'}</button>
      </header>

      <div className="space-y-8">
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">База знаний ИИ</h2>
          <div><label className="block text-sm text-gray-700 mb-1">Роль ИИ</label><textarea rows={2} value={formData.system_prompt} onChange={e => setFormData({...formData, system_prompt: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none resize-none" placeholder="Вы — дружелюбный ассистент..." /></div>
          <div><label className="block text-sm text-gray-700 mb-1">Знания (Факты, цены)</label><textarea rows={4} value={formData.knowledge_base} onChange={e => setFormData({...formData, knowledge_base: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none resize-none" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">Приветственное сообщение</label><input type="text" value={formData.welcome_message} onChange={e => setFormData({...formData, welcome_message: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none" /></div>
        </div>

        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Дизайн виджета</h2>
          <div><label className="block text-sm text-gray-700 mb-1">Название компании</label><input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">Ссылка на логотип (URL)</label><input type="text" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none" /></div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Основной цвет</label>
            <div className="flex items-center gap-4"><input type="color" value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0" /><span className="text-gray-500 uppercase">{formData.theme_color}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}