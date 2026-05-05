'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ChatsPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Инициализация
  useEffect(() => {
    const id = localStorage.getItem('ainur_admin_project_id');
    if (id) {
      setProjectId(id);
      fetchConversations(id);
    }
  }, []);

  // 2. Авто-скролл вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. WebSockets (подписка на новые сообщения в реальном времени)
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase.channel('admin-chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` }, (payload) => {
        const newMsg = payload.new;
        fetchConversations(projectId); // Обновляем список чатов слева
        
        setActiveChatId((currentActiveId) => {
           if (currentActiveId === newMsg.conversation_id) {
              setMessages((prev) => [...prev, newMsg]); // Добавляем сообщение, если чат открыт
           }
           return currentActiveId;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  // Загрузка уникальных диалогов для левой колонки
  async function fetchConversations(id: string) {
    const { data } = await supabase
      .from('messages')
      .select('conversation_id, content, created_at, role')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    const convos: any[] = [];
    const seen = new Set();
    
    if (data) {
      for (const msg of data) {
        if (!seen.has(msg.conversation_id)) {
          seen.add(msg.conversation_id);
          convos.push({
             id: msg.conversation_id,
             lastMessage: msg.content,
             date: msg.created_at,
          });
        }
      }
    }
    setConversations(convos);
    setIsLoading(false);
  }

  // Загрузка переписки при клике на чат
  async function openConversation(convId: string) {
    setActiveChatId(convId);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
      
    if (data) setMessages(data);
  }

  // Отправка сообщения менеджером
  async function sendMessage() {
    if (!inputText.trim() || !activeChatId || !projectId) return;
    
    const text = inputText.trim();
    setInputText(''); 

    await supabase.from('messages').insert([{
      project_id: projectId,
      conversation_id: activeChatId,
      role: 'manager',
      content: text
    }]);
  }

  // Форматирование времени
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100vh-120px)] md:h-[650px] w-full">
      
      {/* Контейнер 900px, скругление 24px, без теней */}
      <div className="ios-module flex-1 flex flex-col md:flex-row mb-0 overflow-hidden">
        
        {/* ЛЕВАЯ КОЛОНКА (300px) */}
        <div className={`w-full md:w-[300px] border-r border-[#E5E5EA] flex flex-col bg-[#FFFFFF] ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 pb-4 border-b border-[#E5E5EA]">
            <h1 className="ios-title-2 mb-0">Чаты</h1>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
               <div className="p-6 text-center text-[#8E8E93] text-[15px]">Загрузка...</div>
            ) : conversations.length === 0 ? (
               <div className="p-6 text-center text-[#8E8E93] text-[15px]">Диалогов пока нет</div>
            ) : (
              conversations.map((dialog) => (
                <button key={dialog.id} onClick={() => openConversation(dialog.id)} 
                  className={`w-full flex flex-col p-4 border-b border-[#E5E5EA] transition-colors cursor-pointer ${activeChatId === dialog.id ? 'bg-[#F5F5F7]' : 'bg-[#FFFFFF]'}`}>
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="font-semibold text-[17px] text-[#000000]">Клиент #{dialog.id.substring(0, 4)}</span>
                    <span className="text-[14px] text-[#8E8E93]">{formatTime(dialog.date)}</span>
                  </div>
                  <span className="text-[15px] text-[#8E8E93] truncate w-full text-left">{dialog.lastMessage}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className={`flex-1 flex flex-col bg-[#FFFFFF] relative ${!activeChatId ? 'hidden md:flex' : 'flex'}`}>
          {activeChatId ? (
            <>
              {/* Шапка чата */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5EA] bg-[#FFFFFF]/90 backdrop-blur-md z-10">
                <button onClick={() => setActiveChatId(null)} className="md:hidden text-[#8E8E93] font-medium text-[17px]">Назад</button>
                <div className="font-semibold text-[17px] text-[#000000]">Диалог #{activeChatId.substring(0, 4)}</div>
                <div className="w-12 md:w-0"></div>
              </div>
              
              {/* Баблы (Сообщения) */}
              <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
                {messages.map((msg, i) => {
                  const isClient = msg.role === 'user';
                  const isManager = msg.role === 'manager';
                  const isAi = msg.role === 'assistant';

                  return (
                    <div key={i} className={`flex w-full flex-col ${isClient ? 'items-start' : 'items-end'}`}>
                      {/* Подпись роли для наших сообщений (справа) */}
                      {!isClient && (
                         <span className="text-[11px] text-[#8E8E93] mb-1 mr-1">
                           {isManager ? 'Вы (Менеджер)' : 'ИИ Ассистент'}
                         </span>
                      )}
                      
                      <div className={`max-w-[75%] px-4 py-2.5 text-[17px] leading-snug rounded-[20px] shadow-sm ${
                        isClient ? 'bg-[#F5F5F7] text-[#000000] rounded-bl-[4px]' : 
                        isManager ? 'bg-[#8BFDA8] text-[#000000] rounded-br-[4px]' : 
                        'bg-[#000000] text-[#FFFFFF] rounded-br-[4px]' // Дизайн для ИИ
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Поле ввода */}
              <div className="p-4 border-t border-[#E5E5EA] bg-[#FFFFFF]">
                <div className="flex items-center gap-3">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Написать сообщение (ИИ отключится)..."
                    className="flex-1 bg-[#F5F5F7] border border-[#E5E5EA] rounded-[16px] px-4 h-[44px] text-[17px] outline-none focus:border-[#8BFDA8] transition-colors font-sans"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!inputText.trim()}
                    className="w-[44px] h-[44px] rounded-[16px] bg-[#8BFDA8] flex items-center justify-center text-[#000000] disabled:opacity-50 active:scale-95 transition-transform shrink-0"
                  >
                    {/* SVG иконка отправки (вместо lucide-react) */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-[#8E8E93] text-[17px]">Выберите диалог</div>
          )}
        </div>

      </div>
    </div>
  );
}