'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Calendar, Phone, ShoppingCart } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LeadsPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="animate-in fade-in duration-300 px-1 md:px-0">
      <h1 className="ios-large-title">Заявки</h1>

      {isLoading ? (
        <div className="flex justify-center py-20 text-[#8E8E93]">Загрузка заявок...</div>
      ) : leads.length === 0 ? (
        <div className="ios-module p-10 text-center text-[#8E8E93]">Заявок пока нет</div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="ios-module p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <h3 className="font-bold text-[19px]">{lead.name}</h3>
                   {lead.cart_items && <span className="bg-[#8BFDA8] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Заказ</span>}
                </div>
                <div className="flex items-center gap-4 text-[15px] text-[#8E8E93]">
                  <span className="flex items-center gap-1.5"><Phone size={14}/> {lead.phone}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={14}/> {new Date(lead.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {lead.cart_items ? (
                <div className="bg-[#F5F5F7] p-3 rounded-[16px] flex items-center gap-4">
                   <div className="flex flex-col">
                      <span className="text-[11px] text-[#8E8E93] uppercase font-bold">Сумма заказа</span>
                      <span className="text-[17px] font-black">{lead.total?.toLocaleString()} ₸</span>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-[#FFFFFF] flex items-center justify-center text-[#000000] border border-[#E5E5EA]">
                      <ShoppingCart size={20} />
                   </div>
                </div>
              ) : (
                <div className="text-[15px] text-[#8E8E93] italic">Обратный звонок</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}