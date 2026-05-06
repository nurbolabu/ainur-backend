'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  Bot, Database, Palette, Link2, Mail, Lock, CreditCard, LogOut, 
  ChevronRight, ChevronLeft, Building2, Loader2, X, Check, UploadCloud, User, Pencil
} from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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
  
  const [projectData, setProjectData] = useState<any>(null);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  
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
      
      {/* 1. ФИКСИРОВАННЫЙ HEADER (С кнопкой НАЗАД) */}
      <div className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[calc(100%-34px)] md:w-full max-w-[690px] z-40 bg-[#FFFFFF] rounded-[22px] flex items-center justify-between pl-[10px] pr-[10px] py-[10px] border border-[#E5E5EA]">
        <Link href="/admin" className="w-[50px] h-[50px] shrink-0 bg-[#8BFDA8] rounded-[11px] flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={24} strokeWidth={1.5} className="text-[#000000]" />
        </Link>
        <span className="font-bold text-[18px] text-[#000000]">Настройки</span>
        <div className="w-[50px] h-[50px]"></div> {/* Пустой блок для баланса */}
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
            className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform relative"
          >
            {/* Иконка редактирования */}
            <div className="absolute top-4 right-4 w-8 h-8 rounded-[10px] bg-[#F2F2F7] flex items-center justify-center text-[#000000]">
              <Pencil size={14} strokeWidth={1.5} />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-[70px] h-[70px] bg-[#F2F2F7] rounded-[18px] flex items-center justify-center shrink-0 border border-[#E5E5EA] overflow-hidden">
                {projectData?.logo_url ? <img src={projectData.logo_url} className="w-full h-full object-cover" /> : <Building2 size={32} strokeWidth={1} className="text-[#8E8E93]" />}
              </div>
              <div className="flex flex-col pr-8">
                <h2 className="text-[20px] font-bold text-[#000000] leading-tight">{projectData?.company_name || 'Название компании'}</h2>
                <p className="text-[14px] text-[#8E8E93] mt-1">{userEmail}</p>
              </div>
            </div>
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
            <div className="h-[70px] flex items-center justify-between px-2.5 border-b border-[#E5E5EA] shrink-0">
              {/* Кнопка ЗАКРЫТЬ (Серая) */}
              <button onClick={() => setActiveModal(null)} className="w-[50px] h-[50px] flex items-center justify-center bg-[#F2F2F7] rounded-[11px] text-[#000000] active:scale-95 transition-transform">
                <X size={24} strokeWidth={1.5} />
              </button>
              
              <span className="font-bold text-[18px] truncate px-2 text-center">
                {activeModal === 'company' && 'Профиль компании'}
                {activeModal === 'prompt' && 'Промпт и поведение'}
                {activeModal === 'knowledge' && 'База знаний'}
                {activeModal === 'appearance' && 'Внешний вид'}
                {activeModal === 'contacts' && 'Контакты и соцсети'}
                {activeModal === 'email' && 'Сменить Email'}
                {activeModal === 'password' && 'Сменить пароль'}
                {activeModal === 'plans' && 'Моя подписка'}
              </span>
              
              {/* Кнопка СОХРАНИТЬ (Зеленая) */}
              {['email', 'password', 'plans'].includes(activeModal) ? (
                 <div className="w-[50px] h-[50px]"></div>
              ) : (
                <button onClick={handleSaveProject} disabled={isSaving} className="w-[50px] h-[50px] shrink-0 bg-[#8BFDA8] rounded-[11px] flex items-center justify-center text-[#000000] active:scale-95 disabled:opacity-50 transition-transform">
                  {isSaving ? <Loader2 size={24} strokeWidth={1.5} className="animate-spin text-[#000000]" /> : <Check size={24} strokeWidth={1.5} />}
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
                      <label className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-[#FFFFFF] rounded-[12px] cursor-pointer text-[16px] font-medium text-[#000000] border border-[#E5E5EA] active:scale-95 transition-transform shadow-sm">
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
                  {/* text-[16px] обязательно для предотвращения зума */}
                  <textarea className="w-full h-[300px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] p-4 text-[16px] outline-none resize-none focus:border-[#8BFDA8]" value={editForm.system_prompt} onChange={e => setEditForm({...editForm, system_prompt: e.target.value})} placeholder="Опишите, как ИИ должен общаться..." />
                </div>
              )}

              {activeModal === 'knowledge' && (
                <div className="flex flex-col gap-2 h-full">
                  <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">База знаний</label>
                  {/* text-[16px] обязательно для предотвращения зума */}
                  <textarea className="w-full h-[300px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] p-4 text-[16px] outline-none resize-none focus:border-[#8BFDA8]" value={editForm.knowledge_base} onChange={e => setEditForm({...editForm, knowledge_base: e.target.value})} placeholder="Вставьте сюда текст о вашей компании, услугах, частые вопросы..." />
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
                         <div className="px-6 py-3 rounded-[14px] font-semibold text-[16px]" style={{ backgroundColor: editForm.theme_color, color: editForm.theme_text_color }}>
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
                        <span className="flex items-center pl-4 pr-1 text-[#8E8E93] text-[16px] select-none bg-transparent">{social.display}</span>
                        <input className="flex-1 bg-transparent py-3 px-2 text-[16px] text-[#000000] outline-none placeholder:text-[#C6C6C8]" placeholder={social.placeholder} value={editForm[social.id]?.replace(social.prefix, '') || ''} onChange={e => {
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
                  <button onClick={handleUpdateEmail} disabled={isSaving || !newEmail} className="h-[50px] w-full bg-[#000000] text-[#FFFFFF] rounded-[12px] font-semibold text-[16px] disabled:opacity-50 mt-4 active:scale-95 transition-transform">
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
                  <button onClick={handleUpdatePassword} disabled={isSaving || !newPassword} className="h-[50px] w-full bg-[#000000] text-[#FFFFFF] rounded-[12px] font-semibold text-[16px] disabled:opacity-50 mt-4 active:scale-95 transition-transform">
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