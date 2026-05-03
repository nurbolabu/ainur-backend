'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'processed'>('new');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([
    { id: '1', name: 'Иван Иванов', phone: '+7 707 123 4567', total: 150000, status: 'new', created_at: new Date().toISOString(), cart_items: [{name: 'Лендинг', qty: 1}] },
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
      <h1 className="ios-large-title">Заявки</h1>

      {/* iOS Segmented Control */}
      <div className="bg-[#E5E5EA] p-1 rounded-[10px] flex max-w-sm mb-8 mx-4 md:mx-0">
        <button onClick={() => setActiveTab('new')} className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[8px] transition-all ${activeTab === 'new' ? 'bg-[#FFFFFF] text-[#000000]' : 'text-[#000000] opacity-60'}`}>Новые</button>
        <button onClick={() => setActiveTab('processed')} className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[8px] transition-all ${activeTab === 'processed' ? 'bg-[#FFFFFF] text-[#000000]' : 'text-[#000000] opacity-60'}`}>Обработанные</button>
      </div>

      <div className="ios-module">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="relative">
            <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)} className="ios-list-item w-full text-left">
              <div>
                <div className="text-[17px] font-semibold text-[#000000]">{lead.name}</div>
                <div className="text-[15px] text-[#8E8E93] mt-1">{lead.phone} • {new Date(lead.created_at).toLocaleDateString('ru-RU')}</div>
              </div>
              <div className="flex items-center gap-3">
                {lead.status === 'new' && <span className="bg-[#8BFDA8] text-[#000000] px-2 py-0.5 rounded text-[13px] font-semibold">Новая</span>}
                <ChevronDown size={20} className={`text-[#C6C6C8] transition-transform ${expandedId === lead.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            {expandedId === lead.id && (
              <div className="p-6 bg-[#F9F9F9] border-t border-[#E5E5EA]">
                {lead.cart_items ? (
                  <div className="mb-6">
                    <h3 className="text-[13px] uppercase text-[#8E8E93] mb-3">Состав заказа</h3>
                    <ul className="text-[17px] text-[#000000] space-y-2">{lead.cart_items.map((item:any, i:number) => <li key={i}>• {item.name} <span className="text-[#8E8E93]">x{item.qty}</span></li>)}</ul>
                    <div className="mt-4 font-bold text-[17px]">Итого: {lead.total.toLocaleString()} ₸</div>
                  </div>
                ) : <div className="mb-6 text-[17px] text-[#8E8E93]">Консультация (без корзины)</div>}
                
                <button onClick={() => toggleStatus(lead.id, lead.status)} className="btn-primary">
                  {lead.status === 'new' ? 'Переместить в Обработанные' : 'Вернуть в Новые'}
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredLeads.length === 0 && <div className="p-6 text-center text-[17px] text-[#8E8E93]">Нет заявок</div>}
      </div>
    </div>
  );
}