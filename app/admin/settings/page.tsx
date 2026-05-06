'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Bot, Database, Palette, Link2, Mail, Lock, CreditCard, LogOut, 
  ChevronRight, Building2, Loader2, X, Check, UploadCloud, User
} from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Умный расчет цвета текста на кнопке из твоего старого кода
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
  
  // Данные и состояния
  const [projectData, setProjectData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  // Модальные окна
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  
  // Состояния для аккаунта и тарифов
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const fetchUserAndProject = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email || '');

      const id = localStorage.getItem('ainur_admin_project_id');
      if (id) {
        setProjectId(id);
        fetchProjectData(id);
      }
    };
    fetchUserAndProject();
  }, []);

  async function fetchProjectData(id: string) {
    setIsLoading(true);
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    
    if (data) {
      let links = data.social_links || {};
      if (typeof links === 'string') { try { links = JSON.parse(links); } catch(e) { links = {}; } }
      const textColor = data.theme_text_color || getContrastColor(data.theme_color || '#8BFDA8');
      
      setProjectData({ 
        company_name: data.company_name || '', 
        logo_url: data.logo_url || '',
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
    setIsLoading(false);
  }

  function openModal(modalName: string) {
    setEditForm({ ...projectData });
    setNewEmail('');
    setNewPassword('');
    setActiveModal(modalName);
  }

  // Загрузка логотипа
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !projectId) return;

    setIsUploadingLogo(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('logos').upload(fileName, file);

    if (error) {
      alert('Ошибка при загрузке логотипа: ' + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(fileName);
      setEditForm({ ...editForm, logo_url: publicUrl });
    }
    setIsUploadingLogo(false);
  }

  const handleColorChange = (hex: string) => {
    const suggestedTextColor = getContrastColor(hex);
    setEditForm({ ...editForm, theme_color: hex, theme_text_color: suggestedTextColor });
  };

  // Сохранение данных проекта
  async function handleSaveProject() {
    if (!projectId) return;
    setIsSaving(true);
    
    const updateData = {
      company_name: editForm.company_name, 
      logo_url: editForm.logo_url,
      theme_color: editForm.theme_color, 
      theme_text_color: editForm.theme_text_color,
      system_prompt: editForm.system_prompt, 
      knowledge_base: editForm.knowledge_base, 
      contacts_address: editForm.address,
      social_links: { 
        whatsapp: editForm.whatsapp, instagram: editForm.instagram, telegram: editForm.telegram, 
        youtube: editForm.youtube, vk: editForm.vk, twogis: editForm.twogis 
      }
    };

    const { error } = await supabase.from('projects').update(updateData).eq('id', projectId);
      
    if (!error) {
      setProjectData({ ...projectData, ...editForm });
      setActiveModal(null);
    } else {
      alert("Ошибка при сохранении: " + error.message);
    }
    setIsSaving(false);
  }

  // Обновление Email
  const handleUpdateEmail = async () => {
    if (!newEmail) return;
    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) alert('Ошибка: ' + error.message);
    else { 
      alert('Подтвердите изменение на старой и новой почте.'); 
      setUserEmail(newEmail); 
      setActiveModal(null); 
    }
    setIsSaving(false);
  };

  // Обновление пароля
  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) return alert('Пароль должен быть минимум 6 символов');
    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) alert('Ошибка: ' + error.message);
    else { alert('Пароль успешно изменен'); setActiveModal(null); }
    setIsSaving(false);
  };

  const handleSignOut = async () => {
    if (confirm('Выйти из аккаунта?')) {
      await supabase.auth.signOut();
      localStorage.removeItem('ainur_admin_project_id');
      router.push('/login');
    }
  };

  const SettingsRow = ({ icon: Icon, color, title, isLast = false, onClick }: any) => (
    <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 cursor-pointer active:bg-[#F2F2F7] transition-colors ${!isLast ? 'border-b border-[#E5E5EA]' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-[32px] h-[32px] rounded-[8px] flex items-center justify-center text-[#FFFFFF]`} style={{ backgroundColor: color }}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <span className="text-[16px] font-medium text-[#000000]">{title}</span>
      </div>
      <ChevronRight size={20} strokeWidth={1.5} className="text-[#C6C6C8]" />
    </div>
  );

  const plans = [
    { name: 'Basic', price: isYearly ? '8 000' : '10 000', features: ['AI Ассистент', 'Каталог (50 тов.)', 'Stories'] },
    { name: 'Pro', price: isYearly ? '15 000' : '20 000', features: ['AI Ассистент', 'Безлимит товаров', 'Stories', 'Свой цвет'], recommended: true },
    { name: 'Business', price: isYearly ? '35 000' : '45 000', features: ['AI Ассистент', 'Priority Support', 'Custom Integration'] },
  ];

  return (
    <div className="w-full max-w-[690px] mx-auto px-[17px] md:px-0 pt-[100px] animate-in fade-in duration-300 flex flex-col gap-6 pb-[100px] min-h-[100dvh]">
      
      {/* 1. ФИКСИРОВАННЫЙ HEADER */}
      <div className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[calc(100%-34px)] md:w-full max-w-[690px] z-40 bg-[#FFFFFF] rounded-[22px] flex items-center justify-between pl-[20px] pr-[10px] py-[10px] border border-[#E5E5EA]">
        <Link href="/admin">
          <svg width="99" height="14" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="black"/>
            <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="black"/>
            <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="black"/>
            <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
          </svg>
        </Link>
        <div className="w-[50px] h-[50px]"></div>
      </div>

      <div className="px-1 mt-2">
        <h1 className="text-[28px] font-bold text-[#000000]">Настройки</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#8E8E93]" size={32} strokeWidth={1.5} />
        </div>
      ) : (
        <>
          {/* 2. КАРТОЧКА КОМПАНИИ ПРОФИЛЯ */}
          <div 
            onClick={() => openModal('company')}
            className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-4">
              <div className="w-[70px] h-[70px] bg-[#F2F2F7] rounded-[18px] flex items-center justify-center shrink-0 border border-[#E5E5EA] overflow-hidden">
                {projectData?.logo_url ? <img src={projectData.logo_url} className="w-full h-full object-cover" /> : <Building2 size={32} strokeWidth={1} className="text-[#8E8E93]" />}
              </div>
              <div className="flex flex-col">
                <h2 className="text-[20px] font-bold text-[#000000] leading-tight">{projectData?.company_name || 'Название компании'}</h2>
                <p className="text-[14px] text-[#8E8E93] mt-1">{userEmail}</p>
              </div>
            </div>
            <ChevronRight size={24} strokeWidth={1.5} className="text-[#C6C6C8]" />
          </div>

          {/* 3. НАСТРОЙКИ: ИИ и База знаний */}
          <div className="flex flex-col gap-2">
            <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Интеллект</span>
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
              <SettingsRow icon={Bot} color="#007AFF" title="Промпт и поведение" onClick={() => openModal('prompt')} />
              <SettingsRow icon={Database} color="#5856D6" title="База знаний (Файлы)" isLast={true} onClick={() => openModal('knowledge')} />
            </div>
          </div>

          {/* 4. НАСТРОЙКИ: Виджет */}
          <div className="flex flex-col gap-2">
            <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Виджет</span>
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
              <SettingsRow icon={Palette} color="#FF9500" title="Внешний вид и цвета" onClick={() => openModal('appearance')} />
              <SettingsRow icon={Link2} color="#34C759" title="Контакты и соцсети" isLast={true} onClick={() => openModal('contacts')} />
            </div>
          </div>

          {/* 5. НАСТРОЙКИ: Аккаунт и безопасность */}
          <div className="flex flex-col gap-2">
            <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Аккаунт и безопасность</span>
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
              <SettingsRow icon={Mail} color="#5AC8FA" title="Сменить Email" onClick={() => openModal('email')} />
              <SettingsRow icon={Lock} color="#FF2D55" title="Сменить пароль" onClick={() => openModal('password')} />
              <SettingsRow icon={CreditCard} color="#8E8E93" title="Тариф и подписка" isLast={true} onClick={() => openModal('plans')} />
            </div>
          </div>

          {/* 6. КНОПКА ВЫХОДА */}
          <div className="mt-4">
            <div 
              onClick={handleSignOut}
              className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-4 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform"
            >
              <LogOut size={20} strokeWidth={1.5} className="text-[#FF3B30]" />
              <span className="text-[16px] font-semibold text-[#FF3B30]">Выйти из аккаунта</span>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* СИСТЕМА МОДАЛЬНЫХ ОКОН                                   */}
      {/* ======================================================== */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center">
          <div className="bg-[#FFFFFF] w-full max-w-[690px] h-[90vh] md:h-auto md:max-h-[85vh] rounded-t-[22px] md:rounded-[22px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            
            {/* Хедер модалки */}
            <div className="h-[60px] flex items-center justify-between px-4 border-b border-[#E5E5EA] shrink-0">
              <button onClick={() => setActiveModal(null)} className="w-[40px] h-[40px] flex items-center justify-center text-[#8E8E93] active:scale-95">
                <X size={24} strokeWidth={1.5} />
              </button>
              <span className="font-bold text-[18px]">
                {activeModal === 'company' && 'Профиль компании'}
                {activeModal === 'prompt' && 'Промпт и поведение'}
                {activeModal === 'knowledge' && 'База знаний'}
                {activeModal === 'appearance' && 'Внешний вид'}
                {activeModal === 'contacts' && 'Контакты и соцсети'}
                {activeModal === 'email' && 'Сменить Email'}
                {activeModal === 'password' && 'Сменить пароль'}
                {activeModal === 'plans' && 'Моя подписка'}
              </span>
              
              {/* Кнопка сохранения разная для БД проектов и Auth */}
              {['email', 'password', 'plans'].includes(activeModal) ? (
                 <div className="w-[40px] h-[40px]"></div>
              ) : (
                <button onClick={handleSaveProject} disabled={isSaving} className="w-[40px] h-[40px] flex items-center justify-center text-[#8BFDA8] active:scale-95 disabled:opacity-50">
                  {isSaving ? <Loader2 size={24} strokeWidth={1.5} className="animate-spin text-[#8E8E93]" /> : <Check size={28} strokeWidth={2} />}
                </button>
              )}
            </div>

            {/* Контент модалки */}
            <div className="flex-1 overflow-y-auto p-5 pb-10">
              
              {activeModal === 'company' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Название компании</label>
                    <input className="input-ios border border-[#E5E5EA]" value={editForm.company_name} onChange={e => setEditForm({...editForm, company_name: e.target.value})} placeholder="AI NUR" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Логотип (Аватарка виджета)</label>
                    <div className="flex items-center gap-4 bg-[#F5F5F7] p-4 rounded-[14px] border border-[#E5E5EA]">
                      <div className="w-16 h-16 rounded-[16px] bg-[#FFFFFF] border border-[#E5E5EA] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {isUploadingLogo ? <Loader2 className="animate-spin text-[#8E8E93]" size={20} /> : editForm.logo_url ? <img src={editForm.logo_url} className="w-full h-full object-cover" /> : <User size={24} strokeWidth={1.5} className="text-[#8E8E93]" />}
                      </div>
                      <label className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-[#FFFFFF] rounded-[12px] cursor-pointer text-[15px] font-medium text-[#000000] border border-[#E5E5EA] active:scale-95 transition-transform shadow-sm">
                        <UploadCloud size={18} strokeWidth={1.5} /> {editForm.logo_url ? 'Заменить логотип' : 'Загрузить логотип'}
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'prompt' && (
                <div className="flex flex-col gap-2 h-full">
                  <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Роль ассистента</label>
                  <textarea className="w-full h-[300px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] p-4 text-[15px] outline-none resize-none focus:border-[#8BFDA8]" value={editForm.system_prompt} onChange={e => setEditForm({...editForm, system_prompt: e.target.value})} placeholder="Опишите, как ИИ должен общаться..." />
                </div>
              )}

              {activeModal === 'knowledge' && (
                <div className="flex flex-col gap-2 h-full">
                  <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">База знаний</label>
                  <textarea className="w-full h-[300px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] p-4 text-[15px] outline-none resize-none focus:border-[#8BFDA8]" value={editForm.knowledge_base} onChange={e => setEditForm({...editForm, knowledge_base: e.target.value})} placeholder="Вставьте сюда текст о вашей компании, услугах, частые вопросы..." />
                </div>
              )}

              {activeModal === 'appearance' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Главный цвет бренда (Фон)</label>
                    <div className="flex items-center gap-4 bg-[#F5F5F7] p-4 rounded-[14px] border border-[#E5E5EA]">
                      <div className="w-10 h-10 rounded-full border border-[#E5E5EA] overflow-hidden shrink-0 shadow-sm">
                        <input type="color" className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer" value={editForm.theme_color} onChange={e => handleColorChange(e.target.value)} />
                      </div>
                      <span className="font-mono font-bold uppercase tracking-wider">{editForm.theme_color}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Текст на кнопках</label>
                    <div className="flex flex-col bg-[#F5F5F7] p-4 rounded-[14px] border border-[#E5E5EA] gap-4">
                      <div className="flex bg-[#E5E5EA] p-1 rounded-[10px]">
                        <button onClick={() => setEditForm({...editForm, theme_text_color: '#000000'})} className={`flex-1 py-1.5 text-[14px] font-medium rounded-[7px] transition-all ${editForm.theme_text_color === '#000000' ? 'bg-[#FFFFFF] text-[#000000] shadow-sm' : 'text-[#8E8E93]'}`}>Черный</button>
                        <button onClick={() => setEditForm({...editForm, theme_text_color: '#FFFFFF'})} className={`flex-1 py-1.5 text-[14px] font-medium rounded-[7px] transition-all ${editForm.theme_text_color === '#FFFFFF' ? 'bg-[#FFFFFF] text-[#000000] shadow-sm' : 'text-[#8E8E93]'}`}>Белый</button>
                      </div>
                      <div className="flex items-center justify-center py-4 border-t border-[#E5E5EA] mt-2">
                         <div className="px-6 py-3 rounded-[14px] font-semibold text-[15px]" style={{ backgroundColor: editForm.theme_color, color: editForm.theme_text_color }}>
                           Попробовать виджет
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'contacts' && (
                <div className="flex flex-col gap-4">
                  {[
                    { id: 'whatsapp', label: 'WhatsApp', prefix: 'https://wa.me/', display: 'wa.me/', placeholder: '77001234567' },
                    { id: 'instagram', label: 'Instagram', prefix: 'https://instagram.com/', display: 'instagram.com/', placeholder: 'username' },
                    { id: 'telegram', label: 'Telegram', prefix: 'https://t.me/', display: 't.me/', placeholder: 'username' },
                    { id: 'youtube', label: 'YouTube', prefix: 'https://youtube.com/@', display: 'youtube.com/@', placeholder: 'channel' },
                    { id: 'vk', label: 'VKontakte', prefix: 'https://vk.com/', display: 'vk.com/', placeholder: 'username' },
                    { id: 'twogis', label: '2GIS', prefix: 'https://2gis.kz/', display: '2gis.kz/', placeholder: 'link' },
                  ].map(social => (
                    <div key={social.id} className="flex flex-col gap-1">
                      <label className="text-[12px] font-semibold text-[#8E8E93] uppercase ml-1">{social.label}</label>
                      <div className="flex bg-[#FFFFFF] border border-[#E5E5EA] rounded-[14px] overflow-hidden focus-within:border-[#8BFDA8]">
                        <span className="flex items-center pl-4 pr-1 text-[#8E8E93] text-[15px] select-none bg-transparent">{social.display}</span>
                        <input className="flex-1 bg-transparent py-3 px-2 text-[15px] text-[#000000] outline-none placeholder:text-[#C6C6C8]" placeholder={social.placeholder} value={editForm[social.id]?.replace(social.prefix, '') || ''} onChange={e => {
                            let cleanValue = e.target.value.replace(social.prefix, '').replace(social.display, '');
                            setEditForm({...editForm, [social.id]: cleanValue ? `${social.prefix}${cleanValue}` : ''});
                        }} />
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-[12px] font-semibold text-[#8E8E93] uppercase ml-1">Физический адрес</label>
                    <textarea className="input-ios border border-[#E5E5EA] resize-none" rows={2} placeholder="Город, улица, дом..." value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                  </div>
                </div>
              )}

              {activeModal === 'email' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Текущий Email</label>
                    <input className="input-ios bg-[#F2F2F7] text-[#8E8E93]" value={userEmail} disabled />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Новый Email</label>
                    <input type="email" className="input-ios border border-[#E5E5EA]" placeholder="Введите новый адрес" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                  </div>
                  <button onClick={handleUpdateEmail} disabled={isSaving || !newEmail} className="h-[50px] w-full bg-[#000000] text-[#FFFFFF] rounded-[12px] font-semibold text-[15px] disabled:opacity-50 mt-4 active:scale-95 transition-transform">
                    {isSaving ? 'Сохранение...' : 'Обновить Email'}
                  </button>
                </div>
              )}

              {activeModal === 'password' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Новый пароль</label>
                    <input type="password" className="input-ios border border-[#E5E5EA]" placeholder="Минимум 6 символов" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </div>
                  <button onClick={handleUpdatePassword} disabled={isSaving || !newPassword} className="h-[50px] w-full bg-[#000000] text-[#FFFFFF] rounded-[12px] font-semibold text-[15px] disabled:opacity-50 mt-4 active:scale-95 transition-transform">
                    {isSaving ? 'Сохранение...' : 'Изменить пароль'}
                  </button>
                </div>
              )}

              {activeModal === 'plans' && (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center bg-[#F2F2F7] p-1 rounded-[12px]">
                    <button onClick={() => setIsYearly(false)} className={`flex-1 py-2 text-[14px] font-semibold rounded-[10px] transition-all ${!isYearly ? 'bg-[#FFFFFF] shadow-sm text-[#000000]' : 'text-[#8E8E93]'}`}>Месяц</button>
                    <button onClick={() => setIsYearly(true)} className={`flex-1 py-2 text-[14px] font-semibold rounded-[10px] transition-all ${isYearly ? 'bg-[#FFFFFF] shadow-sm text-[#000000]' : 'text-[#8E8E93]'}`}>Год -20%</button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {plans.map((plan) => (
                      <div key={plan.name} className={`p-5 rounded-[22px] border-2 transition-all ${plan.recommended ? 'border-[#8BFDA8] bg-[#8BFDA8]/5' : 'border-[#E5E5EA] bg-[#FFFFFF]'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-[18px] font-bold text-[#000000]">{plan.name}</h3>
                            <div className="text-[24px] font-black mt-1 text-[#000000]">{plan.price} ₸ <span className="text-[14px] font-normal text-[#8E8E93]">/{isYearly ? 'год' : 'мес'}</span></div>
                          </div>
                          {plan.recommended && <span className="bg-[#8BFDA8] text-[10px] font-black px-2 py-1 rounded-full uppercase text-[#000000]">Популярный</span>}
                        </div>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-[14px] font-medium text-[#000000]"><Check size={16} strokeWidth={2.5} className="text-[#34C759]" /> {f}</li>)}
                        </ul>
                        <button className="w-full h-[44px] rounded-[12px] bg-[#000000] text-[#FFFFFF] font-semibold text-[14px] active:scale-95 transition-transform">Выбрать тариф</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}