'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronRight, AlertCircle } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [nextSection, setNextSection] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ company_name: '', theme_color: '#8BFDA8', logo_url: '', system_prompt: '', knowledge_base: '', welcome_message: '' });

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', MY_PROJECT_ID).single().then(({ data }) => {
      if (data) setFormData({ company_name: data.company_name || '', theme_color: data.theme_color || '#8BFDA8', logo_url: data.logo_url || '', system_prompt: data.system_prompt || '', knowledge_base: data.knowledge_base || '', welcome_message: data.welcome_message || '' });
    });
  }, []);

  const sections = [
    { id: 'ai', title: 'База знаний ИИ', items: [
      { key: 'system_prompt', label: 'Роль ИИ', type: 'textarea' },
      { key: 'knowledge_base', label: 'Знания для ИИ', type: 'textarea' },
      { key: 'welcome_message', label: 'Приветствие', type: 'text' }
    ]},
    { id: 'design', title: 'Дизайн', items: [
      { key: 'company_name', label: 'Название компании', type: 'text' },
      { key: 'theme_color', label: 'Цвет виджета', type: 'color' },
      { key: 'logo_url', label: 'Ссылка на логотип', type: 'text' }
    ]},
    { id: 'account', title: 'Аккаунт и помощь', items: [
      { key: 'billing', label: 'Подписка и оплата', type: 'link' },
      { key: 'help', label: 'Справочный центр', type: 'link' }
    ]}
  ];

  const handleToggle = (itemKey: string) => {
    if (isDirty && openSection !== itemKey) {
      setNextSection(itemKey); setShowWarning(true); return;
    }
    setOpenSection(openSection === itemKey ? null : itemKey);
  };

  async function handleSave() {
    await supabase.from('projects').update(formData).eq('id', MY_PROJECT_ID);
    setIsDirty(false); setOpenSection(null);
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">Настройки</h1>

      <div className="space-y-10">
        {sections.map(section => (
          <div key={section.id}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-2">{section.title}</h2>
            {/* Каждый пункт в секции - это отдельная карточка */}
            <div className="space-y-3">
              {section.items.map(item => (
                <div key={item.key} className="card-ios">
                  <button onClick={() => item.type === 'link' ? null : handleToggle(item.key)} className="w-full p-5 flex items-center justify-between active:bg-gray-50 transition-colors text-left">
                    <span className="font-bold text-lg">{item.label}</span>
                    <ChevronRight size={22} className={`text-gray-300 transition-transform ${openSection === item.key ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {openSection === item.key && item.type !== 'link' && (
                    <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/30 mt-2 animate-in slide-in-from-top-2 duration-200">
                      {item.type === 'textarea' ? (
                        <textarea rows={4} value={(formData as any)[item.key]} onChange={e => {setFormData({...formData, [item.key]: e.target.value}); setIsDirty(true);}} className="input-ios mb-6 resize-none" placeholder={`Введите ${item.label.toLowerCase()}...`} />
                      ) : item.type === 'color' ? (
                        <div className="flex items-center gap-4 mb-6">
                          <input type="color" value={(formData as any)[item.key]} onChange={e => {setFormData({...formData, [item.key]: e.target.value}); setIsDirty(true);}} className="w-14 h-14 rounded-full cursor-pointer border-0 p-0 overflow-hidden" />
                          <span className="font-bold text-gray-500 uppercase">{String((formData as any)[item.key])}</span>
                        </div>
                      ) : (
                        <input type="text" value={(formData as any)[item.key]} onChange={e => {setFormData({...formData, [item.key]: e.target.value}); setIsDirty(true);}} className="input-ios mb-6" />
                      )}
                      
                      <div className="flex flex-col md:flex-row gap-3 justify-end">
                        <button onClick={() => {setIsDirty(false); setOpenSection(null);}} className="btn-secondary w-full md:w-auto">Отмена</button>
                        <button onClick={handleSave} className="btn-primary w-full md:w-auto">Сохранить</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Предупреждение (Модальное окно) */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="card-ios p-8 max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <AlertCircle size={48} className="mx-auto mb-4 text-black" />
            <h3 className="text-xl font-bold mb-2">Изменения не сохранены</h3>
            <p className="text-gray-500 mb-8 font-medium">У вас остались несохраненные данные. Сохранить их?</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => { handleSave(); setShowWarning(false); setOpenSection(nextSection); }} className="btn-primary w-full">Сохранить</button>
              <button onClick={() => { setIsDirty(false); setShowWarning(false); setOpenSection(nextSection); }} className="btn-secondary w-full">Не сохранять</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}