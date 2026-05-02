'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Edit, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [editId, setEditId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image_urls: [] as string[], is_active: true });

  async function fetchProducts() {
    setIsLoading(true);
    const { data } = await supabase.from('products').select('*').eq('project_id', MY_PROJECT_ID).order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  }

  useEffect(() => { fetchProducts(); }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const files = Array.from(e.target.files);
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        uploadedUrls.push(data.publicUrl);
      }
    }
    setNewProduct(prev => ({ ...prev, image_urls: [...prev.image_urls, ...uploadedUrls] }));
    setIsUploading(false);
  }

  function removeUploadedImage(index: number) {
    setNewProduct(prev => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== index) }));
  }

  async function handleSaveProduct() {
    if (!newProduct.name || !newProduct.price) return alert('Заполните название и цену');
    const productData = { project_id: MY_PROJECT_ID, name: newProduct.name, description: newProduct.description, price: Number(newProduct.price), image_url: newProduct.image_urls.join(','), is_active: newProduct.is_active };

    if (editId) await supabase.from('products').update(productData).eq('id', editId);
    else await supabase.from('products').insert([productData]);

    setNewProduct({ name: '', description: '', price: '', image_urls: [], is_active: true });
    setEditId(null); setIsAdding(false); fetchProducts();
  }

  function startEditing(product: any) {
    setEditId(product.id);
    setNewProduct({ name: product.name, description: product.description || '', price: product.price, image_urls: product.image_url ? product.image_url.split(',') : [], is_active: product.is_active });
    setIsAdding(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (!confirm('Точно удалить этот товар?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  if (isLoading) return <div className="p-8 text-gray-500">Загрузка каталога...</div>;

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Каталог товаров</h1>
          <p className="text-gray-500 mt-1">Управляйте услугами и товарами для виджета.</p>
        </div>
        <button onClick={() => { setIsAdding(!isAdding); setEditId(null); setNewProduct({ name: '', description: '', price: '', image_urls: [], is_active: true }); }} className="w-full md:w-auto bg-[#8BFDA8] text-black font-semibold px-5 py-3 md:py-2.5 rounded-xl shadow-sm hover:scale-[0.98] transition-all flex items-center justify-center gap-2">
          {isAdding ? <X size={20} /> : <Plus size={20} />}
          {isAdding ? 'Отмена' : 'Добавить товар'}
        </button>
      </header>

      {/* ФОРМА (Стеклянный эффект, тени) */}
      {isAdding && (
        <div className="bg-white/80 border border-white p-6 rounded-[24px] shadow-sm mb-8 flex flex-col gap-4">
          <h2 className="text-xl font-bold">{editId ? 'Редактировать товар' : 'Новый товар'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm text-gray-700 mb-1">Название *</label><input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none" /></div>
            <div><label className="block text-sm text-gray-700 mb-1">Цена (₸) *</label><input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none" /></div>
          </div>
          
          <div><label className="block text-sm text-gray-700 mb-1">Описание</label><textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border outline-none resize-none"></textarea></div>

          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Фотографии товара</label>
            <div className="flex flex-wrap gap-4 items-start">
              {newProduct.image_urls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl border overflow-hidden group">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button onClick={() => removeUploadedImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                </div>
              ))}
              
              <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-white transition-colors">
                {isUploading ? <Loader2 className="animate-spin text-gray-400" size={24}/> : <Upload className="text-gray-400" size={24} />}
                <span className="text-xs text-gray-500 mt-2">Загрузить</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-4"><button onClick={handleSaveProduct} disabled={isUploading} className="bg-black text-white font-semibold px-8 py-3 rounded-xl disabled:opacity-50 hover:bg-gray-800 transition-all">{editId ? 'Сохранить изменения' : 'Создать товар'}</button></div>
        </div>
      )}

      {/* СПИСОК ТОВАРОВ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const firstImage = product.image_url ? product.image_url.split(',')[0] : '';
          return (
          <div key={product.id} className="bg-white border border-gray-100 p-5 rounded-[24px] shadow-sm flex flex-col">
            <div className="h-48 w-full rounded-xl bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
              {firstImage ? <img src={firstImage} className="w-full h-full object-cover" alt=""/> : <ImageIcon className="text-gray-400" size={40} />}
            </div>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
            <div className="text-xl font-bold text-black mt-2">{Number(product.price).toLocaleString('ru-RU')} ₸</div>
            
            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
              <button onClick={() => startEditing(product)} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 font-medium"><Edit size={16}/> Изменить</button>
              <button onClick={() => handleDelete(product.id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}