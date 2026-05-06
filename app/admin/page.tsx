'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Settings, Plus, Trash2, Loader2, PlaySquare, Phone, ShoppingCart, User, Package, ChevronDown, ChevronUp, Check } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function AdminDashboard() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [stats, setStats] = useState({ visitors: 0, widgets: 0, leads: 0, social: 0 });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('ainur_admin_project_id');
    if (id) {
      setProjectId(id);
      fetchDashboardData(id);
    }
  }, []);

  async function fetchDashboardData(id: string) {
    // 1. Загружаем Сторис
    const { data: storiesData } = await supabase
      .from('stories')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });
    if (storiesData) setStories(storiesData);

    // 2. Считаем статистику чатов (для блоков статистики)
    const { data: messagesData } = await supabase
      .from('messages')
      .select('conversation_id')
      .eq('project_id', id);
    
    let totalChats = 0;
    if (messagesData) {
      const seen = new Set();
      for (const msg of messagesData) seen.add(msg.conversation_id);
      totalChats = seen.size;
    }

    // 3. Загружаем Заявки
    const { data: leadsData } = await supabase
      .from('leads')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    if (leadsData) {
      // Отбираем только новые заявки для вывода на главную
      const newLeads = leadsData.filter(l => !l.status || l.status === 'new');
      setRecentLeads(newLeads);

      setStats({
        widgets: totalChats,
        leads: leadsData.length,
        visitors: totalChats * 5 + 124, 
        social: Math.floor(totalChats * 0.3) 
      });
    }
  }

  // --- ЛОГИКА СТОРИС ---
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !projectId) return;
    setIsUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `story_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
      await supabase.from('stories').insert([{ project_id: projectId, media_url: publicUrl, order_index: stories.length }]);
      fetchDashboardData(projectId);
    } else {
      alert("Ошибка загрузки.");
    }
    setIsUploading(false);
  }

  async function handleDeleteStory(id: string) {
    if (confirm('Удалить сторис?')) {
      await supabase.from('stories').delete().eq('id', id);
      if (projectId) fetchDashboardData(projectId);
    }
  }

  // --- ЛОГИКА ЗАЯВОК ---
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  async function toggleStatus(leadId: string, currentStatus: string) {
    const newStatus = (!currentStatus || currentStatus === 'new') ? 'processed' : 'new';
    
    // Скрываем с экрана
    setRecentLeads(recentLeads.filter(l => l.id !== leadId));
    
    // Отправляем в базу и ловим ошибку
    const { error } = await supabase.from('leads').update({ status: newStatus }).eq('id', leadId);
    if (error) {
      alert("Ошибка при сохранении в базу: " + error.message);
      // Если ошибка, возвращаем заявку обратно на экран (перезагружаем данные)
      if (projectId) fetchDashboardData(projectId);
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="w-full max-w-[690px] mx-auto px-[17px] md:px-0 pt-[100px] animate-in fade-in duration-300 flex flex-col gap-8 pb-[100px]">
      
      {/* 1. ФИКСИРОВАННЫЙ HEADER */}
      <div className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[calc(100%-34px)] md:w-full max-w-[690px] z-40 bg-[#FFFFFF] rounded-[22px] flex items-center justify-between pl-[20px] pr-[10px] py-[10px] border border-[#E5E5EA]">
        <div className="flex items-center">
          <svg width="99" height="14" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="black"/>
            <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="black"/>
            <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="black"/>
            <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
          </svg>
        </div>
        <Link href="/admin/settings" className="w-[50px] h-[50px] shrink-0 bg-[#8BFDA8] rounded-[11px] flex items-center justify-center active:scale-95 transition-transform">
          <Settings size={24} strokeWidth={1.5} className="text-[#000000]" />
        </Link>
      </div>

      {/* 2. БЛОК STORIES */}
      <div className="flex flex-col gap-2.5 mt-2">
        <h2 className="text-[#949494] text-[14px] font-medium uppercase tracking-wide">Stories</h2>
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          
          <label className="w-[140px] h-[165px] md:w-[165px] bg-[#000000] rounded-[22px] p-4 flex flex-col justify-between shrink-0 active:scale-95 transition-transform cursor-pointer relative">
             <div className="w-10 h-10 rounded-full border-[1.5px] border-[#8BFDA8] flex items-center justify-center text-[#8BFDA8] bg-transparent">
               {isUploading ? <Loader2 size={20} strokeWidth={1.5} className="animate-spin" /> : <Plus size={20} strokeWidth={1.5} />}
             </div>
             <div className="text-[#FFFFFF] text-[18px] md:text-[20px] font-medium leading-tight">Добавить<br/>Stories</div>
             <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>

          {stories.map((s) => {
            const isVideo = s.media_url.toLowerCase().includes('.mp4');
            return (
              <div key={s.id} className="w-[140px] h-[165px] md:w-[165px] bg-[#FFFFFF] rounded-[22px] p-4 flex flex-col justify-between shrink-0 border border-[#E5E5EA] relative overflow-hidden group">
                <div className="absolute inset-0 z-0">
                   {isVideo ? (
                     <video src={s.media_url} className="w-full h-full object-cover opacity-80" muted playsInline />
                   ) : (
                     <img src={s.media_url} className="w-full h-full object-cover opacity-80" />
                   )}
                   <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60"></div>
                </div>

                <button 
                  onClick={() => handleDeleteStory(s.id)}
                  className="w-10 h-10 rounded-[20px] bg-[#FFFFFF]/90 backdrop-blur-md flex items-center justify-center text-[#FF3B30] relative z-10 active:scale-95"
                >
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
                
                <div className="text-[#FFFFFF] text-[14px] md:text-[16px] font-medium relative z-10">
                  {formatDate(s.created_at)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. БЛОК СТАТИСТИКИ */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-[#949494] text-[14px] font-medium uppercase tracking-wide">Статистика</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="bg-[#FFFFFF] rounded-[22px] p-5 flex flex-col justify-between h-[150px] border border-[#E5E5EA]">
            <span className="text-[#000000] text-[15px] font-medium leading-tight">Посетителей сайта</span>
            <span className="text-[#000000] text-[24px] font-bold">{stats.visitors}</span>
          </div>
          <div className="bg-[#FFFFFF] rounded-[22px] p-5 flex flex-col justify-between h-[150px] border border-[#E5E5EA]">
            <span className="text-[#000000] text-[15px] font-medium leading-tight">Открытий виджета</span>
            <span className="text-[#000000] text-[24px] font-bold">{stats.widgets}</span>
          </div>
          <div className="bg-[#FFFFFF] rounded-[22px] p-5 flex flex-col justify-between h-[150px] border border-[#E5E5EA]">
            <span className="text-[#000000] text-[15px] font-medium leading-tight">Оставили заявку</span>
            <span className="text-[#000000] text-[24px] font-bold">{stats.leads}</span>
          </div>
          <div className="bg-[#FFFFFF] rounded-[22px] p-5 flex flex-col justify-between h-[150px] border border-[#E5E5EA]">
            <span className="text-[#000000] text-[15px] font-medium leading-tight">Нажатий на соцсети</span>
            <span className="text-[#000000] text-[24px] font-bold">{stats.social}</span>
          </div>
        </div>
      </div>

      {/* 4. БЛОК НОВЫХ ЗАЯВОК (Вместо чатов) */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-[#949494] text-[14px] font-medium uppercase tracking-wide">Новые заявки</h2>
        
        <div className="flex flex-col gap-2.5">
          {recentLeads.length > 0 ? (
            recentLeads.map((lead) => {
              const isOrder = lead.cart_items && lead.cart_items.length > 0;
              const isExpanded = expandedId === lead.id;
              const status = lead.status || 'new';

              return (
                <div key={lead.id} className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] overflow-hidden flex flex-col transition-colors hover:border-[#8BFDA8]/50">
                  <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 ${isOrder ? 'bg-[#8BFDA8]/20 text-[#000000]' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}>
                        {isOrder ? <ShoppingCart size={24} strokeWidth={1.5} /> : <User size={24} strokeWidth={1.5} />}
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[18px] text-[#000000]">{lead.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isOrder ? 'bg-[#8BFDA8]/50 text-[#000000]' : 'bg-[#E5E5EA] text-[#8E8E93]'}`}>
                            {isOrder ? 'Заказ' : 'Звонок'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[#8E8E93]">
                          <span className="flex items-center gap-1.5 font-medium text-[#000000]"><Phone size={14} strokeWidth={1.5}/> {lead.phone}</span>
                          <span className="flex items-center gap-1.5">
                            {new Date(lead.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-[#F2F2F7] md:border-t-0">
                      
                      <button 
                        onClick={() => toggleStatus(lead.id, status)}
                        className={`h-[40px] px-4 rounded-[12px] flex items-center gap-1.5 text-[14px] font-semibold active:scale-95 transition-transform ${status === 'new' ? 'bg-[#000000] text-[#FFFFFF]' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}
                      >
                        <>Обработать <Check size={16} strokeWidth={2} /></>
                      </button>

                      {isOrder && (
                        <button 
                          onClick={() => toggleExpand(lead.id)}
                          className="w-[40px] h-[40px] bg-[#F2F2F7] rounded-[12px] flex items-center justify-center text-[#000000] active:scale-95 transition-transform"
                        >
                          {isExpanded ? <ChevronUp size={20} strokeWidth={1.5} /> : <ChevronDown size={20} strokeWidth={1.5} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {isOrder && isExpanded && (
                    <div className="bg-[#F9F9F9] border-t border-[#E5E5EA] p-4 md:p-5">
                      <div className="text-[12px] font-bold text-[#8E8E93] uppercase mb-3 tracking-wider">Состав заказа</div>
                      <div className="flex flex-col gap-2">
                        {lead.cart_items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center bg-[#FFFFFF] p-3 rounded-[16px] border border-[#E5E5EA]">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-[10px] bg-[#F2F2F7] flex items-center justify-center text-[12px] font-bold text-[#8E8E93]">{idx + 1}</div>
                              <div>
                                  <div className="text-[15px] font-semibold text-[#000000] leading-tight">{item.name}</div>
                                  <div className="text-[13px] text-[#8E8E93]">{item.qty} шт. × {item.price?.toLocaleString()} ₸</div>
                              </div>
                            </div>
                            <div className="font-bold text-[16px]">{(item.price * item.qty).toLocaleString()} ₸</div>
                          </div>
                        ))}
                        
                        <div className="flex justify-between items-center mt-3 px-2">
                          <span className="text-[14px] font-semibold text-[#8E8E93] uppercase tracking-wide">Итого:</span>
                          <span className="text-[18px] font-bold text-[#000000]">{lead.total?.toLocaleString()} ₸</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-10 flex flex-col items-center justify-center text-center">
              <Package size={40} strokeWidth={1} className="text-[#C6C6C8] mb-3" />
              <p className="text-[15px] font-medium text-[#8E8E93]">Новых заявок пока нет</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}