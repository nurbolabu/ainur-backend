'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, X, Upload, Loader2, Image as ImageIcon, Edit } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image_urls: [] as string[] });

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
      const fileName = `${Date.now()}_${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (!error) uploadedUrls.push(supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl);
    }
    setNewProduct(prev => ({ ...prev, image_urls: [...prev.image_urls, ...uploadedUrls] }));
    setIsUploading(false);
  }

  async function handleSave() {
    if (!newProduct.name || !newProduct.price) return alert('Укажите название и цену');
    const pData = { project_id: MY_PROJECT_ID, name: newProduct.name, description: newProduct.description, price: Number(newProduct.price), image_url: newProduct.image_urls.join(',') };
    if (editId) await supabase.from('products').update(pData).eq('id', editId);
    else await supabase.from('products').insert([pData]);
    setNewProduct({ name: '', description: '', price: '', image_urls: [] });
    setEditId(null); setIsAdding(false); fetchProducts();
  }

  async function startEdit(p: any) {
    setEditId(p.id);
    setNewProduct({ name: p.name, description: p.description || '', price: p.price, image_urls: p.image_url ? p.image_url.split(',') : [] });
    setIsAdding(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id: string) {
    if (confirm('Точно удалить этот товар?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  if (isLoading) return <div className="p-8 text-gray-500">Загрузка каталога...</div>;

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      <header className="mb-8 flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold tracking-tight">Каталог</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-main px-6"><Plus size={20}/> Добавить</button>}
      </header>

      {isAdding && (
        <div className="ios-bubble p-6 md:p-8 mb-8 border border-gray-100">
          <h2 className="text-xl font-bold mb-6">{editId ? 'Редактировать товар' : 'Новый товар'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="input-ios" placeholder="Название услуги" />
            <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="input-ios" placeholder="Цена (₸)" />
          </div>
          
          <textarea rows={3} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="input-ios resize-none mb-6"></textarea>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Фотографии</label>
            <div className="flex flex-wrap gap-4 items-start">
              {newProduct.image_urls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-[14px] border border-gray-200 overflow-hidden group"><img src={url} className="w-full h-full object-cover" alt="" /></div>
              ))}
              <label className="w-24 h-24 flex flex-col items-center justify-center bg-[#EDEDED] border border-gray-200 rounded-[14px] cursor-pointer hover:bg-gray-200 transition-colors">
                {isUploading ? <Loader2 className="animate-spin text-gray-400" size={24}/> : <Upload className="text-gray-400" size={24} />}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-end border-t border-gray-100 pt-8 mt-4">
            <button onClick={() => {setIsAdding(false); setEditId(null); setNewProduct({name:'', description:'', price:'', image_urls:[]})}} className="btn-sec w-full md:w-auto">Отмена</button>
            <button onClick={handleSave} className="btn-main w-full md:w-auto">Сохранить</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(p => {
          const img = p.image_url ? p.image_url.split(',')[0] : '';
          return (
          <div key={p.id} className="ios-bubble flex flex-col h-full hover:scale-[1.01] transition-transform">
            <div className="h-56 w-full bg-[#EDEDED] border-b border-gray-100 flex items-center justify-center overflow-hidden">
               {img ? <img src={img} className="w-full h-full object-cover"/> : <ImageIcon className="text-gray-300" size={48}/>}
            </div>
            <div className="p-6 flex-1">
              <h3 className="font-bold text-lg line-clamp-1">{p.name}</h3>
              <p className="text-2xl font-black mt-2">{Number(p.price).toLocaleString('ru-RU')} ₸</p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-2 border-t border-gray-100">
               <button onClick={() => startEdit(p)} className="btn-sec flex-1 px-4 py-2.5 text-sm"><Edit size={16}/> Изменить</button>
               <button onClick={() => handleDelete(p.id)} className="p-2 w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-[16px] text-red-500"><Trash2 size={18}/></button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}