'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Phone, ShoppingCart, User, Package, ChevronDown, ChevronUp } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LeadsPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('ainur_admin_project_id');
    if (id) {
      setProjectId(id);
      fetchLeads(id);
    }
  }, []);

  async function fetchLeads(id: string) {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false });
    
    if (data) setLeads(data);
    setIsLoading(false);
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-in fade-in duration-300 px-1 md:px-0">
      <h1 className="ios-large-title">Заявки</h1>

      {isLoading ? (
        <div className="flex justify-center py-20 text-[#8E8E93]">Загрузка данных...</div>
      ) : leads.length === 0 ? (
        <div className="ios-module p-10 text-center text-[#8E8E93]">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>Заявок пока нет. Отправьте тестовую через виджет!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const isOrder = lead.cart_items && lead.cart_items.length > 0;
            const isExpanded = expandedId === lead.id;

            return (
              <div key={lead.id} className="ios-module overflow-hidden transition-all border border-transparent hover:border-[#8BFDA8]/30">
                {/* Основная часть карточки */}
                <div 
                  onClick={() => isOrder && toggleExpand(lead.id)}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isOrder ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isOrder ? 'bg-[#8BFDA8]/20 text-[#000000]' : 'bg-[#F2F2F7] text-[#8E8E93]'}`}>
                      {isOrder ? <ShoppingCart size={22} /> : <User size={22} />}
                    </div>
                    
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[18px] text-[#000000]">{lead.name}</h3>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${isOrder ? 'bg-[#8BFDA8] text-[#000000]' : 'bg-[#E5E5EA] text-[#8E8E93]'}`}>
                          {isOrder ? 'Заказ' : 'Звонок'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[#8E8E93]">
                        <span className="flex items-center gap-1.5 font-medium text-[#000000]"><Phone size={14} className="text-[#8E8E93]"/> {lead.phone}</span>
                        <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(lead.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isOrder ? (
                      <div className="text-right">
                        <div className="text-[11px] text-[#8E8E93] uppercase font-bold tracking-tight">Сумма заказа</div>
                        <div className="text-[19px] font-black text-[#000000]">{lead.total?.toLocaleString()} ₸</div>
                      </div>
                    ) : (
                      <div className="bg-[#F2F2F7] px-3 py-1.5 rounded-[10px] text-[13px] font-semibold text-[#8E8E93]">Ждет звонка</div>
                    )}
                    
                    {isOrder && (
                      <div className="text-[#C6C6C8]">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Выпадающий список товаров (только для заказов) */}
                {isOrder && isExpanded && (
                  <div className="bg-[#F9F9F9] border-t border-[#F2F2F7] p-5 animate-in slide-in-from-top-2 duration-200">
                    <div className="text-[13px] font-bold text-[#8E8E93] uppercase mb-3 tracking-wider">Состав заказа:</div>
                    <div className="space-y-3">
                      {lead.cart_items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-[#FFFFFF] p-3 rounded-[12px] border border-[#E5E5EA]">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F2F2F7] flex items-center justify-center text-[12px] font-bold">{idx + 1}</div>
                            <div>
                                <div className="text-[15px] font-bold text-[#000000]">{item.name}</div>
                                <div className="text-[12px] text-[#8E8E93]">{item.qty} шт. × {item.price?.toLocaleString()} ₸</div>
                            </div>
                          </div>
                          <div className="font-bold text-[15px]">{(item.price * item.qty).toLocaleString()} ₸</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}