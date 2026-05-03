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
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image_urls: [] as string[] });

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
    setNewProduct({ name: '', price: '', description: '', image_urls: [] });
    setEditId(null); setIsAdding(false); fetchProducts();
  }

  async function handleDelete(id: string) {
    if (confirm('Точно удалить товар?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  if (isLoading) return <div className="p-8 text-[#8E8E93] text-[17px] text-center">Загрузка каталога...</div>;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center pr-4 md:pr-0 mb-4">
        <h1 className="ios-large-title mb-0 mt-4">Каталог</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-text"><Plus size={20}/> Добавить</button>}
      </div>

      {isAdding && (
        <div className="ios-bubble-margin mb-8">
          <h2 className="ios-section-header">{editId ? 'Редактировать товар' : 'Новый товар'}</h2>
          <div className="ios-bubble mb-6">
            <div className="ios-list-row bg-white"><input type="text" className="input-bare" placeholder="Название услуги" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} /></div>
            <div className="ios-list-row bg-white"><input type="number" className="input-bare" placeholder="Цена (₸)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} /></div>
            <div className="ios-list-row bg-white py-3 h-auto"><textarea rows={3} className="input-bare resize-none" placeholder="Описание..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea></div>
          </div>
          
          <h2 className="ios-section-header">Фотографии</h2>
          <div className="ios-bubble p-4 flex gap-3 flex-wrap bg-white mb-6">
             {newProduct.image_urls.map((url, i) => (<img key={i} src={url} className="w-[72px] h-[72px] rounded-[10px] object-cover" />))}
             <label className="w-[72px] h-[72px] rounded-[10px] border border-[#C6C6C8] bg-[#F2F2F7] flex items-center justify-center cursor-pointer">
                {isUploading ? <Loader2 className="animate-spin text-[#8E8E93]" size={20}/> : <span className="text-[#000000] font-bold text-2xl">+</span>}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
             </label>
          </div>

          <div className="flex gap-4">
             <button className="btn-secondary" onClick={() => setIsAdding(false)}>Отмена</button>
             <button className="btn-primary" onClick={handleSave} disabled={isUploading}>Сохранить</button>
          </div>
        </div>
      )}

      {!isAdding && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ios-bubble-margin">
          {products.map(p => {
            const img = p.image_url ? p.image_url.split(',')[0] : '';
            return (
            <div key={p.id} className="ios-bubble flex flex-col mb-0 bg-white group">
              <div className="h-[200px] w-full bg-[#F2F2F7] flex items-center justify-center relative">
                 {img ? <img src={img} className="w-full h-full object-cover"/> : <ImageIcon className="text-[#C6C6C8]" size={40}/>}
              </div>
              <div className="p-4 flex-1">
                <h3 className="text-[17px] font-semibold text-black leading-tight line-clamp-2">{p.name}</h3>
                <p className="text-[20px] font-bold mt-1 text-[#8E8E93]">{Number(p.price).toLocaleString()} ₸</p>
              </div>
              {/* Широкая кнопка редактирования и кнопка удаления */}
              <div className="flex items-center gap-3 p-4 pt-0">
                 <button onClick={() => {setEditId(p.id); setNewProduct({...p, image_urls: p.image_url ? p.image_url.split(',') : []}); setIsAdding(true);}} className="flex-1 bg-[#F2F2F7] hover:bg-[#E5E5EA] text-black font-semibold rounded-[12px] min-h-[44px] flex items-center justify-center gap-2 transition-colors"><Edit size={18}/> Редактировать</button>
                 <button onClick={() => handleDelete(p.id)} className="w-[44px] h-[44px] bg-[#F2F2F7] hover:bg-red-50 text-red-500 rounded-[12px] flex items-center justify-center shrink-0 transition-colors"><Trash2 size={20}/></button>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}