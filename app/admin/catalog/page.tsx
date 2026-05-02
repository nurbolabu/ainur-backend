'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Edit, Image as ImageIcon, ShoppingBag } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image_url: '', is_active: true });

  async function fetchProducts() {
    setIsLoading(true);
    const { data } = await supabase.from('products').select('*').eq('project_id', MY_PROJECT_ID).order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  async function handleAddProduct() {
    if (!newProduct.name || !newProduct.price) return alert('Заполните название и цену');
    
    const { error } = await supabase.from('products').insert([{
      project_id: MY_PROJECT_ID, name: newProduct.name, description: newProduct.description, price: Number(newProduct.price), image_url: newProduct.image_url, is_active: newProduct.is_active
    }]);

    if (error) {
      alert('Ошибка добавления (проверьте RLS в Supabase!): ' + error.message);
    } else {
      setNewProduct({ name: '', description: '', price: '', image_url: '', is_active: true });
      setIsAdding(false);
      fetchProducts();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить товар?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  if (isLoading) return <div className="p-8 text-gray-500">Загрузка каталога...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Каталог товаров</h1>
          <p className="text-gray-500 mt-1">Управляйте услугами и товарами для виджета.</p>
        </div>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-[#8BFDA8] text-black font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:scale-[0.98] transition-all flex items-center gap-2"><Plus size={20} />{isAdding ? 'Отмена' : 'Добавить'}</button>
      </header>

      {isAdding && (
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm mb-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-700 mb-1">Название *</label><input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none" placeholder="Лендинг" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Цена (₸) *</label><input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none" placeholder="150000" /></div>
          </div>
          <div><label className="block text-sm text-gray-700 mb-1">Ссылка на картинку URL</label><input type="text" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none" /></div>
          <div><label className="block text-sm text-gray-700 mb-1">Описание</label><textarea rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none resize-none"></textarea></div>
          <div className="flex justify-end mt-2"><button onClick={handleAddProduct} className="bg-black text-white font-semibold px-8 py-3 rounded-xl">Сохранить</button></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-100 p-5 rounded-[24px] shadow-sm">
            <div className="h-40 w-full rounded-xl bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">{product.image_url ? <img src={product.image_url} className="w-full h-full object-cover" alt=""/> : <ImageIcon className="text-gray-400" size={40} />}</div>
            <h3 className="font-bold text-lg text-gray-900">{product.name}</h3>
            <div className="text-xl font-bold text-black mt-2">{Number(product.price).toLocaleString('ru-RU')} ₸</div>
            <button onClick={() => handleDelete(product.id)} className="mt-4 w-full py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">Удалить</button>
          </div>
        ))}
      </div>
    </div>
  );
}