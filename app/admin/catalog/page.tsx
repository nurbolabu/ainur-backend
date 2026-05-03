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
        <h1 className="text-3xl font-bold tracking-tight">Каталог</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-primary"><Plus size={20}/> Добавить</button>}
      </header>

      {isAdding && (
        <div className="card-ios p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input className="input-ios" placeholder="Название услуги" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input className="input-ios" type="number" placeholder="Цена (₸)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
          </div>
          <textarea className="input-ios mb-6 resize-none" rows={3} placeholder="Описание услуги..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          
          <div className="flex gap-3 justify-end border-t border-gray-50 pt-6">
            <button onClick={() => setIsAdding(false)} className="btn-secondary px-8">Отмена</button>
            <button className="btn-primary px-8">Сохранить</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map(p => (
          <div key={p.id} className="card-ios flex flex-col group">
            <div className="h-44 bg-[#F2F2F7] flex items-center justify-center border-b border-gray-100 overflow-hidden">
               {p.image_url ? <img src={p.image_url.split(',')[0]} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={40} className="text-gray-300" />}
            </div>
            <div className="p-5 flex-1">
              <h3 className="font-bold text-lg line-clamp-1">{p.name}</h3>
              <p className="text-2xl font-black mt-2">{Number(p.price).toLocaleString()} ₸</p>
            </div>
            <div className="p-4 bg-gray-50/50 flex gap-2 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="flex-1 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm">Изменить</button>
               <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-red-500"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}