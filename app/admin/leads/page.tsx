'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown } from 'lucide-react';

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'processed'>('new');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([
    { id: '1', name: 'Иван Иванов', phone: '+7 707 123 4567', total: 150000, status: 'new', created_at: new Date().toISOString(), cart_items: [{name: 'Разработка лендинга', qty: 1}] },
    { id: '2', name: 'Анна Смирнова', phone: '+7 705 987 6543', total: 0, status: 'processed', created_at: new Date().toISOString() }
  ]);

  const filteredLeads = leads.filter(l => l.status === activeTab);

  function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'new' ? 'processed' : 'new';
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setExpandedId(null);
  }

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="ios-large-title px-1 md:px-0">Заявки</h1>

      {/* Нативный iOS Segmented Control */}
      <div className="bg-[#E5E5EA] p-[3px] rounded-[10px] flex max-w-[320px] mb-8 mx-1 md:mx-0">
        <button onClick={() => setActiveTab('new')} className={`flex-1 py-1.5 text-[14px] font-medium rounded-[7px] transition-all ${activeTab === 'new' ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)]' : 'text-[#000000] opacity-80'}`}>Новые</button>
        <button onClick={() => setActiveTab('processed')} className={`flex-1 py-1.5 text-[14px] font-medium rounded-[7px] transition-all ${activeTab === 'processed' ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)]' : 'text-[#000000] opacity-80'}`}>Обработанные</button>
      </div>

      <div className="ios-module mx-1 md:mx-0">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="relative">
            <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)} className="ios-list-item w-full text-left border-none">
              <div>
                <div className="text-[17px] font-semibold text-[#000000]">{lead.name}</div>
                <div className="text-[15px] text-[#8E8E93] mt-1">{lead.phone} • {new Date(lead.created_at).toLocaleDateString('ru-RU')}</div>
              </div>
              <div className="flex items-center gap-3">
                {lead.status === 'new' && <span className="bg-[#8BFDA8] text-[#000000] px-2 py-0.5 rounded-[6px] text-[13px] font-semibold">Новая</span>}
                <ChevronDown size={20} className={`text-[#C6C6C8] transition-transform ${expandedId === lead.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            {/* Аккордеон с мягким серым фоном для контраста */}
            {expandedId === lead.id && (
              <div className="p-6 bg-[#F5F5F7] animate-in slide-in-from-top-2 duration-200">
                {lead.cart_items ? (
                  <div className="mb-6">
                    <h3 className="ios-section-header ml-0">Состав заказа</h3>
                    <div className="bg-[#FFFFFF] rounded-[16px] p-4 space-y-3">
                      {lead.cart_items.map((item:any, i:number) => (
                        <div key={i} className="flex justify-between items-center text-[17px] text-[#000000]">
                          <span>{item.name}</span>
                          <span className="text-[#8E8E93] font-medium">x{item.qty}</span>
                        </div>
                      ))}
                      <div className="h-[1px] bg-[#E5E5EA] w-full my-2"></div>
                      <div className="flex justify-between items-center font-bold text-[17px]">
                         <span>Итого</span>
                         <span>{lead.total.toLocaleString()} ₸</span>
                      </div>
                    </div>
                  </div>
                ) : <div className="mb-6 text-[17px] text-[#8E8E93] p-4 bg-[#FFFFFF] rounded-[16px]">Стандартная консультация (без корзины)</div>}
                
                <button onClick={() => toggleStatus(lead.id, lead.status)} className="btn-primary w-full md:w-auto">
                  {lead.status === 'new' ? 'Переместить в Обработанные' : 'Вернуть в Новые'}
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredLeads.length === 0 && <div className="p-10 text-center text-[17px] text-[#8E8E93]">Нет заявок в этой категории</div>}
      </div>
    </div>
  );
}