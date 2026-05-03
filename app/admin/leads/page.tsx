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
    <div className="animate-in fade-in duration-300 w-full">
      <h1 className="text-3xl font-bold mb-8 px-1">Заявки</h1>

      {/* Переключатель */}
      <div className="bg-[#E5E5EA] p-1.5 rounded-[16px] flex max-w-sm mb-8 mx-1">
        <button onClick={() => setActiveTab('new')} className={`flex-1 py-2 text-sm font-bold rounded-[12px] transition-all ${activeTab === 'new' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Новые</button>
        <button onClick={() => setActiveTab('processed')} className={`flex-1 py-2 text-sm font-bold rounded-[12px] transition-all ${activeTab === 'processed' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Завершенные</button>
      </div>

      <div className="space-y-4">
        {leads.filter(l => l.status === activeTab).map(lead => (
          <div key={lead.id} className="ios-bubble mb-0 transition-all">
            <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)} className="w-full flex items-center justify-between p-6 text-left active:bg-gray-50 transition-colors">
              <div>
                <div className="text-xl font-bold text-black">{lead.name}</div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{lead.phone}</div>
              </div>
              <div className="flex items-center gap-4">
                {lead.total > 0 && <span className="text-lg font-bold text-gray-400 hidden md:block">{lead.total.toLocaleString()} ₸</span>}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform bg-[#F2F2F7] text-gray-400 ${expandedId === lead.id ? 'rotate-180' : ''}`}>
                   <ChevronDown size={20} />
                </div>
              </div>
            </button>
            
            {expandedId === lead.id && (
              <div className="p-6 bg-[#F9F9F9] border-t border-gray-100">
                {lead.cart ? (
                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Заказ</h3>
                    <ul className="text-lg font-medium text-black space-y-2">{lead.cart.map((c, i) => <li key={i}>• {c.n} <span className="text-gray-400">x{c.q}</span></li>)}</ul>
                    <div className="mt-4 font-black text-xl">Итого: {lead.total.toLocaleString()} ₸</div>
                  </div>
                ) : <div className="mb-6 text-lg font-medium text-gray-400">Консультация (без корзины)</div>}
                
                <button className="btn-main w-full">Отметить как готовое</button>
              </div>
            )}
          </div>
        ))}
        {leads.filter(l => l.status === activeTab).length === 0 && <div className="p-10 text-center font-bold text-gray-400">Нет заявок</div>}
      </div>
    </div>
  );
}