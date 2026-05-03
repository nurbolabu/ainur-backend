'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [formData, setFormData] = useState({ company_name: '', theme_color: '#8BFDA8', system_prompt: '', knowledge_base: '' });
  const [isDirty, setIsDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single()
      .then(({ data }) => { if (data) setFormData({ company_name: data.company_name || '', theme_color: data.theme_color || '#8BFDA8', system_prompt: data.system_prompt || '', knowledge_base: data.knowledge_base || '' }); });
  }, []);

  const handleChange = (field: string, value: string) => { setFormData({...formData, [field]: value}); setIsDirty(true); };

  async function handleSave() {
    await supabase.from('projects').update(formData).eq('id', MY_PROJECT_ID);
    setIsDirty(false); setShowModal(false); alert('Сохранено');
  }

  // Симуляция Action Sheet при попытке уйти
  const handleFakeNav = () => { if (isDirty) setShowModal(true); };

  return (
    <div className="animate-in fade-in duration-300 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="ios-large-title mb-0">Настройки</h1>
        <button onClick={handleSave} className="btn-primary w-auto">Сохранить</button>
      </div>

      <div className="space-y-8" onClick={handleFakeNav}>
        
        <section>
          <h2 className="ios-section-header">Визуал</h2>
          <div className="ios-module p-6 grid gap-4 mb-0">
            <div><label className="text-[15px] font-semibold text-[#8E8E93] block mb-2">Название компании</label><input className="input-ios" value={formData.company_name} onChange={e => handleChange('company_name', e.target.value)} /></div>
            <div><label className="text-[15px] font-semibold text-[#8E8E93] block mb-2">Акцентный цвет</label><input type="color" className="w-12 h-12 rounded-full border-none p-0 cursor-pointer bg-transparent" value={formData.theme_color} onChange={e => handleChange('theme_color', e.target.value)} /></div>
          </div>
        </section>

        <section>
          <h2 className="ios-section-header">Промпты ИИ</h2>
          <div className="ios-module p-6 grid gap-4 mb-0">
            <div><label className="text-[15px] font-semibold text-[#8E8E93] block mb-2">Роль ИИ</label><textarea className="input-ios resize-none" rows={3} value={formData.system_prompt} onChange={e => handleChange('system_prompt', e.target.value)} /></div>
            <div><label className="text-[15px] font-semibold text-[#8E8E93] block mb-2">База знаний</label><textarea className="input-ios resize-none" rows={6} value={formData.knowledge_base} onChange={e => handleChange('knowledge_base', e.target.value)} /></div>
          </div>
        </section>
      </div>

      {/* Action Sheet Modal (iOS Style) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex flex-col justify-end p-4">
          <div className="bg-[#F2F2F7] rounded-[14px] overflow-hidden mb-2">
            <div className="p-4 text-center border-b border-[#C6C6C8]"><span className="text-[13px] text-[#8E8E93] font-medium">У вас есть несохраненные изменения</span></div>
            <button onClick={handleSave} className="w-full p-4 text-[20px] font-semibold text-[#8BFDA8] bg-[#FFFFFF] active:bg-[#E5E5EA]">Сохранить</button>
            <div className="h-[1px] bg-[#C6C6C8]"></div>
            <button onClick={() => {setIsDirty(false); setShowModal(false);}} className="w-full p-4 text-[20px] text-red-500 bg-[#FFFFFF] active:bg-[#E5E5EA]">Сбросить изменения</button>
          </div>
          <button onClick={() => setShowModal(false)} className="w-full p-4 text-[20px] font-semibold text-blue-500 bg-[#FFFFFF] rounded-[14px] active:bg-[#E5E5EA]">Отмена</button>
        </div>
      )}
    </div>
  );
}