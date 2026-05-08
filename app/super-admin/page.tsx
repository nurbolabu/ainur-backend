'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldAlert, Users, CreditCard, Search, Loader2, Check, X } from 'lucide-react';

// Укажите здесь почту главного администратора
const SUPER_ADMIN_EMAIL = 'ainurcorp@gmail.com';

export default function SuperAdminPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAccessAndFetch();
  }, []);

  async function checkAccessAndFetch() {
    setIsLoading(true);
    
    // 1. Проверяем текущего пользователя
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // 2. Блокируем доступ всем, кроме Супер Админа
    if (authError || !user || user.email !== SUPER_ADMIN_EMAIL) {
      router.push('/admin'); // Выкидываем обычных юзеров в их админку
      return;
    }

    // 3. Если проверка пройдена, разрешаем рендер и грузим данные
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

  async function togglePaidStatus(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    
    // Оптимистичное обновление
    setProjects(projects.map(p => p.id === id ? { ...p, is_paid: newStatus } : p));

    const { error } = await supabase
      .from('projects')
      .update({ is_paid: newStatus })
      .eq('id', id);

    if (error) {
      alert('Ошибка при обновлении: ' + error.message);
      fetchProjects(); // Откатываем назад при ошибке
    }
  }

  // Пока идет проверка прав, показываем лоадер на весь экран
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

          {/* СТАТИСТИКА */}
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
              <div key={project.id} className="bg-[#FFFFFF] p-5 rounded-[22px] border border-[#E5E5EA] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all hover:border-[#8BFDA8]/50">
                
                <div className="flex items-start md:items-center gap-4">
                  {/* Аватарка-заглушка */}
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
                  onClick={() => togglePaidStatus(project.id, project.is_paid)}
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

    </div>
  );
}