'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [formData, setFormData] = useState({ company_name: '', theme_color: '#8BFDA8', logo_url: '', system_prompt: '', knowledge_base: '', welcome_message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single().then(({ data }) => {
      if (data) setFormData({ company_name: data.company_name || '', theme_color: data.theme_color || '#8BFDA8', logo_url: data.logo_url || '', system_prompt: data.system_prompt || '', knowledge_base: data.knowledge_base || '', welcome_message: data.welcome_message || '' });
    });
  }, []);

  async function handleSave() {
    setIsSaving(true);
    await supabase.from('projects').update(formData).eq('id', MY_PROJECT_ID);
    setIsSaving(false);
    setIsEditing(false); // Выходим из режима
  }

  const toggleEdit = () => {
    if (isEditing) { handleSave(); } else { setIsEditing(true); }
  };

  return (
    <div className="animate-in fade-in duration-300 w-full pb-20">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center px-1 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <button onClick={toggleEdit} className="btn-main w-full md:w-auto">
          {isSaving ? '...' : isEditing ? 'Сохранить' : 'Редактировать'}
        </button>
      </header>

      <div className="space-y-6">
        
        {/* БАБЛ: Внешний вид */}
        <section className="ios-bubble p-6 md:p-8 mb-0">
          <h2 className="text-xl font-bold mb-6">Внешний вид</h2>
          <div className="grid gap-5">
            <div>
               <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Название</label>
               <input className="input-ios" disabled={!isEditing} value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Логотип (URL)</label>
               <input className="input-ios" disabled={!isEditing} value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Акцентный цвет</label>
               <div className={`flex items-center gap-4 bg-[#EDEDED] rounded-[16px] px-4 py-2 border border-gray-200 ${!isEditing && 'opacity-60'}`}>
                  <span className="text-lg font-bold uppercase text-gray-600 flex-1">{formData.theme_color}</span>
                  <input type="color" disabled={!isEditing} value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className="w-12 h-12 rounded-full cursor-pointer border-0 p-0 bg-transparent" />
               </div>
            </div>
          </div>
        </section>

        {/* БАБЛ: База знаний ИИ */}
        <section className="ios-bubble p-6 md:p-8 mb-0">
          <h2 className="text-xl font-bold mb-6">База знаний ИИ</h2>
          <div className="grid gap-5">
            <div>
               <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Роль ИИ</label>
               <textarea rows={2} disabled={!isEditing} className="input-ios resize-none" value={formData.system_prompt} onChange={e => setFormData({...formData, system_prompt: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Знания для ИИ</label>
               <textarea rows={5} disabled={!isEditing} className="input-ios resize-none" value={formData.knowledge_base} onChange={e => setFormData({...formData, knowledge_base: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Приветствие</label>
               <input type="text" disabled={!isEditing} className="input-ios" value={formData.welcome_message} onChange={e => setFormData({...formData, welcome_message: e.target.value})} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}