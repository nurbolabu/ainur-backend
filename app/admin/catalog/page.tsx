'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Edit, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image_urls: [] as string[] });

  useEffect(() => {
    supabase.from('products').select('*').eq('project_id', MY_PROJECT_ID).order('created_at', { ascending: false })
      .then(({ data }) => data && setProducts(data));
  }, []);

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Каталог</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-primary px-6 py-2.5 flex items-center gap-2"><Plus size={20}/> Добавить</button>}
      </header>

      {isAdding && (
        <div className="card-ios p-6 mb-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold ml-1">Название</label>
              <input className="input-ios" placeholder="Напр: Создание сайта" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold ml-1">Цена (₸)</label>
              <input className="input-ios" type="number" placeholder="50000" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mb-8">
            <label className="text-sm font-semibold ml-1">Описание</label>
            <textarea className="input-ios resize-none" rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          </div>

          <div className="flex gap-3 justify-end border-t pt-6">
            <button onClick={() => setIsAdding(false)} className="btn-secondary px-8 py-3">Отмена</button>
            <button className="btn-primary px-8 py-3">Сохранить изменения</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="card-ios border border-gray-100 flex flex-col h-full">
            <div className="aspect-video bg-gray-50 flex items-center justify-center">
               <ImageIcon className="text-gray-200" size={48} />
            </div>
            <div className="p-5 flex-1">
              <h3 className="font-bold text-lg">{p.name}</h3>
              <p className="text-2xl font-black mt-2">{Number(p.price).toLocaleString()} ₸</p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-2">
              <button className="flex-1 py-2 font-semibold bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">Изменить</button>
              <button className="w-10 h-10 flex items-center justify-center bg-white text-red-500 border border-gray-200 rounded-xl hover:bg-red-50 transition-colors"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}