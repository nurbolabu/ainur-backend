'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown, CheckCircle2, Clock } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'processed'>('new');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLeads([
      { id: '1', name: 'Иван Иванов', phone: '+7 707 123 4567', total: 150000, status: 'new', created_at: new Date().toISOString(), cart_items: [{name: 'Лендинг', qty: 1}] },
      { id: '2', name: 'Анна Смирнова', phone: '+7 705 987 6543', total: 0, status: 'new', created_at: new Date().toISOString(), cart_items: null },
      { id: '3', name: 'ООО Ромашка', phone: '+7 701 555 3322', total: 450000, status: 'processed', created_at: new Date().toISOString(), cart_items: [{name: 'Интернет-магазин', qty: 1}] }
    ]);
  }, []);

  const filteredLeads = leads.filter(l => l.status === activeTab);

  function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'new' ? 'processed' : 'new';
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setExpandedId(null);
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="mb-6"><h1 className="text-3xl font-bold tracking-tight">Заявки</h1></header>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card-ios p-4 flex items-center justify-between">
          <div><div className="text-gray-500 text-sm">Новые</div><div className="text-2xl font-bold mt-1">{leads.filter(l=>l.status==='new').length}</div></div>
          <div className="w-12 h-12 rounded-full bg-[#f5f5f7] text-gray-500 flex items-center justify-center"><Clock size={22}/></div>
        </div>
        <div className="card-ios p-4 flex items-center justify-between">
          <div><div className="text-gray-500 text-sm">Обработанные</div><div className="text-2xl font-bold mt-1">{leads.filter(l=>l.status==='processed').length}</div></div>
          <div className="w-12 h-12 rounded-full bg-[#8BFDA8]/20 text-green-600 flex items-center justify-center"><CheckCircle2 size={22}/></div>
        </div>
      </div>

      {/* iOS Вкладки */}
      <div className="flex p-1.5 bg-[#e5e5ea] rounded-[14px] w-full max-w-xs mx-auto md:mx-0 mb-6">
        <button onClick={() => setActiveTab('new')} className={`flex-1 py-2 text-sm font-bold rounded-[10px] transition-all ${activeTab === 'new' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Новые</button>
        <button onClick={() => setActiveTab('processed')} className={`flex-1 py-2 text-sm font-bold rounded-[10px] transition-all ${activeTab === 'processed' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Обработанные</button>
      </div>

      {/* Список заявок (Каждая в своей белой карточке) */}
      <div className="space-y-4">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="card-ios transition-all">
            <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)} className="w-full flex items-center justify-between p-5 text-left active:bg-gray-50">
              <div>
                <div className="font-bold text-lg">{lead.name}</div>
                <div className="text-gray-500 text-sm mt-1">{lead.phone} • {new Date(lead.created_at).toLocaleDateString('ru-RU')}</div>
              </div>
              <div className="flex items-center gap-4">
                {lead.total > 0 && <span className="font-bold text-black hidden md:block">{lead.total.toLocaleString('ru-RU')} ₸</span>}
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedId === lead.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            {expandedId === lead.id && (
              <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50 mt-2">
                {lead.cart_items && (
                  <div className="mb-6 mt-4">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Содержимое корзины</div>
                    <ul className="space-y-2 text-base font-medium">
                      {lead.cart_items.map((item:any, i:number) => <li key={i}>• {item.name} <span className="text-gray-500">x{item.qty}</span></li>)}
                    </ul>
                    <div className="mt-4 font-bold text-xl">Итого: {lead.total.toLocaleString('ru-RU')} ₸</div>
                  </div>
                )}
                {!lead.cart_items && <div className="mb-6 mt-4 text-gray-500 font-medium">Обычная заявка (без корзины)</div>}
                
                <button onClick={() => toggleStatus(lead.id, lead.status)} className={lead.status === 'new' ? 'btn-primary w-full' : 'btn-secondary w-full'}>
                  {lead.status === 'new' ? 'Отметить как Обработанное' : 'Вернуть в Новые'}
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredLeads.length === 0 && <div className="text-center text-gray-400 py-10 font-medium">Нет заявок в этой категории</div>}
      </div>
    </div>
  );
}