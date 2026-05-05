'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight, ExternalLink, Check } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

type SettingsTab = 'VISUAL' | 'AI' | 'CONTACTS' | 'PLANS';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  const [formData, setFormData] = useState({ 
    company_name: '', theme_color: '#8BFDA8', system_prompt: '', 
    knowledge_base: '', whatsapp: '', instagram: '', address: '' 
  });

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single()
      .then(({ data }) => { 
        if (data) setFormData({ 
          company_name: data.company_name || '', theme_color: data.theme_color || '#8BFDA8', 
          system_prompt: data.system_prompt || '', knowledge_base: data.knowledge_base || '',
          whatsapp: data.whatsapp || '', instagram: data.instagram || '', address: data.address || ''
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
    alert('Настройки успешно сохранены');
  }

  const plans = [
    { name: 'Basic', price: isYearly ? '8 000' : '10 000', features: ['AI Ассистент', 'Каталог (50 тов.)', 'Stories'] },
    { name: 'Pro', price: isYearly ? '15 000' : '20 000', features: ['AI Ассистент', 'Безлимит товаров', 'Stories', 'Свой цвет'], recommended: true },
    { name: 'Business', price: isYearly ? '35 000' : '45 000', features: ['AI Ассистент', 'Priority Support', 'Custom Integration'] },
  ];

  const menuItems = [
    { id: 'VISUAL' as SettingsTab, label: 'Визуал', sub: 'Цвета и логотип' },
    { id: 'AI' as SettingsTab, label: 'Промпты ИИ', sub: 'Логика и база знаний' },
    { id: 'CONTACTS' as SettingsTab, label: 'Контакты', sub: 'WA, IG и адрес' },
  ];

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-full md:h-[572px] w-full px-1 md:px-0">
      
      <h1 className={`ios-large-title shrink-0 ${activeTab ? 'hidden md:block' : 'block'}`}>
        Настройки
      </h1>

      <div className="flex-1 flex flex-col md:flex-row w-full bg-transparent md:bg-[#FFFFFF] md:rounded-[24px] md:overflow-hidden min-h-0">
        
        {/* ЛЕВАЯ КОЛОНКА (Список) */}
        <div className={`w-full md:w-[300px] md:border-r border-[#E5E5EA] flex flex-col bg-transparent md:bg-[#FFFFFF] shrink-0 
          ${activeTab ? 'hidden md:flex' : 'flex'} h-full overflow-y-auto`}>
          
          {/* Исправлены отступы на мобилке (были p-4, стали px-0) */}
          <div className="flex flex-col px-0 md:px-0 space-y-6 md:space-y-0">
            <div className="ios-module md:rounded-none md:!mb-0">
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`ios-list-item w-full text-left border-none ${activeTab === item.id ? 'bg-[#F2F2F7] md:bg-[#F2F2F7]' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-[17px] font-semibold text-[#000000]">{item.label}</span>
                    <span className="text-[13px] text-[#8E8E93]">{item.sub}</span>
                  </div>
                  <ChevronRight size={18} className="text-[#C6C6C8]" />
                </button>
              ))}
            </div>

            <h2 className="ios-section-header md:mt-6">Мой виджет и тарифы</h2>
            <div className="ios-module md:rounded-none md:!mb-0">
              <button onClick={() => setActiveTab('PLANS')}
                className={`ios-list-item w-full text-left border-none ${activeTab === 'PLANS' ? 'bg-[#F2F2F7]' : ''}`}>
                <div className="flex flex-col">
                  <span className="text-[17px] font-semibold text-[#000000]">Тарифы</span>
                  <span className="text-[13px] text-[#8E8E93]">Управление подпиской</span>
                </div>
                <ChevronRight size={18} className="text-[#C6C6C8]" />
              </button>
              <a href={`https://ainur.kz/preview/${MY_PROJECT_ID}`} target="_blank" className="ios-list-item w-full border-none flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[17px] font-semibold text-[#000000]">Прототип виджета</span>
                  <span className="text-[13px] text-[#8E8E93]">Открыть превью</span>
                </div>
                <ExternalLink size={18} className="text-[#C6C6C8]" />
              </a>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Детали) */}
        <div className={`flex-1 flex flex-col bg-[#FFFFFF] 
          ${!activeTab ? 'hidden md:flex' : 'flex'} 
          ${activeTab ? 'fixed inset-0 z-[60] md:relative' : ''} h-full overflow-hidden`}>
          
          {activeTab ? (
            <>
              {/* Шапка детальных настроек */}
              <div className="border-b border-[#E5E5EA] bg-[#F9F9F9] md:bg-[#FFFFFF]/90 backdrop-blur-md shrink-0 z-10 pt-[env(safe-area-inset-top)] md:pt-0">
                <div className="relative flex items-center justify-between px-4 py-3 min-h-[56px] md:min-h-[64px]">
                  {/* Назад для мобилки */}
                  <button onClick={() => setActiveTab(null)} className="md:hidden text-[#000000] flex items-center active:opacity-50">
                    <ChevronLeft size={28} className="-ml-2" /> <span className="font-medium">Назад</span>
                  </button>
                  
                  {/* Заголовок по центру */}
                  <span className="font-semibold text-[17px] absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
                    {menuItems.find(i => i.id === activeTab)?.label || 'Настройки'}
                  </span>
                  
                  {/* Кнопка Сохранить (Зеленая как в каталоге) */}
                  <button 
                    onClick={handleSave} 
                    className={`btn-primary !min-h-[36px] !h-[36px] !px-4 !text-[14px] !rounded-[10px] ${!isDirty && 'opacity-50 pointer-events-none'}`}
                  >
                    Сохранить
                  </button>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FFFFFF]">
                
                {activeTab === 'VISUAL' && (
                  <div className="space-y-6">
                    <div>
                      <label className="ios-section-header ml-0">Название компании</label>
                      <input className="input-ios" value={formData.company_name} onChange={e => handleChange('company_name', e.target.value)} />
                    </div>
                    <div>
                      <label className="ios-section-header ml-0">Цвет бренда</label>
                      <div className="flex items-center gap-4 bg-[#F5F5F7] p-4 rounded-[14px] border border-[#E5E5EA]">
                        <div className="w-10 h-10 rounded-full border border-[#E5E5EA] overflow-hidden shrink-0">
                          <input type="color" className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" value={formData.theme_color} onChange={e => handleChange('theme_color', e.target.value)} />
                        </div>
                        <span className="font-mono font-bold uppercase tracking-wider">{formData.theme_color}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'AI' && (
                  <div className="space-y-6">
                    <div>
                      <label className="ios-section-header ml-0">Роль ассистента</label>
                      <textarea className="input-ios resize-none" rows={4} value={formData.system_prompt} onChange={e => handleChange('system_prompt', e.target.value)} />
                    </div>
                    <div>
                      <label className="ios-section-header ml-0">База знаний</label>
                      <textarea className="input-ios resize-none font-sans" rows={10} value={formData.knowledge_base} onChange={e => handleChange('knowledge_base', e.target.value)} />
                    </div>
                  </div>
                )}

                {activeTab === 'CONTACTS' && (
                  <div className="space-y-6">
                    <div>
                      <label className="ios-section-header ml-0">WhatsApp</label>
                      <input className="input-ios" placeholder="+7 (707) ..." value={formData.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} />
                    </div>
                    <div>
                      <label className="ios-section-header ml-0">Instagram</label>
                      <input className="input-ios" placeholder="@username" value={formData.instagram} onChange={e => handleChange('instagram', e.target.value)} />
                    </div>
                    <div>
                      <label className="ios-section-header ml-0">Адрес</label>
                      <textarea className="input-ios resize-none" rows={2} placeholder="Город, улица..." value={formData.address} onChange={e => handleChange('address', e.target.value)} />
                    </div>
                  </div>
                )}

                {activeTab === 'PLANS' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="ios-title-2 mb-0">Тарифы</h2>
                      <div className="flex bg-[#F2F2F7] p-1 rounded-[10px]">
                        <button onClick={() => setIsYearly(false)} className={`px-3 py-1.5 text-[12px] font-bold rounded-[7px] transition-all ${!isYearly ? 'bg-white shadow-sm' : 'text-[#8E8E93]'}`}>Месяц</button>
                        <button onClick={() => setIsYearly(true)} className={`px-3 py-1.5 text-[12px] font-bold rounded-[7px] transition-all ${isYearly ? 'bg-white shadow-sm' : 'text-[#8E8E93]'}`}>Год -20%</button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {plans.map((plan) => (
                        <div key={plan.name} className={`p-5 rounded-[20px] border-2 transition-all ${plan.recommended ? 'border-[#8BFDA8] bg-[#8BFDA8]/5' : 'border-[#F2F2F7]'}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-[18px] font-bold">{plan.name}</h3>
                              <div className="text-[24px] font-black mt-1">{plan.price} ₸ <span className="text-[14px] font-normal text-[#8E8E93]">/{isYearly ? 'год' : 'мес'}</span></div>
                            </div>
                            {plan.recommended && <span className="bg-[#8BFDA8] text-[10px] font-black px-2 py-1 rounded-full uppercase">Популярный</span>}
                          </div>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map(f => (
                              <li key={f} className="flex items-center gap-2 text-[14px] text-[#3C3C43]">
                                <Check size={14} className="text-[#34C759]" /> {f}
                              </li>
                            ))}
                          </ul>
                          <button className="btn-secondary w-full !min-h-[44px] !h-[44px] !text-[15px]">Выбрать тариф</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#8E8E93] text-[17px] bg-[#FFFFFF]">
              Выберите раздел для настройки
            </div>
          )}
        </div>

      </div>
    </div>
  );
}