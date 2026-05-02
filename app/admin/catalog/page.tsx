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
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Каталог</h1>
        {!isAdding && <button onClick={() => { setIsAdding(true); setEditId(null); setNewProduct({ name: '', description: '', price: '', image_urls: [] }); }} className="btn-primary"><Plus size={20} />Добавить</button>}
      </header>

      {/* ФОРМА - Отдельная белая карточка */}
      {isAdding && (
        <div className="card-ios p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{editId ? 'Редактировать товар' : 'Новый товар'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div><label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Название *</label><input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="input-ios" placeholder="Создание лендинга" /></div>
            <div><label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Цена (₸) *</label><input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="input-ios" placeholder="150000" /></div>
          </div>
          
          <div className="mb-6"><label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Описание</label><textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="input-ios resize-none" placeholder="Подробное описание товара..."></textarea></div>

          <div className="flex flex-col md:flex-row gap-4 justify-end border-t border-gray-100 pt-8 mt-4">
            <button onClick={() => setIsAdding(false)} className="btn-secondary w-full md:w-auto">Отмена</button>
            <button className="btn-primary w-full md:w-auto">Сохранить</button>
          </div>
        </div>
      )}

      {/* ТОВАРЫ - Отдельные белые карточки */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const firstImage = product.image_url ? product.image_url.split(',')[0] : '';
          return (
          <div key={product.id} className="card-ios flex flex-col h-full">
            <div className="h-56 w-full bg-[#f5f5f7] border-b border-gray-100 flex items-center justify-center overflow-hidden relative">
              {firstImage ? <img src={firstImage} className="w-full h-full object-cover" alt=""/> : <ImageIcon className="text-gray-300" size={48} />}
            </div>
            <div className="p-6 flex-1">
              <h3 className="font-bold text-xl line-clamp-1">{product.name}</h3>
              <div className="text-2xl font-black mt-2">{Number(product.price).toLocaleString('ru-RU')} ₸</div>
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-3 bg-gray-50/50">
              <button className="flex-1 py-3 font-bold bg-white border border-gray-200 rounded-[14px] hover:bg-gray-50 transition-colors">Изменить</button>
              <button className="w-12 h-12 flex items-center justify-center bg-white text-red-500 border border-gray-200 rounded-[14px] hover:bg-red-50 transition-colors"><Trash2 size={20}/></button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}