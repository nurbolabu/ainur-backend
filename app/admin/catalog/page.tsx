'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Edit, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image_urls: [] as string[] });

  useEffect(() => {
    supabase.from('products').select('*').eq('project_id', MY_PROJECT_ID).order('created_at', { ascending: false })
      .then(({ data }) => data && setProducts(data));
  }, []);

  return (
    <div className="animate-in fade-in duration-500 w-full md:w-[900px]">
      <header className="mb-8 flex justify-between items-center px-2">
        <h1 className="text-[#8E8E93] text-2xl font-bold">Каталог</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="bg-[#8BFDA8] text-black font-bold rounded-[16px] px-6 py-3 transition-transform active:scale-95 flex items-center gap-2 shadow-sm"><Plus size={20}/> Добавить</button>}
      </header>

      {/* ФОРМА (Белая карточка) */}
      {isAdding && (
        <div className="bg-white rounded-[24px] shadow-sm p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input className="bg-[#F2F2F7] border border-[#E5E5EA] rounded-[16px] px-4 py-3.5 outline-none focus:bg-white transition-all w-full text-black" placeholder="Название услуги" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input className="bg-[#F2F2F7] border border-[#E5E5EA] rounded-[16px] px-4 py-3.5 outline-none focus:bg-white transition-all w-full text-black" type="number" placeholder="Цена (₸)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
          </div>
          <textarea className="bg-[#F2F2F7] border border-[#E5E5EA] rounded-[16px] px-4 py-3.5 outline-none focus:bg-white transition-all w-full text-black mb-6 resize-none" rows={3} placeholder="Описание услуги..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          
          <div className="flex gap-3 justify-end border-t border-gray-50 pt-6">
            <button onClick={() => setIsAdding(false)} className="bg-black text-white font-bold rounded-[16px] px-8 py-3.5 transition-transform active:scale-95">Отмена</button>
            <button className="bg-[#8BFDA8] text-black font-bold rounded-[16px] px-8 py-3.5 transition-transform active:scale-95">Сохранить</button>
          </div>
        </div>
      )}

      {/* СПИСОК ТОВАРОВ (Отдельные карточки) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-[24px] shadow-sm flex flex-col overflow-hidden group">
            <div className="h-44 bg-[#F2F2F7] flex items-center justify-center border-b border-gray-100 relative">
               {p.image_url ? <img src={p.image_url.split(',')[0]} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={40} className="text-gray-300" />}
            </div>
            <div className="p-5 flex-1">
              <h3 className="font-bold text-lg line-clamp-1">{p.name}</h3>
              <p className="text-2xl font-black mt-2">{Number(p.price).toLocaleString()} ₸</p>
            </div>
            <div className="p-4 bg-gray-50/50 flex gap-2 border-t border-gray-50">
               <button className="flex-1 py-2 bg-white shadow-sm rounded-xl font-bold text-sm">Изменить</button>
               <button className="w-10 h-10 flex items-center justify-center bg-white shadow-sm rounded-xl text-red-500"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}