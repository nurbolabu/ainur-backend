'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  ShieldAlert, Users, CreditCard, Search, Loader2, Check, X, 
  ExternalLink, Copy, Box, LayoutList, PlaySquare, MessageSquare, Bot, Database
} from 'lucide-react';

// Укажите здесь почту главного администратора
const SUPER_ADMIN_EMAIL = 'ainurcorp@gmail.com';

export default function SuperAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Состояния для детального просмотра
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [projectStats, setProjectStats] = useState({ products: 0, leads: 0, stories: 0, messages: 0 });
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  async function checkAccessAndFetch() {
    setIsLoading(true);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user || user.email !== SUPER_ADMIN_EMAIL) {
      router.push('/admin'); 
      return;
    }

    setIsAuthorized(true);
    await fetchProjects();
  }

  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      alert('Ошибка загрузки: ' + error.message);
    } else if (data) {
      setProjects(data);
    }
    setIsLoading(false);
  }

  async function togglePaidStatus(id: string, currentStatus: boolean, e: React.MouseEvent) {
    e.stopPropagation(); // Чтобы клик по кнопке не открывал карточку проекта
    const newStatus = !currentStatus;
    
    setProjects(projects.map(p => p.id === id ? { ...p, is_paid: newStatus } : p));

    const { error } = await supabase
      .from('projects')
      .update({ is_paid: newStatus })
      .eq('id', id);

    if (error) {
      alert('Ошибка при обновлении: ' + error.message);
      fetchProjects(); 
    }
  }

  // Загрузка статистики при открытии карточки клиента
  async function openProjectDetails(project: any) {
    setSelectedProject(project);
    setIsStatsLoading(true);

    try {
      // Параллельно запрашиваем количество записей из связанных таблиц
      const [prodRes, leadsRes, storiesRes, msgRes] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('project_id', project.id),
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('project_id', project.id),
        supabase.from('stories').select('*', { count: 'exact', head: true }).eq('project_id', project.id),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('project_id', project.id)
      ]);

      setProjectStats({
        products: prodRes.count || 0,
        leads: leadsRes.count || 0,
        stories: storiesRes.count || 0,
        messages: msgRes.count || 0
      });
    } catch (error) {
      console.error("Ошибка загрузки статистики:", error);
    }
    setIsStatsLoading(false);
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#8E8E93]" size={40} />
      </div>
    );
  }

  const filteredProjects = projects.filter(p => 
    p.company_name?.toLowerCase().includes(search.toLowerCase()) || 
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers = projects.length;
  const paidUsers = projects.filter(p => p.is_paid).length;

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans pb-20">
      
      {/* HEADER */}
      <div className="bg-[#000000] text-[#FFFFFF] pt-12 pb-6 px-6 rounded-b-[32px] shadow-lg relative z-10">
        <div className="max-w-[800px] mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-[#8BFDA8]" size={28} />
              <h1 className="text-[24px] font-bold">Super Admin</h1>
            </div>
            <Link href="/admin" className="text-[14px] font-semibold text-[#8E8E93] hover:text-[#FFFFFF] transition-colors">
              Вернуться в админку
            </Link>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#1C1C1E] rounded-[20px] p-4 flex-1 border border-[#3A3A3C]">
              <div className="flex items-center gap-2 text-[#8E8E93] mb-1">
                <Users size={16} /> <span className="text-[13px] uppercase font-bold tracking-wider">Всего клиентов</span>
              </div>
              <div className="text-[32px] font-black text-[#FFFFFF]">{totalUsers}</div>
            </div>
            <div className="bg-[#1C1C1E] rounded-[20px] p-4 flex-1 border border-[#8BFDA8]/30">
              <div className="flex items-center gap-2 text-[#8BFDA8] mb-1">
                <CreditCard size={16} /> <span className="text-[13px] uppercase font-bold tracking-wider">PRO подписки</span>
              </div>
              <div className="text-[32px] font-black text-[#FFFFFF]">{paidUsers}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 mt-6 flex flex-col gap-4">
        
        {/* ПОИСК */}
        <div className="bg-[#FFFFFF] h-[50px] rounded-[16px] flex items-center px-4 gap-3 border border-[#E5E5EA] shadow-sm">
          <Search size={20} className="text-[#8E8E93]" />
          <input 
            type="text" 
            placeholder="Поиск по компании или email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[16px] outline-none text-[#000000]"
          />
        </div>

        {/* СПИСОК ПОЛЬЗОВАТЕЛЕЙ */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[#8E8E93]" size={40} />
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-2">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => openProjectDetails(project)}
                className="bg-[#FFFFFF] p-5 rounded-[22px] border border-[#E5E5EA] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all hover:border-[#8BFDA8] cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-start md:items-center gap-4">
                  <div className="w-12 h-12 rounded-[12px] bg-[#F2F2F7] flex items-center justify-center text-[18px] font-black text-[#000000] shrink-0 border border-[#E5E5EA]">
                    {project.company_name?.substring(0, 1).toUpperCase() || '?'}
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-[18px] font-bold text-[#000000] leading-tight">
                      {project.company_name || 'Без названия'}
                    </span>
                    <span className="text-[14px] text-[#8E8E93] font-medium mt-0.5">
                      {project.email || 'Email не указан'}
                    </span>
                    <span className="text-[11px] text-[#C6C6C8] font-semibold uppercase tracking-wider mt-1">
                      Создан: {new Date(project.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>

                {/* КНОПКА УПРАВЛЕНИЯ ТАРИФОМ */}
                <button 
                  onClick={(e) => togglePaidStatus(project.id, project.is_paid, e)}
                  className={`h-[44px] px-6 rounded-[14px] font-bold text-[14px] flex items-center gap-2 active:scale-95 transition-all shrink-0 ${
                    project.is_paid 
                      ? 'bg-[#8BFDA8] text-[#000000] shadow-[0_4px_14px_rgba(139,253,168,0.3)]' 
                      : 'bg-[#F2F2F7] text-[#8E8E93] hover:bg-[#E5E5EA]'
                  }`}
                >
                  {project.is_paid ? (
                    <><Check size={18} strokeWidth={2.5}/> PRO АКТИВЕН</>
                  ) : (
                    <><X size={18} strokeWidth={2.5}/> БАЗОВЫЙ</>
                  )}
                </button>
              </div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="text-center text-[#8E8E93] py-10 font-medium">
                Пользователи не найдены
              </div>
            )}
          </div>
        )}
      </div>

      {/* === МОДАЛЬНОЕ ОКНО "ДЕТАЛИ КЛИЕНТА" === */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#F2F2F7] w-full max-w-[700px] h-full max-h-[85dvh] rounded-[24px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
            
            {/* Хедер модалки */}
            <div className="h-[70px] bg-[#FFFFFF] flex items-center justify-between px-4 border-b border-[#E5E5EA] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#F2F2F7] flex items-center justify-center text-[16px] font-black border border-[#E5E5EA]">
                    {selectedProject.company_name?.substring(0, 1).toUpperCase() || '?'}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[16px] text-[#000000] leading-tight">{selectedProject.company_name}</span>
                  <span className="text-[12px] font-medium text-[#8E8E93] leading-tight">{selectedProject.email}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProject(null)} 
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#F2F2F7] rounded-[12px] text-[#000000] active:scale-95 transition-transform"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Скроллируемый контент */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
              
              {/* Статистика */}
              <div>
                <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3">Статистика проекта</h3>
                {isStatsLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="animate-spin text-[#8E8E93]" size={28} /></div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#FFFFFF] p-4 rounded-[16px] border border-[#E5E5EA] shadow-sm flex flex-col items-center justify-center gap-1">
                      <Box className="text-[#FF9500]" size={24} strokeWidth={1.5} />
                      <span className="text-[20px] font-black text-[#000000]">{projectStats.products}</span>
                      <span className="text-[11px] font-bold text-[#8E8E93] uppercase">Товаров</span>
                    </div>
                    <div className="bg-[#FFFFFF] p-4 rounded-[16px] border border-[#E5E5EA] shadow-sm flex flex-col items-center justify-center gap-1">
                      <LayoutList className="text-[#34C759]" size={24} strokeWidth={1.5} />
                      <span className="text-[20px] font-black text-[#000000]">{projectStats.leads}</span>
                      <span className="text-[11px] font-bold text-[#8E8E93] uppercase">Заявок</span>
                    </div>
                    <div className="bg-[#FFFFFF] p-4 rounded-[16px] border border-[#E5E5EA] shadow-sm flex flex-col items-center justify-center gap-1">
                      <PlaySquare className="text-[#FF2D55]" size={24} strokeWidth={1.5} />
                      <span className="text-[20px] font-black text-[#000000]">{projectStats.stories}</span>
                      <span className="text-[11px] font-bold text-[#8E8E93] uppercase">Сторис</span>
                    </div>
                    <div className="bg-[#FFFFFF] p-4 rounded-[16px] border border-[#E5E5EA] shadow-sm flex flex-col items-center justify-center gap-1">
                      <MessageSquare className="text-[#007AFF]" size={24} strokeWidth={1.5} />
                      <span className="text-[20px] font-black text-[#000000]">{projectStats.messages}</span>
                      <span className="text-[11px] font-bold text-[#8E8E93] uppercase">Сообщений ИИ</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ссылки и Интеграция */}
              <div>
                <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3">Интеграция</h3>
                <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] shadow-sm overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-[#E5E5EA]">
                    <div className="flex flex-col max-w-[70%]">
                      <span className="text-[12px] text-[#8E8E93] font-bold uppercase">Project ID</span>
                      <span className="text-[14px] font-mono text-[#000000] truncate">{selectedProject.id}</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(selectedProject.id)}
                      className="bg-[#F2F2F7] px-4 py-2 rounded-[10px] text-[13px] font-bold active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      {isCopied ? <Check size={16}/> : <Copy size={16}/>}
                      {isCopied ? 'ОК' : 'Копия'}
                    </button>
                  </div>
                  
                  <a href={`/widget.html?id=${selectedProject.id}`} target="_blank" className="flex items-center justify-between p-4 bg-[#FAFAFA] hover:bg-[#F2F2F7] transition-colors cursor-pointer text-decoration-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[#000000] text-[#FFFFFF] flex items-center justify-center"><ExternalLink size={16} /></div>
                      <span className="text-[15px] font-bold text-[#000000]">Открыть боевой прототип виджета</span>
                    </div>
                    <ChevronRight size={20} className="text-[#C6C6C8]" />
                  </a>
                </div>
              </div>

              {/* Мозг ИИ */}
              <div>
                <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3">Настройки ИИ</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-[#8E8E93] uppercase flex items-center gap-1.5"><Bot size={14}/> Системный промпт (Роль)</label>
                    <textarea 
                      readOnly 
                      className="w-full h-[120px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] p-4 text-[14px] text-[#000000] resize-none outline-none shadow-sm" 
                      value={selectedProject.system_prompt || 'Промпт не задан'} 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-[#8E8E93] uppercase flex items-center gap-1.5"><Database size={14}/> База знаний</label>
                    <textarea 
                      readOnly 
                      className="w-full h-[150px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] p-4 text-[14px] text-[#000000] resize-none outline-none shadow-sm" 
                      value={selectedProject.knowledge_base || 'База знаний пуста'} 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}