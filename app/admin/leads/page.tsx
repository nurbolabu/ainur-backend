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
    // В будущем тут будет реальный fetch из Supabase
    // const { data } = await supabase.from('leads').select('*').eq('project_id', MY_PROJECT_ID).order('created_at', { ascending: false });
    // Пока ставим заглушку для демонстрации дизайна
    setLeads([
      { id: '1', name: 'Иван Иванов', phone: '+7 707 123 4567', total: 150000, status: 'new', created_at: new Date().toISOString(), cart_items: [{name: 'Лендинг', qty: 1}] },
      { id: '2', name: 'Анна Смирнова', phone: '+7 705 987 6543', total: 0, status: 'new', created_at: new Date().toISOString(), cart_items: null },
      { id: '3', name: 'ООО Ромашка', phone: '+7 701 555 3322', total: 450000, status: 'processed', created_at: new Date().toISOString(), cart_items: [{name: 'Интернет-магазин', qty: 1}] }
    ]);
  }, []);

  const filteredLeads = leads.filter(l => l.status === activeTab);

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'new' ? 'processed' : 'new';
    // await supabase.from('leads').update({ status: newStatus }).eq('id', id);
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setExpandedId(null);
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Заявки</h1>
      </header>

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-[20px] flex items-center justify-between">
          <div><div className="text-gray-500 text-sm">Новые</div><div className="text-2xl font-bold text-gray-900">{leads.filter(l=>l.status==='new').length}</div></div>
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><Clock size={20}/></div>
        </div>
        <div className="bg-white p-4 rounded-[20px] flex items-center justify-between">
          <div><div className="text-gray-500 text-sm">Обработанные</div><div className="text-2xl font-bold text-gray-900">{leads.filter(l=>l.status==='processed').length}</div></div>
          <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><CheckCircle2 size={20}/></div>
        </div>
      </div>

      {/* iOS Вкладки */}
      <div className="flex p-1 bg-gray-200/50 rounded-xl w-full max-w-xs mx-auto md:mx-0 mb-6">
        <button onClick={() => setActiveTab('new')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'new' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Новые</button>
        <button onClick={() => setActiveTab('processed')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'processed' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}>Обработанные</button>
      </div>

      {/* Список заявок */}
      <div className="space-y-4">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="bg-white rounded-[24px] overflow-hidden transition-all">
            <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)} className="w-full flex items-center justify-between p-5 text-left active:bg-gray-50">
              <div>
                <div className="font-bold text-gray-900 text-lg">{lead.name}</div>
                <div className="text-gray-500 text-sm mt-0.5">{lead.phone} • {new Date(lead.created_at).toLocaleDateString('ru-RU')}</div>
              </div>
              <div className="flex items-center gap-4">
                {lead.total > 0 && <span className="font-bold text-black hidden md:block">{lead.total.toLocaleString('ru-RU')} ₸</span>}
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${expandedId === lead.id ? 'rotate-180' : ''}`} />
              </div>
            </button>
            
            {expandedId === lead.id && (
              <div className="p-5 pt-0 border-t border-gray-50 bg-gray-50/50">
                {lead.cart_items && (
                  <div className="mb-4 mt-4">
                    <div className="text-sm font-semibold text-gray-500 uppercase mb-2">Корзина</div>
                    <ul className="space-y-1 text-sm text-gray-800">
                      {lead.cart_items.map((item:any, i:number) => <li key={i}>• {item.name} x{item.qty}</li>)}
                    </ul>
                    <div className="mt-2 font-bold">Итого: {lead.total.toLocaleString('ru-RU')} ₸</div>
                  </div>
                )}
                {!lead.cart_items && <div className="mb-4 mt-4 text-sm text-gray-500">Обычная заявка (без корзины)</div>}
                
                <button onClick={() => toggleStatus(lead.id, lead.status)} className={`w-full py-3 rounded-xl font-semibold transition-transform active:scale-95 ${lead.status === 'new' ? 'bg-[#8BFDA8] text-black' : 'bg-gray-200 text-gray-700'}`}>
                  {lead.status === 'new' ? 'Отметить как Обработанное' : 'Вернуть в Новые'}
                </button>
              </div>
            )}
          </div>
        ))}
        {filteredLeads.length === 0 && <div className="text-center text-gray-400 py-10">Нет заявок в этой категории</div>}
      </div>
    </div>
  );
}