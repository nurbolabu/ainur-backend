'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Временно хардкодим, пока не подключим Auth
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [formData, setFormData] = useState({ 
    company_name: '', 
    theme_color: '#8BFDA8', 
    system_prompt: '', 
    knowledge_base: '',
    whatsapp: '',
    instagram: '',
    address: ''
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single()
      .then(({ data }) => { 
        if (data) setFormData({ 
          company_name: data.company_name || '', 
          theme_color: data.theme_color || '#8BFDA8', 
          system_prompt: data.system_prompt || '', 
          knowledge_base: data.knowledge_base || '',
          whatsapp: data.whatsapp || '',
          instagram: data.instagram || '',
          address: data.address || ''
        }); 
      });
  }, []);

  const handleChange = (field: string, value: string) => { 
    setFormData({...formData, [field]: value}); 
    setIsDirty(true); 
  };

  async function handleSave() {
    await supabase.from('projects').update(formData).eq('id', MY_PROJECT_ID);
    setIsDirty(false); 
    setShowModal(false); 
    alert('Настройки успешно сохранены');
  }

  const handleFakeNav = () => { if (isDirty) setShowModal(true); };

  return (
    <div className="animate-in fade-in duration-300 relative px-1 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="ios-large-title mb-0">Настройки</h1>
        <button onClick={handleSave} className={`btn-primary w-auto !min-h-[44px] !h-[44px] !py-0 !px-5 !text-[15px] ${!isDirty && 'opacity-50 pointer-events-none'}`}>
          Сохранить
        </button>
      </div>

      <div className="space-y-8" onClick={handleFakeNav}>
        
        {/* БЛОК ВИЗУАЛ */}
        <section>
          <h2 className="ios-section-header">Визуал</h2>
          <div className="ios-module mb-0 flex flex-col">
            <div className="px-4 py-3 relative border-b border-[#E5E5EA]">
              <label className="text-[13px] font-semibold text-[#8E8E93] block mb-1">Название компании</label>
              <input 
                className="w-full text-[17px] outline-none text-[#000000] placeholder-[#8E8E93] bg-transparent" 
                placeholder="Например: AI Design Studio" 
                value={formData.company_name} 
                onChange={e => handleChange('company_name', e.target.value)} 
              />
            </div>
            <div className="px-4 py-3 relative flex justify-between items-center min-h-[60px]">
              <label className="text-[17px] text-[#000000]">Акцентный цвет</label>
              <div className="flex items-center gap-2">
                <span className="text-[15px] text-[#8E8E93] uppercase font-mono">{formData.theme_color}</span>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#E5E5EA] shrink-0">
                  <input 
                    type="color" 
                    className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" 
                    value={formData.theme_color} 
                    onChange={e => handleChange('theme_color', e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* НОВЫЙ БЛОК: КОНТАКТЫ И СОЦСЕТИ */}
        <section>
          <h2 className="ios-section-header">Контакты компании</h2>
          <div className="ios-module mb-0 flex flex-col">
            <div className="px-4 py-3 relative border-b border-[#E5E5EA]">
              <label className="text-[13px] font-semibold text-[#8E8E93] block mb-1">WhatsApp (Телефон)</label>
              <input 
                className="w-full text-[17px] outline-none text-[#000000] placeholder-[#8E8E93] bg-transparent" 
                placeholder="+7 (777) 000-00-00" 
                value={formData.whatsapp} 
                onChange={e => handleChange('whatsapp', e.target.value)} 
              />
            </div>
            <div className="px-4 py-3 relative border-b border-[#E5E5EA]">
              <label className="text-[13px] font-semibold text-[#8E8E93] block mb-1">Instagram (Никнейм или ссылка)</label>
              <input 
                className="w-full text-[17px] outline-none text-[#000000] placeholder-[#8E8E93] bg-transparent" 
                placeholder="@ваша_компания" 
                value={formData.instagram} 
                onChange={e => handleChange('instagram', e.target.value)} 
              />
            </div>
            <div className="px-4 py-3 relative">
              <label className="text-[13px] font-semibold text-[#8E8E93] block mb-1">Физический адрес</label>
              <textarea 
                className="w-full text-[17px] outline-none text-[#000000] placeholder-[#8E8E93] resize-none bg-transparent" 
                rows={2} 
                placeholder="Город, Улица, Дом, Офис..." 
                value={formData.address} 
                onChange={e => handleChange('address', e.target.value)} 
              />
            </div>
          </div>
        </section>

        {/* БЛОК ПРОМПТЫ */}
        <section>
          <h2 className="ios-section-header">База знаний ИИ</h2>
          <div className="ios-module mb-0 flex flex-col">
            <div className="px-4 py-3 relative border-b border-[#E5E5EA]">
              <label className="text-[13px] font-semibold text-[#8E8E93] block mb-1">Системная роль (Как отвечать)</label>
              <textarea 
                className="w-full text-[17px] outline-none text-[#000000] placeholder-[#8E8E93] resize-none bg-transparent" 
                rows={3} 
                placeholder="Вы профессиональный менеджер. Отвечайте вежливо и кратко..." 
                value={formData.system_prompt} 
                onChange={e => handleChange('system_prompt', e.target.value)} 
              />
            </div>
            <div className="px-4 py-3 relative">
              <label className="text-[13px] font-semibold text-[#8E8E93] block mb-1">Обучающий текст (Услуги, цены, FAQ)</label>
              <textarea 
                className="w-full text-[17px] outline-none text-[#000000] placeholder-[#8E8E93] resize-none bg-transparent" 
                rows={6} 
                placeholder="Скопируйте сюда всю информацию о вашем бизнесе..." 
                value={formData.knowledge_base} 
                onChange={e => handleChange('knowledge_base', e.target.value)} 
              />
            </div>
          </div>
        </section>
      </div>

      {/* Нативный iOS Action Sheet (Bottom Sheet) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex flex-col justify-end p-4 animate-in fade-in">
          <div className="animate-in slide-in-from-bottom-4 duration-300 max-w-[500px] w-full mx-auto">
            <div className="bg-[#F2F2F7]/95 backdrop-blur-xl rounded-[14px] overflow-hidden mb-2">
              <div className="p-4 text-center border-b border-[#C6C6C8]">
                <span className="text-[13px] text-[#8E8E93] font-medium block">У вас есть несохраненные изменения.</span>
              </div>
              <button onClick={handleSave} className="w-full p-4 text-[20px] font-semibold text-[#007AFF] bg-transparent active:bg-[#E5E5EA]">Сохранить</button>
              <div className="h-[0.5px] bg-[#C6C6C8] w-full"></div>
              <button onClick={() => {setIsDirty(false); setShowModal(false);}} className="w-full p-4 text-[20px] font-normal text-[#FF3B30] bg-transparent active:bg-[#E5E5EA]">Сбросить изменения</button>
            </div>
            <button onClick={() => setShowModal(false)} className="w-full p-4 text-[20px] font-semibold text-[#007AFF] bg-[#FFFFFF] rounded-[14px] active:bg-[#E5E5EA]">Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
}