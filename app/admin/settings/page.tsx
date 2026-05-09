'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
// Исправлены иконки: заменили PlaySquare на Video, так как PlaySquare удален в новых версиях
import { 
  Bot, Database, Palette, Link2, Mail, Lock, CreditCard, LogOut, 
  ChevronRight, ChevronLeft, Building2, Loader2, X, Check, UploadCloud, User, Pencil, Code, Copy, ExternalLink,
  Bell, Send, CircleHelp, ShoppingBag, Video
} from 'lucide-react';

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
  const [isCopied, setIsCopied] = useState(false);
  
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isYearly, setIsYearly] = useState(false);
  
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndProject = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUserEmail(user.email || '');

      let id = localStorage.getItem('ainur_admin_project_id');
      
      if (!id) {
        const { data: userProject } = await supabase
          .from('projects')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (userProject) {
          id = userProject.id;
          localStorage.setItem('ainur_admin_project_id', id);
        }
      }

      if (id) {
        setProjectId(id);
        fetchProjectData(id);
      } else {
        setIsLoading(false);
      }
    };
    fetchUserAndProject();
  }, [router]);

  async function fetchProjectData(id: string) {
    setIsLoading(true);
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    
    if (data) {
      let links = data.social_links || {};
      if (typeof links === 'string') { try { links = JSON.parse(links); } catch(e) { links = {}; } }
      
      let wSettings = data.widget_settings || {};
      if (typeof wSettings === 'string') { try { wSettings = JSON.parse(wSettings); } catch(e) { wSettings = {}; } }

      const textColor = data.theme_text_color || getContrastColor(data.theme_color || '#8BFDA8');
      
      setProjectData({ 
        company_name: data.company_name || '', 
        logo_url: data.logo_url || '',
        theme_color: data.theme_color || '#8BFDA8', 
        theme_text_color: textColor,
        system_prompt: data.system_prompt || '', 
        knowledge_base: data.knowledge_base || '',
        welcome_message: data.welcome_message || '',
        address: data.contacts_address || '', 
        whatsapp: links.whatsapp || '', 
        instagram: links.instagram || '', 
        telegram: links.telegram || '',
        youtube: links.youtube || '',
        vk: links.vk || '',
        twogis: links.twogis || '',
        is_paid: data.is_paid || false,
        widget_settings: wSettings,
        notify_telegram: wSettings.notify_telegram || ''
      });
    }
    setIsLoading(false);
  }

  function openModal(modalName: string) {
    setEditForm({ ...projectData });
    setNewEmail('');
    setNewPassword('');
    setIsCopied(false);
    setSelectedPlan(null);
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
    if(/^#[0-9A-F]{0,6}$/i.test(hex)) {
        const suggestedTextColor = getContrastColor(hex);
        setEditForm({ ...editForm, theme_color: hex, theme_text_color: suggestedTextColor });
    }
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
      welcome_message: editForm.welcome_message,
      contacts_address: editForm.address,
      social_links: { 
        whatsapp: editForm.whatsapp, instagram: editForm.instagram, telegram: editForm.telegram, 
        youtube: editForm.youtube, vk: editForm.vk, twogis: editForm.twogis 
      },
      widget_settings: {
        ...(projectData.widget_settings || {}),
        notify_telegram: editForm.notify_telegram
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

  const getEmbedCode = () => {
    return `<script>
(function(){
    var iframe = document.createElement('iframe');
    iframe.src = "https://ainur-backend-eta.vercel.app/widget.html?id=${projectId}";
    iframe.style.position = "fixed";
    iframe.style.bottom = "0";
    iframe.style.left = "50%";
    iframe.style.transform = "translateX(-50%)";
    iframe.style.width = "100%";
    iframe.style.maxWidth = "400px";
    iframe.style.height = "120px";
    iframe.style.border = "none";
    iframe.style.zIndex = "999999";
    iframe.style.background = "transparent";
    iframe.style.transition = "height 0.3s ease, max-width 0.3s ease";
    document.body.appendChild(iframe);

    window.addEventListener('message', function(e) {
        if(e.data === 'ainur_opened') {
            iframe.style.height = "750px";
            iframe.style.maxWidth = "400px";
        } else if(e.data === 'ainur_closed') {
            iframe.style.height = "120px";
            iframe.style.maxWidth = "400px";
        } else if(e.data === 'ainur_fullscreen') {
            iframe.style.height = "100vh";
            iframe.style.maxWidth = "100vw";
        }
    });
})();
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getEmbedCode());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const SettingsRow = ({ icon: Icon, color, title, isLast = false, onClick, rightIcon: RightIcon = ChevronRight }: any) => (
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
      <RightIcon size={20} strokeWidth={1.5} className="text-[#C6C6C8]" />
    </div>
  );

  const plans = [
  { 
    name: 'Базовый', 
    price: isYearly ? '45 000' : '5 000', 
    features: [
      'Публикация Stories',
      'Каталог до 100 товаров',
      'Умная корзина',
      'Формы сбора заявок',
      'Кнопки соцсетей',
      'Уникальный дизайн цвета'
    ] 
  },
  { 
    name: 'Индивидуальный', 
    price: 'Договорная', 
    features: [
      'Всё безлимитно',
      'Персональный промпт',
      'Интеграция с CRM',
      'Приоритетная поддержка'
    ], 
    recommended: true 
  },
];

  return (
    <div className="w-full max-w-[690px] mx-auto px-[17px] md:px-0 pt-[100px] animate-in fade-in duration-300 flex flex-col gap-6 pb-[100px] min-h-[100dvh]">
      
      {/* 1. ФИКСИРОВАННЫЙ HEADER */}
      <div className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[calc(100%-34px)] md:w-full max-w-[690px] z-40 bg-[#FFFFFF] rounded-[22px] flex items-center justify-between pl-[10px] pr-[10px] py-[10px] border border-[#E5E5EA]">
        <Link href="/admin" className="w-[50px] h-[50px] shrink-0 bg-[#8BFDA8] rounded-[11px] flex items-center justify-center active:scale-95 transition-transform">
          <ChevronLeft size={24} strokeWidth={1.5} className="text-[#000000]" />
        </Link>
        <span className="font-bold text-[18px] text-[#000000]">Настройки</span>
        <div className="w-[50px] h-[50px]"></div>
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
            className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-5 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 w-8 h-8 rounded-[10px] bg-[#F2F2F7] flex items-center justify-center text-[#000000] z-10 shrink-0">
              <Pencil size={14} strokeWidth={1.5} />
            </div>

            <div className="flex items-center gap-4 min-w-0 flex-1 pr-10">
              <div className="w-[70px] h-[70px] bg-[#F2F2F7] rounded-[18px] flex items-center justify-center shrink-0 border border-[#E5E5EA] overflow-hidden">
                {projectData?.logo_url ? <img src={projectData.logo_url} className="w-full h-full object-cover" /> : <Building2 size={32} strokeWidth={1} className="text-[#8E8E93]" />}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <h2 className="text-[20px] font-bold text-[#000000] leading-tight truncate">{projectData?.company_name || 'Название компании'}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <p className="text-[14px] text-[#8E8E93] truncate">{userEmail}</p>
                    {projectData?.is_paid && (
                        <span className="bg-[#8BFDA8] text-[#000000] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">PRO</span>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. НАСТРОЙКИ: ИИ и База знаний */}
          <div className="flex flex-col gap-2">
            <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Интеллект</span>
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
              <SettingsRow icon={Bot} color="#007AFF" title="Промпт и поведение" onClick={() => openModal('prompt')} />
              <SettingsRow icon={Database} color="#5856D6" title="База знаний для ИИ" isLast={true} onClick={() => openModal('knowledge')} />
            </div>
          </div>

          {/* 4. НАСТРОЙКИ: Виджет */}
          <div className="flex flex-col gap-2">
            <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Виджет</span>
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
              <SettingsRow icon={Palette} color="#FF9500" title="Внешний вид и цвета" onClick={() => openModal('appearance')} />
              <SettingsRow icon={Link2} color="#34C759" title="Контакты и соцсети" onClick={() => openModal('contacts')} />
              
              <a href={`/widget.html?id=${projectId}`} target="_blank" className="text-decoration-none">
                 <SettingsRow icon={ExternalLink} color="#8E8E93" title="Прототип виджета" rightIcon={ExternalLink} />
              </a>

              <SettingsRow icon={Code} color={projectData?.is_paid ? "#000000" : "#8E8E93"} title="Код для вставки на сайт" isLast={true} onClick={() => openModal('integration')} rightIcon={projectData?.is_paid ? ChevronRight : Lock} />
            </div>
          </div>

          {/* 5. НАСТРОЙКИ: Уведомления */}
          <div className="flex flex-col gap-2">
            <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Уведомления</span>
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
              <SettingsRow icon={Bell} color="#FF2D55" title="Куда получать заявки" isLast={true} onClick={() => openModal('notifications')} />
            </div>
          </div>

          {/* 6. СПРАВОЧНЫЙ ЦЕНТР */}
          <div className="flex flex-col gap-2">
            <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Справочный центр</span>
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
              <SettingsRow icon={Bot} color="#8E8E93" title="Как обучить ИИ ассистента" onClick={() => openModal('help_train_ai')} />
              <SettingsRow icon={Code} color="#8E8E93" title="Как установить виджет на сайт" onClick={() => openModal('help_install')} />
              <SettingsRow icon={ShoppingBag} color="#8E8E93" title="Как добавить товары в каталог" onClick={() => openModal('help_catalog')} />
              <SettingsRow icon={Video} color="#8E8E93" title="Как опубликовать stories" onClick={() => openModal('help_stories')} />
              <SettingsRow icon={Bell} color="#8E8E93" title="Как получать уведомления" onClick={() => openModal('help_notifications')} />
              <SettingsRow icon={Palette} color="#8E8E93" title="Как изменить внешний вид" onClick={() => openModal('help_appearance')} />
              <a href="https://wa.me/77077175818" target="_blank" className="text-decoration-none">
                 <SettingsRow icon={CircleHelp} color="#000000" title="Написать в поддержку" isLast={true} rightIcon={ExternalLink} />
              </a>
            </div>
          </div>

          {/* 7. НАСТРОЙКИ: Аккаунт и безопасность */}
          <div className="flex flex-col gap-2">
            <span className="px-4 text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Аккаунт и безопасность</span>
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col">
              <SettingsRow icon={Mail} color="#5AC8FA" title="Сменить Email" onClick={() => openModal('email')} />
              <SettingsRow icon={Lock} color="#FF2D55" title="Сменить пароль" onClick={() => openModal('password')} />
              <SettingsRow icon={CreditCard} color="#8E8E93" title="Тариф и подписка" isLast={true} onClick={() => openModal('plans')} />
            </div>
          </div>

          {/* 8. КНОПКА ВЫХОДА */}
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center pt-[10px] px-0 md:px-[10px]">
          <div className="bg-[#FFFFFF] w-full max-w-[690px] h-[calc(100dvh-10px)] md:h-auto md:max-h-[calc(100dvh-20px)] rounded-t-[22px] md:rounded-[22px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-full md:zoom-in-95 duration-300">
            
            {/* Хедер модалки */}
            <div className="h-[70px] flex items-center justify-between px-2.5 border-b border-[#E5E5EA] shrink-0">
              <button onClick={() => setActiveModal(null)} className="w-[50px] h-[50px] flex items-center justify-center bg-[#F2F2F7] rounded-[11px] text-[#000000] active:scale-95 transition-transform">
                <X size={24} strokeWidth={1.5} />
              </button>
              
              <span className="font-bold text-[18px] truncate px-2 text-center">
                {activeModal === 'company' && 'Профиль компании'}
                {activeModal === 'prompt' && 'Промпт и поведение'}
                {activeModal === 'knowledge' && 'База знаний'}
                {activeModal === 'appearance' && 'Внешний вид'}
                {activeModal === 'contacts' && 'Контакты и соцсети'}
                {activeModal === 'notifications' && 'Уведомления о заявках'}
                {activeModal === 'integration' && 'Код для сайта'}
                {activeModal === 'email' && 'Сменить Email'}
                {activeModal === 'password' && 'Сменить пароль'}
                {activeModal === 'plans' && 'Моя подписка'}
                
                {/* Заголовки для справочного центра */}
                {activeModal === 'help_train_ai' && 'Обучение ИИ'}
                {activeModal === 'help_install' && 'Установка на сайт'}
                {activeModal === 'help_catalog' && 'Добавление товаров'}
                {activeModal === 'help_stories' && 'Публикация Stories'}
                {activeModal === 'help_notifications' && 'Уведомления'}
                {activeModal === 'help_appearance' && 'Внешний вид'}
              </span>
              
              {/* Скрываем галочку сохранения для информационных окон */}
              {['email', 'password', 'plans', 'integration', 'help_train_ai', 'help_install', 'help_catalog', 'help_stories', 'help_notifications', 'help_appearance'].includes(activeModal) ? (
                 <div className="w-[50px] h-[50px]"></div>
              ) : (
                <button onClick={handleSaveProject} disabled={isSaving} className="w-[50px] h-[50px] shrink-0 bg-[#8BFDA8] rounded-[11px] flex items-center justify-center text-[#000000] active:scale-95 disabled:opacity-50 transition-transform">
                  {isSaving ? <Loader2 size={24} strokeWidth={1.5} className="animate-spin text-[#000000]" /> : <Check size={24} strokeWidth={1.5} />}
                </button>
              )}
            </div>

            {/* Контент модалки */}
            <div className="flex-1 overflow-y-auto p-5 pb-10">
              
              {/* ================= ИНСТРУКЦИИ (СПРАВОЧНЫЙ ЦЕНТР) ================= */}
              
              {activeModal === 'help_train_ai' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F2F2F7] rounded-[16px] p-5 text-[15px] text-[#000000] leading-relaxed border border-[#E5E5EA]">
                    <b>Как обучить ИИ ассистента?</b><br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 1.</span> Перейдите в раздел «Интеллект» → «База знаний для ИИ».<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 2.</span> Напишите или вставьте всю важную информацию о вашей компании: чем вы занимаетесь, какие у вас цены, условия доставки, график работы и ответы на частые вопросы клиентов. Чем подробнее текст, тем точнее ответы ИИ.<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 3.</span> Перейдите в раздел «Промпт и поведение» и задайте роль ассистенту (например: "Ты дружелюбный менеджер по продажам").
                  </div>
                </div>
              )}

              {activeModal === 'help_install' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F2F2F7] rounded-[16px] p-5 text-[15px] text-[#000000] leading-relaxed border border-[#E5E5EA]">
                    <b>Как установить виджет на сайт?</b><br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 1.</span> Перейдите в раздел «Виджет» → «Код для вставки на сайт». <br/><i>(Внимание: генерация кода доступна только на PRO тарифе)</i>.<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 2.</span> Скопируйте предоставленный HTML-код.<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 3.</span> Вставьте этот код в настройки вашего сайта перед закрывающим тегом <b>&lt;/body&gt;</b>.<br/>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li><b>На Tilda:</b> Настройки сайта → Еще → HTML-код для вставки внутрь HEAD (или BODY).</li>
                      <li><b>На WordPress:</b> Внешний вид → Редактор тем → header.php или footer.php.</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeModal === 'help_catalog' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F2F2F7] rounded-[16px] p-5 text-[15px] text-[#000000] leading-relaxed border border-[#E5E5EA]">
                    <b>Как добавить товары в каталог?</b><br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 1.</span> Перейдите в раздел "Каталог" в нижнем меню.<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 2.</span> Нажмите на кнопку "Добавить товар".<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 3.</span> В открывшемся окне загрузите картинку товара, введите название, описание и укажите цену. Затем нажмите "Сохранить".<br/><br/>
                    Товар автоматически появится в вашем виджете! В будущем вы сможете редактировать описание, менять картинку или удалить товар в этом же разделе.
                  </div>
                </div>
              )}

              {activeModal === 'help_stories' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F2F2F7] rounded-[16px] p-5 text-[15px] text-[#000000] leading-relaxed border border-[#E5E5EA]">
                    <b>Как опубликовать Stories?</b><br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 1.</span> Перейдите в раздел "Stories" в нижнем меню или нажмите "Добавить Stories" на главном экране.<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 2.</span> Выберите изображение или видео из вашей галереи. Оптимальный формат файла — вертикальный (9:16), а длительность видео не должна превышать 15 секунд.<br/><br/>
                    Внимание: ваши Stories <b>не удаляются автоматически</b> спустя 24 часа. Чтобы убрать неактуальную историю, откройте её и нажмите на иконку "Удалить" в правом углу.
                  </div>
                </div>
              )}

              {activeModal === 'help_notifications' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F2F2F7] rounded-[16px] p-5 text-[15px] text-[#000000] leading-relaxed border border-[#E5E5EA]">
                    <b>Как получать уведомления о заявках?</b><br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 1.</span> Узнайте свой личный ID в Telegram. Для этого найдите в поиске бота <b>@userinfobot</b>, отправьте ему любое сообщение и скопируйте цифры из его ответа (ID).<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 2.</span> В админке перейдите в раздел «Уведомления» → «Куда получать заявки» и вставьте эти цифры.<br/><br/>
                    <span className="text-[#8E8E93] font-bold text-[#FF3B30]">Шаг 3 (Важно!).</span> Перейдите в нашего официального бота <b>@Ai_nur_platformbot</b> и нажмите кнопку «Запустить» (/start). Без этого бот технически не сможет отправлять вам сообщения о новых клиентах.
                  </div>
                </div>
              )}

              {activeModal === 'help_appearance' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F2F2F7] rounded-[16px] p-5 text-[15px] text-[#000000] leading-relaxed border border-[#E5E5EA]">
                    <b>Как изменить внешний вид виджета?</b><br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 1.</span> Перейдите в раздел «Виджет» → «Внешний вид и цвета».<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 2.</span> Нажмите на цветовой кружок и выберите цвет, который соответствует вашему бренду. Или введите точный HEX-код (например, #FF0000 для красного) в поле рядом.<br/><br/>
                    <span className="text-[#8E8E93] font-bold">Шаг 3.</span> Ниже выберите цвет текста на кнопках (Черный или Белый), чтобы он легко читался на выбранном фоне.<br/><br/>
                    <i>Все изменения применяются мгновенно. Вы можете посмотреть результат, нажав на кнопку «Прототип виджета».</i>
                  </div>
                </div>
              )}

              {/* ================= ОСТАЛЬНЫЕ НАСТРОЙКИ ================= */}

              {/* PAYWALL ИНТЕГРАЦИИ */}
              {activeModal === 'integration' && (
                <div className="flex flex-col gap-4">
                  {projectData?.is_paid ? (
                      <>
                        <p className="text-[15px] text-[#8E8E93] leading-relaxed">
                            Скопируйте этот код и вставьте его перед закрывающим тегом <code className="bg-[#F2F2F7] px-1 rounded">&lt;/body&gt;</code> на вашем сайте. Он содержит ваш уникальный ID, поэтому виджет сразу начнет работать!
                        </p>
                        <div className="relative">
                            <pre className="w-full bg-[#F2F2F7] p-4 rounded-[16px] text-[13px] text-[#000000] overflow-x-auto border border-[#E5E5EA] whitespace-pre-wrap word-break">
                            {getEmbedCode()}
                            </pre>
                        </div>
                        <button 
                            onClick={copyToClipboard}
                            className={`h-[50px] w-full rounded-[12px] font-semibold text-[16px] flex items-center justify-center gap-2 active:scale-95 transition-all ${isCopied ? 'bg-[#8BFDA8] text-[#000000]' : 'bg-[#000000] text-[#FFFFFF]'}`}
                        >
                            {isCopied ? <Check size={20} /> : <Copy size={20} />}
                            {isCopied ? 'Скопировано!' : 'Скопировать код'}
                        </button>
                      </>
                  ) : (
                      <div className="bg-[#F2F2F7] rounded-[22px] p-8 flex flex-col items-center justify-center text-center mt-4">
                          <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#E5E5EA]">
                              <Lock size={28} className="text-[#FF3B30]" strokeWidth={1.5}/>
                          </div>
                          <h3 className="text-[20px] font-bold text-[#000000] mb-2">Код скрыт</h3>
                          <p className="text-[15px] text-[#8E8E93] mb-6 max-w-[280px]">
                              Чтобы установить виджет на свой боевой сайт, необходимо активировать подписку. Пока вы можете тестировать его в Прототипе.
                          </p>
                          <button 
                            onClick={() => setActiveModal('plans')} 
                            className="h-[50px] px-8 rounded-[12px] bg-[#8BFDA8] text-[#000000] font-semibold text-[16px] active:scale-95 transition-transform"
                          >
                            Выбрать тариф
                          </button>
                      </div>
                  )}
                </div>
              )}

              {activeModal === 'company' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Название компании</label>
                    <input className="input-ios border border-[#E5E5EA] text-[16px] h-[50px] px-4 rounded-[14px] w-full outline-none" value={editForm.company_name} onChange={e => setEditForm({...editForm, company_name: e.target.value})} placeholder="AI NUR" />
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
                <div className="flex flex-col gap-6 h-full">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Роль ассистента (Промпт)</label>
                    <textarea 
                      className="w-full h-full min-h-[250px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] p-4 text-[16px] outline-none resize-none focus:border-[#8BFDA8]" 
                      value={editForm.system_prompt} 
                      onChange={e => setEditForm({...editForm, system_prompt: e.target.value})} 
                      placeholder="Опишите, как ИИ должен общаться..." 
                    />
                  </div>
                </div>
              )}

              {activeModal === 'knowledge' && (
                <div className="flex flex-col gap-2 h-full">
                  <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">База знаний</label>
                  <textarea className="w-full h-[300px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] p-4 text-[16px] outline-none resize-none focus:border-[#8BFDA8]" value={editForm.knowledge_base} onChange={e => setEditForm({...editForm, knowledge_base: e.target.value})} placeholder="Вставьте сюда текст о вашей компании, услугах, частые вопросы..." />
                </div>
              )}

              {activeModal === 'appearance' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Главный цвет бренда (Фон)</label>
                    <div className="flex items-center gap-4 bg-[#F5F5F7] p-4 rounded-[14px] border border-[#E5E5EA]">
                      
                      <div className="w-10 h-10 rounded-full border border-[#E5E5EA] overflow-hidden shrink-0 shadow-sm relative">
                        <input type="color" className="absolute top-[-5px] left-[-5px] w-[50px] h-[50px] cursor-pointer" value={editForm.theme_color} onChange={e => handleColorChange(e.target.value)} />
                      </div>
                      
                      <input 
                        type="text" 
                        value={editForm.theme_color} 
                        onChange={e => handleColorChange(e.target.value)}
                        className="flex-1 bg-[#FFFFFF] border border-[#E5E5EA] rounded-[10px] px-3 py-2 text-[15px] font-mono font-bold uppercase tracking-wider outline-none focus:border-[#8BFDA8] transition-colors"
                        placeholder="#8BFDA8"
                        maxLength={7}
                      />

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

              {activeModal === 'notifications' && (
                <div className="flex flex-col gap-6">
                  <div className="bg-[#F2F2F7] rounded-[16px] p-5 text-[14px] text-[#000000] leading-relaxed border border-[#E5E5EA]">
                    <b>Как получать заявки в Telegram?</b><br/><br/>
                    <span className="text-[#8E8E93] font-medium">Шаг 1.</span> Узнайте свой личный ID. Для этого напишите боту <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-[#007AFF] font-medium hover:underline">@userinfobot</a> и скопируйте цифры из ответа.<br/><br/>
                    <span className="text-[#8E8E93] font-medium">Шаг 2.</span> Вставьте эти цифры в поле ниже и сохраните настройки.<br/><br/>
                    <span className="text-[#8E8E93] font-medium">Шаг 3.</span> <b>Обязательно</b> перейдите в нашего бота <a href="https://t.me/Ai_nur_platformbot" target="_blank" rel="noopener noreferrer" className="text-[#007AFF] font-medium hover:underline">@Ai_nur_platformbot</a> и нажмите кнопку <b>«Запустить» (/start)</b>. Без этого шага бот не сможет присылать вам заявки!
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase flex items-center gap-2">
                      <Send size={16} /> Ваш Telegram Chat ID
                    </label>
                    <input 
                      type="text" 
                      className="input-ios border border-[#E5E5EA] text-[16px] h-[50px] px-4 rounded-[14px] w-full outline-none focus:border-[#8BFDA8] transition-colors" 
                      placeholder="Например: 123456789" 
                      value={editForm.notify_telegram || ''} 
                      onChange={e => setEditForm({...editForm, notify_telegram: e.target.value})} 
                    />
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
                    <textarea className="input-ios border border-[#E5E5EA] resize-none text-[16px] p-3 rounded-[14px]" rows={2} placeholder="Город, улица, дом..." value={editForm.address} onChange={e => setEditForm({...editForm, address: e.target.value})} />
                  </div>
                </div>
              )}

              {activeModal === 'email' && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Текущий Email</label>
                    <input className="input-ios border border-[#E5E5EA] bg-[#F2F2F7] text-[#8E8E93] text-[16px] h-[50px] px-4 rounded-[14px] w-full outline-none" value={userEmail} disabled />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-semibold text-[#8E8E93] uppercase">Новый Email</label>
                    <input type="email" className="input-ios border border-[#E5E5EA] text-[16px] h-[50px] px-4 rounded-[14px] w-full outline-none" placeholder="Введите новый адрес" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
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
                    <input type="password" className="input-ios border border-[#E5E5EA] text-[16px] h-[50px] px-4 rounded-[14px] w-full outline-none" placeholder="Минимум 6 символов" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </div>
                  <button onClick={handleUpdatePassword} disabled={isSaving || !newPassword} className="h-[50px] w-full bg-[#000000] text-[#FFFFFF] rounded-[12px] font-semibold text-[16px] disabled:opacity-50 mt-4 active:scale-95 transition-transform">
                    {isSaving ? 'Сохранение...' : 'Изменить пароль'}
                  </button>
                </div>
              )}

              {/* ТАРИФЫ И ОПЛАТА */}
              {activeModal === 'plans' && (
                <div className="flex flex-col gap-6">
                  
                  {selectedPlan ? (
                      <div className="flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-300">
                          <div className="bg-[#F2F2F7] rounded-[22px] p-6 w-full mb-6 border border-[#E5E5EA]">
                              <div className="text-[14px] text-[#8E8E93] uppercase font-bold tracking-wider mb-2">К оплате</div>
                              <div className="text-[32px] font-black text-[#000000]">{selectedPlan.price} ₸</div>
                              <div className="text-[15px] font-medium text-[#000000] mt-1">Тариф "{selectedPlan.name}" ({isYearly ? 'Год' : 'Месяц'})</div>
                          </div>

                          <div className="w-16 h-16 bg-[#FF3B30]/10 rounded-full flex items-center justify-center mb-4 text-[#FF3B30]">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                          </div>
                          
                          <h3 className="text-[20px] font-bold text-[#000000] mb-2">Оплата через Kaspi</h3>
                          <p className="text-[15px] text-[#8E8E93] mb-6">
                              Сделайте перевод на сумму <b>{selectedPlan.price} ₸</b> по номеру ниже, на имя Нұрбол Ә. В сообщении к переводу укажите ваш Email.
                          </p>

                          <div className="bg-[#F9F9F9] border border-[#E5E5EA] w-full p-4 rounded-[14px] flex items-center justify-between mb-6">
                              <span className="font-mono text-[18px] font-bold text-[#000000]">+7 (707) 717-58-18</span>
                              <button 
                                onClick={() => navigator.clipboard.writeText('+77771234567')}
                                className="text-[#8BFDA8] bg-[#000000] px-4 py-2 rounded-[8px] text-[13px] font-bold active:scale-95 transition-transform"
                              >
                                Копировать
                              </button>
                          </div>

                          <p className="text-[14px] text-[#8E8E93] mb-4">После перевода отправьте чек нам в WhatsApp для быстрой активации.</p>

                          <a href="https://wa.me/77077175818" target="_blank" className="w-full bg-[#25D366] text-[#FFFFFF] font-semibold text-[16px] h-[50px] rounded-[12px] flex items-center justify-center gap-2 active:scale-95 transition-transform mb-4">
                              Написать в WhatsApp
                          </a>
                          
                          <button onClick={() => setSelectedPlan(null)} className="text-[#8E8E93] font-medium text-[15px]">Вернуться к тарифам</button>
                      </div>
                  ) : (
                      <>
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
                                <button 
                                    onClick={() => setSelectedPlan(plan)}
                                    className="w-full h-[44px] rounded-[12px] bg-[#000000] text-[#FFFFFF] font-semibold text-[14px] active:scale-95 transition-transform"
                                >
                                    Выбрать тариф
                                </button>
                              </div>
                            ))}
                          </div>
                      </>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}