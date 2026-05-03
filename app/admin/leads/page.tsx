'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'processed'>('new');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const leads = [
    { id: '1', name: 'Иван Иванов', phone: '+7 707 123 4567', total: 150000, status: 'new', cart: [{n:'Лендинг', q:1}] },
    { id: '2', name: 'Анна Смирнова', phone: '+7 705 987 6543', total: 0, status: 'new', cart: null }
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="ios-large-title mt-4">Заявки</h1>

      {/* iOS Segmented Control */}
      <div className="px-4 md:px-0 mb-6">
        <div className="bg-[#E3E3E8] p-[2px] rounded-[9px] flex max-w-sm">
          <button onClick={() => setActiveTab('new')} className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[7px] transition-all ${activeTab === 'new' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] text-black' : 'text-black'}`}>Новые</button>
          <button onClick={() => setActiveTab('processed')} className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[7px] transition-all ${activeTab === 'processed' ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] text-black' : 'text-black'}`}>Обработанные</button>
        </div>
      </div>

      <div className="ios-bubble ios-bubble-margin">
        {leads.filter(l => l.status === activeTab).map(lead => (
          <div key={lead.id}>
            <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)} className="ios-list-row w-full text-left">
              <div>
                <div className="text-[17px] font-medium text-black">{lead.name}</div>
                <div className="text-[15px] text-[#3C3C43] opacity-60 mt-0.5">{lead.phone}</div>
              </div>
              <div className="flex items-center gap-3">
                {lead.total > 0 && <span className="text-[17px] text-[#3C3C43] opacity-60">{lead.total.toLocaleString()} ₸</span>}
                <ChevronDown size={20} className={`text-[#C6C6C8] transition-transform ${expandedId === lead.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedId === lead.id && (
              <div className="p-4 bg-[#F2F2F7]/50 border-b border-[#C6C6C8]">
                {lead.cart ? (
                  <ul className="mb-4 text-[15px] text-black space-y-1">{lead.cart.map((c, i) => <li key={i}>• {c.n} x{c.q}</li>)}</ul>
                ) : <div className="mb-4 text-[15px] text-[#8E8E93]">Обычная заявка</div>}
                <button className="btn-primary min-h-[44px]">Отметить как готовое</button>
              </div>
            )}
          </div>
        ))}
        {leads.filter(l => l.status === activeTab).length === 0 && <div className="p-6 text-center text-[#8E8E93] text-[17px]">Пусто</div>}
      </div>
    </div>
  );
}