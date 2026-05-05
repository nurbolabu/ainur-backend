'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight, ExternalLink, Check, User } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

type SettingsTab = 'VISUAL' | 'AI' | 'CONTACTS' | 'PLANS' | 'EMAIL' | 'PASSWORD';

function getContrastColor(hexcolor: string) {
  const hex = hexcolor.replace('#', '');
  if (hex.length !== 6) return '#000000'; 
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

export default function SettingsPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Данные аккаунта
  const [userEmail, setUserEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [formData, setFormData] = useState({ 
    company_name: '', theme_color: '#8BFDA8', theme_text_color: '#000000', system_prompt: '', 
    knowledge_base: '', whatsapp: '', instagram: '', telegram: '', youtube: '', vk: '', twogis: '', address: '' 
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = localStorage.getItem('ainur_admin_project_id');
      if (storedId) {
        setProjectId(storedId);
        loadSettings(storedId);
      }
    }
    
    // Получаем почту текущего пользователя
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
      }
    };
    fetchUser();
  }, []);

  const loadSettings = async (id: string) => {
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    if (data) {
      let links = data.social_links || {};
      if (typeof links === 'string') {
          try { links = JSON.parse(links); } catch(e) { links = {}; }
      }
      const textColor = data.theme_text_color || getContrastColor(data.theme_color || '#8BFDA8');
      
      setFormData({ 
        company_name: data.company_name || '', 
        theme_color: data.theme_color || '#8BFDA8', 
        theme_text_color: textColor,
        system_prompt: data.system_prompt || '', 
        knowledge_base: data.knowledge_base || '',
        address: data.contacts_address || '', 
        whatsapp: links.whatsapp || '', 
        instagram: links.instagram || '', 
        telegram: links.telegram || '',
        youtube: links.youtube || '',
        vk: links.vk || '',
        twogis: links.twogis || ''
      }); 
    }
  };

  const handleColorChange = (hex: string) => {
    const suggestedTextColor = getContrastColor(hex);
    setFormData({ ...formData, theme_color: hex, theme_text_color: suggestedTextColor });
    setIsDirty(true);
  };

  const handleChange = (field: string, value: string) => { 
    setFormData({...formData, [field]: value}); 
    setIsDirty(true); 
  };

  // СОХРАНЕНИЕ НАСТРОЕК ВИДЖЕТА
  async function handleSave() {
    if (!projectId) return alert('Ошибка: ID проекта не найден');
    await supabase.from('projects').update({
      company_name: formData.company_name, theme_color: formData.theme_color, theme_text_color: formData.theme_text_color,
      system_prompt: formData.system_prompt, knowledge_base: formData.knowledge_base, contacts_address: formData.address,
      social_links: { whatsapp: formData.whatsapp, instagram: formData.instagram, telegram: formData.telegram, youtube: formData.youtube, vk: formData.vk, twogis: formData.twogis }
    }).eq('id', projectId);
    setIsDirty(false);
    alert('Настройки успешно сохранены');
  }

  // ОБНОВЛЕНИЕ EMAIL
  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) alert('Ошибка: ' + error.message);
    else { 
      alert('Email успешно обновлен. Если в системе включено подтверждение, проверьте почту.'); 
      setUserEmail(newEmail); 
      setNewEmail(''); 
    }
  };

  // ОБНОВЛЕНИЕ ПАРОЛЯ
  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) return alert('Пароль должен быть минимум 6 символов');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert('Ошибка: ' + error.message);
    else { alert('Пароль успешно изменен'); setNewPassword(''); }
  };

  // ВЫХОД ИЗ СИСТЕМЫ
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('ainur_admin_project_id');
    router.push('/login');
  };

  const accountMenuItems = [
    { id: 'EMAIL' as SettingsTab, label: 'Поменять email', sub: 'Смена адреса входа' },
    { id: 'PASSWORD' as SettingsTab, label: 'Поменять пароль', sub: 'Обновление пароля' },
    { id: 'PLANS' as SettingsTab, label: 'Моя подписка', sub: 'Управление тарифом' },
  ];

  const widgetMenuItems = [
    { id: 'VISUAL' as SettingsTab, label: 'Визуал', sub: 'Цвета и логотип' },
    { id: 'AI' as SettingsTab, label: 'Промпты ИИ', sub: 'Логика и база знаний' },
    { id: 'CONTACTS' as SettingsTab, label: 'Контакты', sub: 'Карты и соцсети' },
  ];

  const plans = [
    { name: 'Basic', price: isYearly ? '8 000' : '10 000', features: ['AI Ассистент', 'Каталог (50 тов.)', 'Stories'] },
    { name: 'Pro', price: isYearly ? '15 000' : '20 000', features: ['AI Ассистент', 'Безлимит товаров', 'Stories', 'Свой цвет'], recommended: true },
    { name: 'Business', price: isYearly ? '35 000' : '45 000', features: ['AI Ассистент', 'Priority Support', 'Custom Integration'] },
  ];

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-full md:h-[572px] w-full px-1 md:px-0">
      
      {/* Десктопный заголовок (Скрывается на мобилках, если открыта вкладка) */}
      <h1 className={`ios-large-title shrink-0 ${activeTab ? 'hidden md:block' : 'block'}`}>
        Настройки
      </h1>

      <div className="flex-1 flex flex-col md:flex-row w-full bg-transparent md:bg-[#FFFFFF] md:rounded-[24px] md:overflow-hidden min-h-0">
        
        {/* ЛЕВАЯ КОЛОНКА (Меню настроек) */}
        <div className={`w-full md:w-[320px] md:border-r border-[#E5E5EA] flex flex-col bg-transparent md:bg-[#FFFFFF] shrink-0 
          ${activeTab ? 'hidden md:flex' : 'flex'} h-full overflow-y-auto pb-24 md:pb-0`}>
          
          <div className="flex flex-col space-y-6 md:space-y-0 md:py-0">
            
            {/* МОБИЛЬНЫЙ ПРОФИЛЬ (Отображается только на телефонах) */}
            <div className="md:hidden flex flex-col items-center justify-center text-center mt-2 mb-2 bg-[#FFFFFF] p-6 rounded-[24px] shadow-sm">
                <div className="w-16 h-16 rounded-[20px] bg-[#F5F5F7] flex items-center justify-center mb-3 border border-[#E5E5EA]">
                   <span className="font-bold text-[24px] text-[#8E8E93]">{formData.company_name?.charAt(0) || <User />}</span>
                </div>
                <h2 className="text-[20px] font-bold text-[#000000] tracking-tight">{formData.company_name || 'Настройки'}</h2>
                <p className="text-[14px] text-[#8E8E93]">{userEmail}</p>
            </div>

            <h2 className="ios-section-header md:mt-6 hidden md:block">Аккаунт</h2>
            <div className="ios-module md:rounded-none md:!mb-0">
              {accountMenuItems.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`ios-list-item w-full text-left border-none ${activeTab === item.id ? 'bg-[#F2F2F7] md:bg-[#F2F2F7]' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-[17px] font-semibold text-[#000000]">{item.label}</span>
                  </div>
                  <ChevronRight size={18} className="text-[#C6C6C8]" />
                </button>
              ))}
            </div>

            <h2 className="ios-section-header mt-6 md:mt-6">Настройка виджета</h2>
            <div className="ios-module md:rounded-none md:!mb-0">
              {widgetMenuItems.map((item) => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className={`ios-list-item w-full text-left border-none ${activeTab === item.id ? 'bg-[#F2F2F7] md:bg-[#F2F2F7]' : ''}`}>
                  <div className="flex flex-col">
                    <span className="text-[17px] font-semibold text-[#000000]">{item.label}</span>
                    <span className="text-[13px] text-[#8E8E93] hidden md:block">{item.sub}</span>
                  </div>
                  <ChevronRight size={18} className="text-[#C6C6C8]" />
                </button>
              ))}
              <a href={`https://ainur.kz/preview/${projectId}`} target="_blank" className="ios-list-item w-full border-none flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[17px] font-semibold text-[#000000]">Прототип виджета</span>
                </div>
                <ExternalLink size={18} className="text-[#C6C6C8]" />
              </a>
            </div>

            {/* КНОПКА ВЫХОДА */}
            <div className="ios-module md:rounded-none md:!mb-0 bg-transparent md:bg-[#FFFFFF] mt-2 md:mt-6 shadow-none md:border-t border-[#E5E5EA]">
                <button onClick={handleSignOut} className="ios-list-item w-full bg-[#FFFFFF] rounded-[16px] md:rounded-none text-center flex justify-center border-none">
                    <span className="text-[#FF3B30] font-semibold text-[17px]">Выйти из аккаунта</span>
                </button>
            </div>

          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Содержимое вкладок) */}
        <div className={`flex-1 flex flex-col bg-[#FFFFFF] 
          ${!activeTab ? 'hidden md:flex' : 'flex'} 
          ${activeTab ? 'fixed inset-0 z-[60] md:relative' : ''} h-full overflow-hidden`}>
          
          {activeTab ? (
            <>
              <div className="border-b border-[#E5E5EA] bg-[#F9F9F9] md:bg-[#FFFFFF]/90 backdrop-blur-md shrink-0 z-10 pt-[env(safe-area-inset-top)] md:pt-0">
                <div className="relative flex items-center justify-between px-4 py-3 min-h-[56px] md:min-h-[64px]">
                  <button onClick={() => setActiveTab(null)} className="md:hidden text-[#000000] flex items-center active:opacity-50">
                    <ChevronLeft size={28} className="-ml-2" /> <span className="font-medium">Назад</span>
                  </button>
                  <span className="font-semibold text-[17px] absolute left-1/2 -translate-x-1/2 md:relative md:left-0 md:translate-x-0">
                    {[...widgetMenuItems, ...accountMenuItems].find(i => i.id === activeTab)?.label || 'Настройки'}
                  </span>
                  
                  {/* Кнопка сохранить показывается только для настроек виджета */}
                  {['VISUAL', 'AI', 'CONTACTS'].includes(activeTab) ? (
                    <button onClick={handleSave} className={`btn-primary !bg-[#8BFDA8] !text-[#000000] !min-h-[36px] !h-[36px] !px-4 !text-[14px] !rounded-[10px] ${!isDirty && 'opacity-50 pointer-events-none'}`}>
                      Сохранить
                    </button>
                  ) : <div className="w-[85px] md:hidden"></div>}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#FFFFFF]">
                
                {/* --- Вкладки Аккаунта --- */}
                {activeTab === 'EMAIL' && (
                  <div className="space-y-6">
                    <div>
                      <label className="ios-section-header ml-0">Текущий Email</label>
                      <input className="input-ios bg-[#F2F2F7] text-[#8E8E93]" value={userEmail} disabled />
                    </div>
                    <div>
                      <label className="ios-section-header ml-0">Новый Email</label>
                      <input type="email" className="input-ios" placeholder="Введите новый адрес" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                    </div>
                    <button onClick={handleUpdateEmail} className="btn-primary w-full">Обновить Email</button>
                  </div>
                )}

                {activeTab === 'PASSWORD' && (
                  <div className="space-y-6">
                    <div>
                      <label className="ios-section-header ml-0">Новый пароль</label>
                      <input type="password" className="input-ios" placeholder="Минимум 6 символов" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    </div>
                    <button onClick={handleUpdatePassword} className="btn-primary w-full">Изменить пароль</button>
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
                            {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-[14px] text-[#3C3C43]"><Check size={14} className="text-[#34C759]" /> {f}</li>)}
                          </ul>
                          <button className="btn-secondary w-full !min-h-[44px] !h-[44px] !text-[15px]">Выбрать тариф</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- Вкладки Виджета --- */}
                {activeTab === 'VISUAL' && (
                  <div className="space-y-8">
                    <div>
                      <label className="ios-section-header ml-0">Название компании</label>
                      <input className="input-ios" value={formData.company_name} onChange={e => handleChange('company_name', e.target.value)} />
                    </div>
                    <div>
                      <label className="ios-section-header ml-0">Главный цвет бренда (Фон)</label>
                      <div className="flex items-center gap-4 bg-[#F5F5F7] p-4 rounded-[14px] border border-[#E5E5EA]">
                        <div className="w-10 h-10 rounded-full border border-[#E5E5EA] overflow-hidden shrink-0">
                          <input type="color" className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" value={formData.theme_color} onChange={e => handleColorChange(e.target.value)} />
                        </div>
                        <span className="font-mono font-bold uppercase tracking-wider">{formData.theme_color}</span>
                      </div>
                    </div>
                    <div>
                      <label className="ios-section-header ml-0">Текст на кнопках</label>
                      <div className="flex flex-col bg-[#F5F5F7] p-4 rounded-[14px] border border-[#E5E5EA] gap-4">
                        <div className="flex bg-[#E5E5EA] p-1 rounded-[10px]">
                          <button onClick={() => handleChange('theme_text_color', '#000000')} className={`flex-1 py-1.5 text-[14px] font-medium rounded-[7px] transition-all ${formData.theme_text_color === '#000000' ? 'bg-[#FFFFFF] text-[#000000] shadow-sm' : 'text-[#8E8E93]'}`}>Черный</button>
                          <button onClick={() => handleChange('theme_text_color', '#FFFFFF')} className={`flex-1 py-1.5 text-[14px] font-medium rounded-[7px] transition-all ${formData.theme_text_color === '#FFFFFF' ? 'bg-[#FFFFFF] text-[#000000] shadow-sm' : 'text-[#8E8E93]'}`}>Белый</button>
                        </div>
                        <div className="flex items-center justify-center py-4 border-t border-[#E5E5EA] mt-2">
                           <div className="px-6 py-3 rounded-[14px] font-semibold text-[15px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-colors" style={{ backgroundColor: formData.theme_color, color: formData.theme_text_color }}>
                             Попробовать виджет
                           </div>
                        </div>
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
                    <div><label className="ios-section-header ml-0">WhatsApp</label><input className="input-ios" placeholder="https://wa.me/7..." value={formData.whatsapp} onChange={e => handleChange('whatsapp', e.target.value)} /></div>
                    <div><label className="ios-section-header ml-0">Instagram</label><input className="input-ios" placeholder="https://instagram.com/..." value={formData.instagram} onChange={e => handleChange('instagram', e.target.value)} /></div>
                    <div><label className="ios-section-header ml-0">Telegram</label><input className="input-ios" placeholder="https://t.me/..." value={formData.telegram} onChange={e => handleChange('telegram', e.target.value)} /></div>
                    <div><label className="ios-section-header ml-0">YouTube</label><input className="input-ios" placeholder="https://youtube.com/..." value={formData.youtube} onChange={e => handleChange('youtube', e.target.value)} /></div>
                    <div><label className="ios-section-header ml-0">VKontakte</label><input className="input-ios" placeholder="https://vk.com/..." value={formData.vk} onChange={e => handleChange('vk', e.target.value)} /></div>
                    <div><label className="ios-section-header ml-0">2GIS</label><input className="input-ios" placeholder="Ссылка на 2GIS" value={formData.twogis} onChange={e => handleChange('twogis', e.target.value)} /></div>
                    <div><label className="ios-section-header ml-0">Физический адрес</label><textarea className="input-ios resize-none" rows={2} placeholder="Город, улица, дом..." value={formData.address} onChange={e => handleChange('address', e.target.value)} /></div>
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