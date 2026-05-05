'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Send, User, Bot, UserCircle } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function ChatsPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Инициализация и загрузка списка чатов
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

  // 3. WebSockets: Слушаем новые сообщения в реальном времени
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase.channel('admin-realtime-chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `project_id=eq.${projectId}` }, (payload) => {
        const newMsg = payload.new;
        
        // Обновляем список чатов слева (чтобы чат прыгнул наверх)
        fetchConversations(projectId);
        
        // Если открыт именно этот чат, добавляем сообщение на экран
        setActiveConv((currentActiveConv) => {
           if (currentActiveConv === newMsg.conversation_id) {
              setMessages((prev) => [...prev, newMsg]);
           }
           return currentActiveConv;
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  // Получаем список уникальных диалогов
  async function fetchConversations(id: string) {
    const { data } = await supabase
      .from('messages')
      .select('conversation_id, content, created_at, role')
      .eq('project_id', id)
      .order('created_at', { ascending: false });

    // Группируем по ID (оставляем только самое последнее сообщение для превью)
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
             role: msg.role
          });
        }
      }
    }
    setConversations(convos);
    setIsLoading(false);
  }

  // Загружаем историю конкретного диалога
  async function openConversation(convId: string) {
    setActiveConv(convId);
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', convId)
      .order('created_at', { ascending: true });
      
    if (data) setMessages(data);
  }

  // Отправка сообщения менеджером
  async function sendMessage() {
    if (!inputText.trim() || !activeConv || !projectId) return;
    
    const text = inputText.trim();
    setInputText(''); // Очищаем поле ввода сразу для отзывчивости

    const { error } = await supabase.from('messages').insert([{
      project_id: projectId,
      conversation_id: activeConv,
      role: 'manager',
      content: text
    }]);

    if (error) {
       console.error("Ошибка отправки:", error);
       alert("Не удалось отправить сообщение");
    }
  }

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-[calc(100vh-100px)] md:h-[600px] w-full px-1 md:px-0">
      <h1 className="ios-large-title shrink-0 hidden md:block">Чаты</h1>

      <div className="flex-1 flex w-full bg-[#FFFFFF] rounded-[24px] overflow-hidden border border-[#E5E5EA] shadow-sm min-h-0">
        
        {/* ЛЕВАЯ КОЛОНКА: СПИСОК ЧАТОВ */}
        <div className={`w-full md:w-[320px] flex flex-col border-r border-[#E5E5EA] bg-[#F9F9F9] ${activeConv ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-[#E5E5EA] bg-[#FFFFFF]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={16} />
              <input 
                className="w-full bg-[#F2F2F7] rounded-[10px] h-[36px] pl-9 pr-3 text-[15px] outline-none"
                placeholder="Поиск диалога..."
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
               <div className="text-center text-[#8E8E93] mt-10 text-[14px]">Загрузка...</div>
            ) : conversations.length === 0 ? (
               <div className="text-center text-[#8E8E93] mt-10 text-[14px]">Диалогов пока нет</div>
            ) : (
               conversations.map((conv) => (
                 <div 
                   key={conv.id} 
                   onClick={() => openConversation(conv.id)}
                   className={`p-4 border-b border-[#E5E5EA] cursor-pointer transition-colors ${activeConv === conv.id ? 'bg-[#E5E5EA]/50' : 'hover:bg-[#FFFFFF]'}`}
                 >
                   <div className="flex justify-between items-center mb-1">
                     <span className="font-semibold text-[15px] truncate pr-2">Клиент {conv.id.substring(0, 6)}...</span>
                     <span className="text-[12px] text-[#8E8E93] shrink-0">
                       {new Date(conv.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                     </span>
                   </div>
                   <div className="text-[14px] text-[#8E8E93] truncate flex items-center gap-1.5">
                     {conv.role === 'assistant' && <Bot size={12} />}
                     {conv.role === 'manager' && <UserCircle size={12} className="text-[#34C759]" />}
                     <span className="truncate">{conv.lastMessage}</span>
                   </div>
                 </div>
               ))
            )}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: ОКНО ЧАТА */}
        <div className={`flex-1 flex flex-col bg-[#FFFFFF] ${!activeConv ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Шапка чата */}
              <div className="h-[60px] border-b border-[#E5E5EA] flex items-center px-4 justify-between bg-[#F9F9F9] shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveConv(null)} className="md:hidden text-[#007AFF] font-medium text-[15px]">
                    Назад
                  </button>
                  <div className="w-8 h-8 rounded-full bg-[#E5E5EA] flex items-center justify-center text-[#8E8E93]">
                    <User size={16} />
                  </div>
                  <span className="font-semibold text-[16px]">Диалог {activeConv.substring(0, 6)}</span>
                </div>
              </div>

              {/* История сообщений */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#FFFFFF]">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  const isManager = msg.role === 'manager';
                  return (
                    <div key={idx} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}>
                       {!isUser && (
                         <span className="text-[11px] text-[#8E8E93] mb-1 ml-1">
                           {isManager ? 'Вы (Менеджер)' : 'ИИ Ассистент'}
                         </span>
                       )}
                       <div className={`px-4 py-2.5 rounded-[18px] text-[15px] leading-snug shadow-sm
                         ${isUser 
                           ? 'bg-[#F2F2F7] text-[#000000] rounded-br-[4px]' 
                           : isManager 
                             ? 'bg-[#8BFDA8] text-[#000000] rounded-bl-[4px]' 
                             : 'bg-[#000000] text-[#FFFFFF] rounded-bl-[4px]'}`}
                       >
                         {msg.content}
                       </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Поле ввода */}
              <div className="p-3 border-t border-[#E5E5EA] bg-[#F9F9F9] shrink-0">
                <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#E5E5EA] rounded-[20px] p-1.5 shadow-sm focus-within:border-[#8BFDA8] transition-colors">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Написать сообщение (ИИ будет отключен)..."
                    className="flex-1 bg-transparent px-3 text-[15px] outline-none"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={!inputText.trim()}
                    className="w-8 h-8 rounded-[14px] bg-[#8BFDA8] text-[#000000] flex items-center justify-center shrink-0 disabled:opacity-50 disabled:bg-[#E5E5EA] active:scale-95 transition-all"
                  >
                    <Send size={16} className="-ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#8E8E93]">
              <div className="w-16 h-16 rounded-full bg-[#F2F2F7] flex items-center justify-center mb-4">
                <Bot size={32} className="text-[#C6C6C8]" />
              </div>
              <p className="text-[16px] font-medium">Выберите чат для просмотра</p>
              <p className="text-[14px]">Здесь появятся диалоги клиентов с вашим ИИ</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}