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
  
  // Состояние для новой формы
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    is_active: true
  });

  // 1. Загрузка товаров из базы
  async function fetchProducts() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('project_id', MY_PROJECT_ID)
      .order('created_at', { ascending: false });

    if (data) setProducts(data);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Добавление нового товара
  async function handleAddProduct() {
    if (!newProduct.name || !newProduct.price) {
      alert('Пожалуйста, заполните название и цену');
      return;
    }

    const { error } = await supabase
      .from('products')
      .insert([{
        project_id: MY_PROJECT_ID,
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        image_url: newProduct.image_url,
        is_active: newProduct.is_active
      }]);

    if (!error) {
      setNewProduct({ name: '', description: '', price: '', image_url: '', is_active: true });
      setIsAdding(false);
      fetchProducts(); // Обновляем список
    } else {
      alert('Ошибка при добавлении товара');
    }
  }

  // 3. Удаление товара
  async function handleDelete(id: string) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (!error) {
      fetchProducts();
    }
  }

  // 4. Переключение статуса (Активен/Скрыт)
  async function toggleActive(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      fetchProducts();
    }
  }

  if (isLoading) return <div className="p-8 text-gray-500">Загрузка каталога...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Каталог товаров</h1>
          <p className="text-gray-500 mt-1">Управляйте услугами и товарами, которые видит клиент в виджете.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-black font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:scale-[0.98] active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          {isAdding ? 'Отмена' : 'Добавить товар'}
        </button>
      </header>

      {/* ФОРМА ДОБАВЛЕНИЯ */}
      {isAdding && (
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm mb-8 flex flex-col gap-4 animate-in slide-in-from-top-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Новый товар</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
              <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all" placeholder="Например: Создание Лендинга" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₸) *</label>
              <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all" placeholder="150000" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ссылка на картинку (URL)</label>
            <input type="text" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all" placeholder="https://..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea rows={2} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary outline-none transition-all resize-none" placeholder="Краткое описание товара..."></textarea>
          </div>

          <div className="flex justify-end mt-2">
            <button onClick={handleAddProduct} className="bg-black text-white font-semibold px-8 py-3 rounded-xl hover:bg-gray-800 transition-all">
              Сохранить товар
            </button>
          </div>
        </div>
      )}

      {/* СПИСОК ТОВАРОВ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className={`bg-white border border-gray-100 p-5 rounded-[24px] shadow-sm flex flex-col transition-all ${!product.is_active ? 'opacity-60 grayscale' : ''}`}>
            
            <div className="h-40 w-full rounded-xl bg-gray-100 mb-4 overflow-hidden flex items-center justify-center relative">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-400" size={40} />
              )}
              {!product.is_active && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white px-3 py-1 rounded-lg text-sm font-bold">Скрыт</span>
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
            <p className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[40px]">{product.description}</p>
            <div className="text-xl font-bold text-black mt-4">{Number(product.price).toLocaleString('ru-RU')} ₸</div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button 
                onClick={() => toggleActive(product.id, product.is_active)}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                {product.is_active ? 'Скрыть с сайта' : 'Показать на сайте'}
              </button>
              
              <div className="flex gap-2">
                <button onClick={() => handleDelete(product.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

          </div>
        ))}

        {products.length === 0 && !isAdding && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-[24px]">
            <ShoppingBag size={48} className="mb-4 opacity-50" />
            <p>В каталоге пока нет товаров.</p>
          </div>
        )}
      </div>
    </div>
  );
}