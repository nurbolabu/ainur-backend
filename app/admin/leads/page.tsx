'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'processed'>('new');
  
  const leads = [
    { id: '1', name: 'Иван Иванов', phone: '+7 707 123', total: 150000, status: 'new' },
    { id: '2', name: 'Анна Смирнова', phone: '+7 705 987', total: 0, status: 'new' }
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <h1 className="ios-title mt-4">Заявки</h1>

      {/* iOS Segmented Control */}
      <div className="px-4 md:px-0 mb-6">
        <div className="bg-[#E3E3E8]/80 p-[2px] rounded-[8px] flex">
          <button onClick={() => setActiveTab('new')} className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all ${activeTab === 'new' ? 'bg-white shadow-sm text-black' : 'text-black'}`}>Новые</button>
          <button onClick={() => setActiveTab('processed')} className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[6px] transition-all ${activeTab === 'processed' ? 'bg-white shadow-sm text-black' : 'text-black'}`}>Завершенные</button>
        </div>
      </div>

      <div className="ios-list">
        {leads.filter(l => l.status === activeTab).map(lead => (
          <button key={lead.id} className="ios-list-item w-full text-left">
            <div>
              <div className="ios-list-text">{lead.name}</div>
              <div className="text-[15px] text-[#8E8E93] mt-0.5">{lead.phone}</div>
            </div>
            <div className="ios-list-value">
              {lead.total > 0 && <span className="text-black">{lead.total.toLocaleString()} ₸</span>}
              <ChevronRight size={20} className="text-[#C7C7CC]" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}