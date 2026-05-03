'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'processed'>('new');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Тестовые данные (позже будут браться из Supabase)
  const [leads, setLeads] = useState<any[]>([
    { id: '1', name: 'Иван Иванов', phone: '+7 707 123 4567', total: 150000, status: 'new', created_at: new Date().toISOString(), cart_items: [{name: 'Лендинг', qty: 1}] },
    { id: '2', name: 'Анна Смирнова', phone: '+7 705 987 6543', total: 0, status: 'new', created_at: new Date().toISOString(), cart_items: null }
  ]);

  const filteredLeads = leads.filter(l => l.status === activeTab);

  function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'new' ? 'processed' : 'new';
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    setExpandedId(null);
  }

  return (
    <div className="animate-in fade-in duration-300 w-full">
      <h1 className="ios-large-title mb-8">Заявки</h1>

      {/* Переключатель вкладок: ширина 100% */}
      <div className="bg-[#E5E5EA] p-1.5 rounded-[12px] flex w-full mb-8">
        <button onClick={() => setActiveTab('new')} className={`flex-1 py-2 text-[15px] font-semibold rounded-[10px] transition-all ${activeTab === 'new' ? 'bg-[#FFFFFF] text-[#000000] shadow-sm' : 'text-[#000000] opacity-60'}`}>Новые</button>
        <button onClick={() => setActiveTab('processed')} className={`flex-1 py-2 text-[15px] font-semibold rounded-[10px] transition-all ${activeTab === 'processed' ? 'bg-[#FFFFFF] text-[#000000] shadow-sm' : 'text-[#000000] opacity-60'}`}>Обработанные</button>
      </div>

      {/* Список заявок */}
      <div className="space-y-4">
        {filteredLeads.map(lead => (
          <div key={lead.id} className="ios-bubble !mb-0 transition-all">
            <button onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)} className="w-full flex items-center justify-between p-6 text-left active:bg-gray-50 transition-colors">
              <div>
                <div className="text-[19px] font-bold text-[#000000]">{lead.name}</div>
                <div className="text-[15px] text-[#8E8E93] mt-1">{lead.phone} • {new Date(lead.created_at).toLocaleDateString('ru-RU')}</div>
              </div>
              <div className="flex items-center gap-4">
                {/* Безопасная проверка суммы */}
                {(lead.total ?? 0) > 0 && <span className="text-lg font-bold text-gray-400 hidden md:block">{(lead.total ?? 0).toLocaleString('ru-RU')} ₸</span>}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform bg-[#F2F2F7] text-gray-400 ${expandedId === lead.id ? 'rotate-180' : ''}`}>
                   <ChevronDown size={20} />
                </div>
              </div>
            </button>
            
            {expandedId === lead.id && (
              <div className="p-6 bg-[#F9F9F9] border-t border-[#E5E5EA]">
                {/* БЕЗОПАСНАЯ ПРОВЕРКА МАССИВА (Optional Chaining) */}
                {lead.cart_items && Array.isArray(lead.cart_items) ? (
                  <div className="mb-6">
                    <h3 className="text-[13px] uppercase tracking-widest font-bold text-[#8E8E93] mb-3">Состав заказа</h3>
                    <ul className="text-[17px] font-medium text-[#000000] space-y-2">
                      {lead.cart_items.map((item: any, i: number) => (
                        <li key={i}>• {item.name} <span className="text-[#8E8E93]">x{item.qty}</span></li>
                      ))}
                    </ul>
                    <div className="mt-4 font-black text-[19px]">Итого: {(lead.total ?? 0).toLocaleString('ru-RU')} ₸</div>
                  </div>
                ) : (
                  <div className="mb-6 text-[17px] font-medium text-[#8E8E93]">Консультация (без корзины)</div>
                )}
                
                <button onClick={() => toggleStatus(lead.id, lead.status)} className="btn-main w-full">
                  {lead.status === 'new' ? 'Переместить в Обработанные' : 'Вернуть в Новые'}
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredLeads.length === 0 && <div className="p-6 text-center text-[17px] font-bold text-[#8E8E93]">Нет заявок</div>}
      </div>
    </div>
  );
}