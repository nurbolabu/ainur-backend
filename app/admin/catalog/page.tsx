'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Trash2, Edit, Plus, Image as ImageIcon } from 'lucide-react';

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
    const { data } = await supabase.from('products').select('*').eq('project_id', MY_PROJECT_ID).order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  }
  useEffect(() => { fetchProducts(); }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const uploadedUrls: string[] = [];
    for (const file of Array.from(e.target.files)) {
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

  async function handleDelete(id: string) {
    if (confirm('Удалить товар?')) { await supabase.from('products').delete().eq('id', id); fetchProducts(); }
  }

  return (
    <div className="animate-in fade-in duration-300 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="ios-large-title mb-0">Каталог</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-main w-full md:w-auto"><Plus size={20} className="text-black" /> Добавить</button>}
      </div>

      {isAdding && (
        <div className="ios-bubble p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">{editId ? 'Редактировать товар' : 'Новый товар'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="input-ios" placeholder="Название товара" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input className="input-ios" type="number" placeholder="Цена (₸)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
          </div>
          <textarea className="input-ios resize-none mb-6" rows={3} placeholder="Описание товара..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Фотографии</h2>
          <div className="flex gap-4 mb-8 flex-wrap">
            {newProduct.image_urls.map((url, i) => (<img key={i} src={url} className="w-[80px] h-[80px] rounded-[16px] object-cover border border-gray-200" />))}
            <label className="w-[80px] h-[80px] rounded-[16px] bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              {isUploading ? <Loader2 className="animate-spin text-[#8E8E93]"/> : <span className="text-[24px] text-[#8E8E93] font-bold">+</span>}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading}/>
            </label>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-end pt-6 border-t border-gray-100">
             <button className="btn-sec w-full md:w-auto" onClick={() => {setIsAdding(false); setEditId(null); setNewProduct({ name: '', description: '', price: '', image_urls: [] });}}>Отмена</button>
             <button className="btn-main w-full md:w-auto" onClick={handleSave}>Сохранить</button>
          </div>
        </div>
      )}

      {/* СЕТКА ТОВАРОВ ВРОВЕНЬ С ЗАГОЛОВКОМ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] mb-8">
        {products.map(p => {
          const img = p.image_url ? p.image_url.split(',')[0] : '';
          return (
          <div key={p.id} className="ios-bubble !mb-0 flex flex-col">
            <div className="h-[200px] bg-[#F5F5F7] relative border-b border-gray-100 flex items-center justify-center">
               {img ? <img src={img} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={56}/>}
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center">
              <h3 className="text-[17px] font-semibold text-[#000000] line-clamp-1">{p.name}</h3>
              <p className="text-[15px] text-[#8E8E93] mt-1 line-clamp-2">{p.description}</p>
              <div className="text-[20px] font-bold mt-3 text-[#000000]">{Number(p.price).toLocaleString()} ₸</div>
            </div>
            <div className="flex items-center gap-3 p-4 pt-0">
               <button onClick={() => {setEditId(p.id); setNewProduct({...p, image_urls: p.image_url ? p.image_url.split(',') : []}); setIsAdding(true);}} className="flex-1 h-[44px] bg-[#F5F5F7] rounded-[14px] flex items-center justify-center gap-2 text-[#000000] font-medium text-[15px] transition-colors active:bg-[#E5E5EA]">
                 <Edit size={18}/> Редактировать
               </button>
               <button onClick={() => handleDelete(p.id)} className="w-[44px] h-[44px] bg-[#F5F5F7] rounded-[14px] flex items-center justify-center text-red-500 shrink-0 transition-colors active:bg-red-50">
                 <Trash2 size={20}/>
               </button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}