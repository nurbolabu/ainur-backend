'use client'
import React, { useState } from 'react';
import { Save, XCircle } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Здесь будет логика: 
    // const { error } = await supabase.from('projects').update({ ... }).eq('id', MY_PROJECT_ID)
    setTimeout(() => setLoading(false), 1000); // Имитация
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
          <p className="text-[#8E8E93]">Управление внешним видом и логикой ИИ</p>
        </div>
      </header>

      <section className="grid gap-6">
        {/* Основные настройки */}
        <div className="bg-white/70 backdrop-blur-md border border-white rounded-[30px] p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Внешний вид виджета</h2>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Название компании</label>
                <input type="text" placeholder="AI NUR" className="w-full bg-[#f5f5f7] border-gray-100 border focus:bg-white focus:ring-2 focus:ring-[#8BFDA8] rounded-2xl px-4 py-3 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Основной цвет (HEX)</label>
                <div className="flex gap-3">
                  <input type="text" defaultValue="#8BFDA8" className="flex-grow bg-[#f5f5f7] border-gray-100 border rounded-2xl px-4 py-3 outline-none" />
                  <div className="w-12 h-12 rounded-2xl shadow-inner border border-black/5" style={{ backgroundColor: '#8BFDA8' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* База знаний ИИ */}
        <div className="bg-white/70 backdrop-blur-md border border-white rounded-[30px] p-8 shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Интеллект (Llama 3.1)</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">Системный промпт (Роль)</label>
              <textarea rows={3} className="w-full bg-[#f5f5f7] border-gray-100 border focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all resize-none" defaultValue="Ты — профессиональный ассистент компании AI NUR..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1">База знаний (Контекст)</label>
              <textarea rows={6} className="w-full bg-[#f5f5f7] border-gray-100 border focus:bg-white rounded-2xl px-4 py-3 outline-none transition-all resize-none" placeholder="Введите цены, услуги и FAQ..." />
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4 pt-4">
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex-1 md:flex-none md:min-w-[200px] bg-[#8BFDA8] text-black font-bold py-4 rounded-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-[#8BFDA8]/20 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
          <button className="hidden md:flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-2xl active:scale-95 transition-transform">
            <XCircle className="w-5 h-5" />
            Отмена
          </button>
        </div>
      </section>
    </div>
  );
}