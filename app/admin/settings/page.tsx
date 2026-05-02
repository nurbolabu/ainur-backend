'use client';
import { useState } from 'react';
import { ChevronRight, X, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const sections = [
    { id: 'ai', title: 'База знаний ИИ', items: ['Роль ИИ', 'Знания для ИИ', 'Приветствие'] },
    { id: 'design', title: 'Дизайн', items: ['Логотип', 'Цвета', 'Название компании'] },
    { id: 'account', title: 'Подписка и помощь', items: ['Оплата', 'Правила', 'Помощь'] }
  ];

  const handleToggle = (id: string) => {
    if (isDirty && openSection !== id) {
      setShowWarning(true);
      return;
    }
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto pb-20">
      <h1 className="text-3xl font-bold mb-8">Настройки</h1>

      <div className="space-y-8">
        {sections.map(section => (
          <div key={section.id}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 ml-4">{section.title}</h2>
            <div className="card-ios border border-gray-100 divide-y divide-gray-50">
              {section.items.map(item => (
                <div key={item} className="flex flex-col">
                  <button onClick={() => handleToggle(item)} 
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors">
                    <span className="font-medium">{item}</span>
                    <ChevronRight size={20} className={`text-gray-300 transition-transform ${openSection === item ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {openSection === item && (
                    <div className="p-4 pt-0 bg-gray-50/50 animate-in slide-in-from-top-2 duration-200">
                      <textarea 
                        className="input-ios w-full mb-4 focus:bg-white" 
                        onChange={() => setIsDirty(true)}
                        placeholder={`Настройте ${item.toLowerCase()}...`}
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => {setIsDirty(false); setOpenSection(null);}} className="btn-secondary px-6 py-2 text-sm">Отмена</button>
                        <button onClick={() => setIsDirty(false)} className="btn-primary px-6 py-2 text-sm">Сохранить</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Уведомление о несохраненных изменениях */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[30px] p-8 max-w-xs w-full text-center animate-in zoom-in-95 duration-200">
            <AlertCircle size={48} className="mx-auto text-black mb-4" />
            <h3 className="text-xl font-bold mb-2">Не сохранено</h3>
            <p className="text-gray-500 mb-6 text-sm">У вас есть изменения. Сохранить их перед выходом?</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => {setIsDirty(false); setShowWarning(false);}} className="btn-primary py-3 w-full">Сохранить</button>
              <button onClick={() => {setIsDirty(false); setShowWarning(false); setOpenSection(null);}} className="btn-secondary py-3 w-full text-white">Выйти без сохранения</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}