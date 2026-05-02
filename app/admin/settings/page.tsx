'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Подключаем БД
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Твой рабочий ID проекта
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: '',
    theme_color: '#8BFDA8',
    system_prompt: '',
    knowledge_base: ''
  });

  // Загружаем данные при открытии страницы
  useEffect(() => {
    async function loadData() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', MY_PROJECT_ID)
        .single();

      if (data) {
        setFormData({
          company_name: data.company_name || '',
          theme_color: data.theme_color || '#8BFDA8',
          system_prompt: data.system_prompt || '',
          knowledge_base: data.knowledge_base || ''
        });
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Сохраняем изменения в БД
  async function handleSave() {
    setIsSaving(true);
    const { error } = await supabase
      .from('projects')
      .update({
        company_name: formData.company_name,
        theme_color: formData.theme_color,
        system_prompt: formData.system_prompt,
        knowledge_base: formData.knowledge_base
      })
      .eq('id', MY_PROJECT_ID);

    setIsSaving(false);
    if (!error) {
      alert('Настройки успешно сохранены!');
    } else {
      alert('Ошибка при сохранении.');
    }
  }

  if (isLoading) {
    return <div className="p-8 text-gray-500">Загрузка настроек...</div>;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Настройки проекта</h1>
        <p className="text-gray-500 mt-1">Управляйте внешним видом виджета и базой знаний ИИ.</p>
      </header>

      <div className="space-y-6">
        
        {/* Блок: Основные настройки */}
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Бренд и Дизайн</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название компании</label>
            <input 
              type="text" 
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Основной цвет (HEX)</label>
            <div className="flex gap-3 items-center">
              <input 
                type="color" 
                value={formData.theme_color}
                onChange={(e) => setFormData({...formData, theme_color: e.target.value})}
                className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0"
              />
              <input 
                type="text" 
                value={formData.theme_color}
                onChange={(e) => setFormData({...formData, theme_color: e.target.value})}
                className="w-32 px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Блок: Настройки ИИ */}
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Настройки ИИ (Промпты)</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Системный промпт (Роль и правила поведения)</label>
            <textarea 
              rows={3}
              value={formData.system_prompt}
              onChange={(e) => setFormData({...formData, system_prompt: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">База знаний (Факты, цены, инструкции)</label>
            <textarea 
              rows={8}
              value={formData.knowledge_base}
              onChange={(e) => setFormData({...formData, knowledge_base: e.target.value})}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all resize-none"
              placeholder="Напишите всё, что ИИ должен знать о вашей компании..."
            />
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="flex justify-end pt-4">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary text-black font-semibold px-8 py-3 rounded-xl shadow-sm hover:scale-[0.98] active:scale-95 transition-all disabled:opacity-50"
          >
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>

      </div>
    </div>
  );
}