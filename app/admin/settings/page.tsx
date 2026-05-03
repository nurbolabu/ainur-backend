'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Edit } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [formData, setFormData] = useState({ company_name: '', theme_color: '#8BFDA8', logo_url: '', system_prompt: '', knowledge_base: '', welcome_message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single().then(({ data }) => {
      if (data) setFormData({ ...formData, ...data });
    });
  }, []);

  async function handleSave() {
    setIsSaving(true);
    await supabase.from('projects').update(formData).eq('id', MY_PROJECT_ID);
    setIsSaving(false);
    setIsEditing(false); // Выходим из режима редактирования
  }

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center pr-4 md:pr-0">
        <h1 className="ios-large-title mt-4 mb-4">Настройки</h1>
        <button onClick={toggleEdit} className="btn-text font-semibold mb-4">
          {isSaving ? '...' : isEditing ? 'Сохранить' : 'Редактировать'}
        </button>
      </div>

      <h2 className="ios-section-header">Внешний вид</h2>
      <div className="ios-bubble ios-bubble-margin">
        <div className="ios-list-row bg-white cursor-default">
          <span className="w-[120px] text-[17px]">Название</span>
          <input type="text" disabled={!isEditing} className="input-bare text-right" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} />
        </div>
        <div className="ios-list-row bg-white cursor-default">
          <span className="w-[120px] text-[17px]">Лого (URL)</span>
          <input type="text" disabled={!isEditing} className="input-bare text-right" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
        </div>
        <div className="ios-list-row bg-white cursor-default">
          <span className="text-[17px]">Акцентный цвет</span>
          <div className="flex items-center gap-3">
             <span className="text-[17px] text-[#8E8E93] uppercase">{formData.theme_color}</span>
             <input type="color" disabled={!isEditing} value={formData.theme_color} onChange={e => setFormData({...formData, theme_color: e.target.value})} className={`w-8 h-8 rounded-full border-none p-0 bg-transparent ${isEditing ? 'cursor-pointer' : 'opacity-50'}`} />
          </div>
        </div>
      </div>

      <h2 className="ios-section-header">База знаний ИИ</h2>
      <div className="ios-bubble ios-bubble-margin mb-8">
        <div className="p-4 bg-white border-b border-[#C6C6C8]">
          <span className="block text-[15px] text-[#8E8E93] mb-1">Роль ИИ</span>
          <textarea rows={2} disabled={!isEditing} className="input-bare resize-none" value={formData.system_prompt} onChange={e => setFormData({...formData, system_prompt: e.target.value})} />
        </div>
        <div className="p-4 bg-white border-b border-[#C6C6C8]">
          <span className="block text-[15px] text-[#8E8E93] mb-1">Знания для ИИ</span>
          <textarea rows={4} disabled={!isEditing} className="input-bare resize-none" value={formData.knowledge_base} onChange={e => setFormData({...formData, knowledge_base: e.target.value})} />
        </div>
        <div className="p-4 bg-white">
          <span className="block text-[15px] text-[#8E8E93] mb-1">Приветствие</span>
          <input type="text" disabled={!isEditing} className="input-bare" value={formData.welcome_message} onChange={e => setFormData({...formData, welcome_message: e.target.value})} />
        </div>
      </div>
    </div>
  );
}