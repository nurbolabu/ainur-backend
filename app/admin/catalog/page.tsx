'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Edit, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
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

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Каталог</h1>
        {!isAdding && <button onClick={() => { setIsAdding(true); setEditId(null); setNewProduct({ name: '', description: '', price: '', image_urls: [], is_active: true }); }} className="btn-primary"><Plus size={20} />Добавить</button>}
      </header>

      {/* БЕЛАЯ КАРТОЧКА ФОРМЫ (без теней) */}
      {isAdding && (
        <div className="card-ios p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold mb-6">{editId ? 'Редактировать товар' : 'Новый товар'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div><label className="block text-sm font-semibold mb-2">Название *</label><input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="input-ios" /></div>
            <div><label className="block text-sm font-semibold mb-2">Цена (₸) *</label><input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="input-ios" /></div>
          </div>
          
          <div className="mb-6"><label className="block text-sm font-semibold mb-2">Описание</label><textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="input-ios resize-none"></textarea></div>

          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2">Фотографии товара</label>
            <div className="flex flex-wrap gap-4 items-start">
              {newProduct.image_urls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-[14px] border border-gray-200 overflow-hidden group">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button onClick={() => removeUploadedImage(i)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X size={14}/></button>
                </div>
              ))}
              <label className="w-24 h-24 flex flex-col items-center justify-center bg-[#f5f5f7] border border-gray-200 rounded-[14px] cursor-pointer hover:bg-gray-200 transition-colors">
                {isUploading ? <Loader2 className="animate-spin text-gray-400" size={24}/> : <Upload className="text-gray-400" size={24} />}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
              </label>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-end border-t border-gray-100 pt-6">
            <button onClick={() => setIsAdding(false)} className="btn-secondary w-full md:w-auto">Отмена</button>
            <button onClick={handleSaveProduct} disabled={isUploading} className="btn-primary w-full md:w-auto disabled:opacity-50">Сохранить</button>
          </div>
        </div>
      )}

      {/* КАРТОЧКИ ТОВАРОВ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const firstImage = product.image_url ? product.image_url.split(',')[0] : '';
          return (
          <div key={product.id} onClick={() => startEditing(product)} className="card-ios flex flex-col cursor-pointer hover:border-gray-400 transition-colors h-full">
            <div className="h-48 w-full bg-[#f5f5f7] border-b border-gray-100 flex items-center justify-center overflow-hidden">
              {firstImage ? <img src={firstImage} className="w-full h-full object-cover" alt=""/> : <ImageIcon className="text-gray-300" size={40} />}
            </div>
            <div className="p-5 flex-1">
              <h3 className="font-bold text-lg line-clamp-1">{product.name}</h3>
              <div className="text-xl font-bold mt-2">{Number(product.price).toLocaleString('ru-RU')} ₸</div>
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}