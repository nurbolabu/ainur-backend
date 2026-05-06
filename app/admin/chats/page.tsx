'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronLeft, ShoppingBag, User } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ChatsPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = localStorage.getItem('ainur_admin_project_id');
    if (id) {
      setProjectId(id);
      fetchConversations(id);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!projectId) return;
    const channel = supabase.channel('admin-chats-monitor')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` }, (payload) => {
        fetchConversations(projectId);
        if (activeChatId === payload.new.conversation_id) {
           setMessages((prev) => [...prev, payload.new]);
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, activeChatId]);

  async function fetchConversations(id: string) {
    const { data } = await supabase
      .from('messages')
      .select('conversation_id, content, created_at')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    const convos: any[] = [];
    const seen = new Set();
    if (data) {
      for (const msg of data) {
        if (!seen.has(msg.conversation_id)) {
          seen.add(msg.conversation_id);
          convos.push({ id: msg.conversation_id, lastMessage: msg.content, date: msg.created_at });
        }
      }
    }
    setConversations(convos);
    setIsLoading(false);
  }

  async function openConversation(convId: string) {
    setActiveChatId(convId);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
    if (data) setMessages(data);
  }

  const formatTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-full md:h-[calc(100vh-80px)] w-full mx-auto overflow-hidden">
      
      {!activeChatId && <h1 className="ios-large-title px-1 md:hidden">Чаты</h1>}

      <div className={`flex-1 flex flex-row bg-[#FFFFFF] overflow-hidden 
        ${activeChatId 
          ? 'fixed inset-0 z-[100] h-[100dvh] w-full flex-col md:relative md:inset-auto md:h-full md:flex-row md:rounded-[24px] md:border md:border-[#E5E5EA]' 
          : 'ios-module mb-0 md:rounded-[24px] md:border md:border-[#E5E5EA]'
        }`}
      >
        
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className={`w-full md:w-[320px] border-r border-[#E5E5EA] flex flex-col bg-[#FFFFFF] shrink-0 ${activeChatId ? 'hidden md:flex' : 'flex h-full'}`}>
          <div className="p-4 border-b border-[#E5E5EA] hidden md:block bg-[#F9F9F9]">
            <span className="text-[17px] font-bold">Все диалоги</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">
            {isLoading ? (
               <div className="p-10 text-center text-[#8E8E93]">Загрузка...</div>
            ) : conversations.length === 0 ? (
               <div className="p-10 text-center text-[#8E8E93]">Диалогов пока нет</div>
            ) : (
              conversations.map((dialog) => (
                <button key={dialog.id} onClick={() => openConversation(dialog.id)} 
                  className={`w-full flex items-start gap-3 p-4 border-b border-[#F2F2F7] transition-all active:bg-[#F2F2F7] ${activeChatId === dialog.id ? 'bg-[#F2F2F7]' : 'bg-[#FFFFFF]'}`}>
                  <div className="w-12 h-12 rounded-full bg-[#E5E5EA] flex items-center justify-center shrink-0 text-[#8E8E93]">
                    <User size={24} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-[16px] text-[#000000]">Клиент {dialog.id.substring(0, 4)}</span>
                      <span className="text-[13px] text-[#8E8E93]">{formatTime(dialog.date)}</span>
                    </div>
                    <p className="text-[14px] text-[#8E8E93] line-clamp-2 leading-snug">{dialog.lastMessage}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА (Окно переписки) */}
        <div className={`flex-1 flex flex-col bg-[#FFFFFF] min-h-0 ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {activeChatId ? (
            <>
              {/* ХЕДЕР ЧАТА */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E5EA] bg-[#FFFFFF]/80 backdrop-blur-xl shrink-0 z-10">
                <button onClick={() => setActiveChatId(null)} className="flex items-center text-[#000000] transition-opacity active:opacity-50">
                  <ChevronLeft size={30} className="-ml-2" />
                  <span className="text-[17px] font-medium md:hidden">Чаты</span>
                </button>
                <div className="flex flex-col items-center">
                   <div className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center text-[#8E8E93] mb-0.5">
                     <User size={16} />
                   </div>
                   <span className="text-[11px] font-medium text-[#000000] uppercase tracking-tight">ID: {activeChatId.substring(0, 8)}</span>
                </div>
                <div className="w-12"></div>
              </div>
              
              {/* ЛЕНТА СООБЩЕНИЙ С ИСПРАВЛЕННЫМ СКРОЛЛОМ */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 bg-[#FFFFFF] scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
                {messages.map((msg, i) => {
                  const isClient = msg.role === 'user';
                  const isAi = msg.role === 'assistant';
                  const isLeadTicket = msg.content.includes('Имя:') && msg.content.includes('Телефон:');

                  return (
                    <div key={i} className={`flex w-full flex-col ${isClient ? 'items-end' : 'items-start'} mb-1`}>
                      
                      {isLeadTicket ? (
                        <div className="w-full max-w-[280px] my-4 bg-[#F2F2F7] rounded-[20px] p-4 border border-[#E5E5EA] self-center shadow-sm">
                           <div className="flex items-center gap-2 mb-3 text-[#34C759]">
                              <ShoppingBag size={18} />
                              <span className="text-[12px] font-black uppercase tracking-wider">Новая заявка</span>
                           </div>
                           <div className="space-y-2">
                              {msg.content.split('\n').map((line: string, idx: number) => (
                                <div key={idx} className="text-[14px] text-[#000000]">
                                   {line.includes(':') ? (
                                     <><span className="text-[#8E8E93]">{line.split(':')[0]}:</span><span className="font-semibold">{line.split(':')[1]}</span></>
                                   ) : line}
                                </div>
                              ))}
                           </div>
                        </div>
                      ) : (
                        <div className={`max-w-[80%] px-4 py-2.5 text-[16px] leading-tight shadow-sm ${
                          isClient 
                            ? 'bg-[#8BFDA8] text-[#000000] rounded-[20px] rounded-tr-[4px]' 
                            : isAi 
                              ? 'bg-[#F2F2F7] text-[#000000] rounded-[20px] rounded-tl-[4px]' 
                              : 'bg-[#34C759] text-[#FFFFFF] rounded-[20px] rounded-tl-[4px]'
                        }`}>
                          {msg.content}
                        </div>
                      )}
                      
                      <span className="text-[10px] text-[#C6C6C8] mt-1 px-2">
                        {isAi ? 'ИИ • ' : ''} {formatTime(msg.created_at)}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} className="h-4 shrink-0" />
              </div>
              
              {/* Отступ для нижней части экрана на мобилках */}
              <div className="h-[env(safe-area-inset-bottom)] bg-white shrink-0" />
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-[#8E8E93] bg-[#F9F9F9] h-full">
                <div className="w-20 h-20 rounded-full bg-[#E5E5EA] flex items-center justify-center mb-4">
                  <User size={40} className="text-[#FFFFFF]" />
                </div>
                <p className="text-[17px] font-semibold text-[#000000]">Выберите диалог</p>
                <p className="text-[14px]">Выберите чат слева, чтобы просмотреть историю</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}