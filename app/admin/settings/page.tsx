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
    setIsSaving(false); alert('Настройки сохранены!');
  }

  if (isLoading) return <div className="p-8 text-gray-500 font-bold">Загрузка настроек...</div>;

  return (
    <div className="animate-in fade-in duration-500 w-full pb-20">
      <header className="mb-8 flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-400">Настройки</h1>
        <button onClick={handleSave} disabled={isSaving} className="btn-main">
          {isSaving ? <Loader2 size={20} className="animate-spin"/> : null} Сохранить
        </button>
      </header>

      <div className="space-y-12">
        {/* Бабл Настроек ИИ */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-4 mb-4">База знаний ИИ</h2>
          <div className="card-ios p-6 md:p-8 space-y-6">
            <div><label className="block font-bold mb-3">Роль ИИ</label><textarea rows={2} value={formData.system_prompt} onChange={e => setFormData({...formData, system_prompt: e.target.value})} className="input-ios resize-none" placeholder="Вы — дружелюбный ассистент..." /></div>
            <div><label className="block font-bold mb-3">Знания для ИИ</label><textarea rows={5} value={formData.knowledge_base} onChange={e => setFormData({...formData, knowledge_base: e.target.value})} className="input-ios resize-none" placeholder="Факты, цены, правила компании..." /></div>
            <div><label className="block font-bold mb-3">Приветственное сообщение</label><input type="text" value={formData.welcome_message} onChange={e => setFormData({...formData, welcome_message: e.target.value})} className="input-ios" /></div>
          </div>
        </section>

        {/* Бабл Дизайна */}
        <section>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-4 mb-4">Внешний вид</h2>
          <div className="card-ios p-6 md:p-8 grid grid-cols-1 gap-6">
            <div><label className="block font-bold mb-3">Название компании</label><input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="input-ios" /></div>
            <div><label className="block font-bold mb-3">Логотип (URL)</label><input type="text" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} className="input-ios" /></div>
            <div>
               <label className="block font-bold mb-3">Цвет виджета</label>
               <div className="flex items-center gap-6 bg-[#F2F2F7] rounded-[16px] p-3 pl-5 border border-gray-200">
                  <span className="text-lg font-black uppercase text-gray-600 flex-1">{formData.theme_color}</span>
                  <input type="color" value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className="w-14 h-14 rounded-full cursor-pointer border-0 p-0" />
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}