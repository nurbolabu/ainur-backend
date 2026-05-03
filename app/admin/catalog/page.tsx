'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, ChevronRight, Image as ImageIcon, Trash2, Upload, Loader2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image_urls: [] as string[] });

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').eq('project_id', MY_PROJECT_ID).order('created_at', { ascending: false });
    if (data) setProducts(data);
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
    await supabase.from('products').insert([{ project_id: MY_PROJECT_ID, name: newProduct.name, description: newProduct.description, price: Number(newProduct.price), image_url: newProduct.image_urls.join(',') }]);
    setNewProduct({ name: '', price: '', description: '', image_urls: [] });
    setIsAdding(false);
    fetchProducts();
  }

  async function handleDelete(id: string) {
    if (confirm('Удалить товар?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center px-4 md:px-0">
        <h1 className="ios-title mb-4 px-0 mt-4">Каталог</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="btn-text mb-4"><Plus size={28}/></button>}
      </div>

      {isAdding && (
        <div className="mx-4 md:mx-0 mb-8">
          <h2 className="ios-section-title">Новый товар</h2>
          <div className="ios-bubble mb-4">
            <div className="border-b border-[#C6C6C8]"><input className="input-ios" placeholder="Название" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} /></div>
            <div className="border-b border-[#C6C6C8]"><input className="input-ios" type="number" placeholder="Цена (₸)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} /></div>
            <div><textarea className="input-ios resize-none" rows={3} placeholder="Описание" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} /></div>
          </div>
          
          <h2 className="ios-section-title">Фотографии</h2>
          <div className="ios-bubble p-4 flex gap-4 flex-wrap mb-4">
             {newProduct.image_urls.map((url, i) => (
                <img key={i} src={url} className="w-16 h-16 rounded-[8px] object-cover border border-[#C6C6C8]" />
             ))}
             <label className="w-16 h-16 rounded-[8px] border-2 border-dashed border-[#C6C6C8] flex items-center justify-center bg-[#F2F2F7] cursor-pointer">
                {isUploading ? <Loader2 className="animate-spin text-[#8E8E93]" size={20}/> : <Upload className="text-[#8E8E93]" size={20} />}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
             </label>
          </div>

          <div className="flex gap-3">
             <button className="btn-secondary" onClick={() => setIsAdding(false)}>Отмена</button>
             <button className="btn-primary" onClick={handleSave}>Сохранить</button>
          </div>
        </div>
      )}

      <h2 className="ios-section-title">Все товары</h2>
      <div className="ios-bubble">
        {products.map(p => {
          const firstImg = p.image_url ? p.image_url.split(',')[0] : '';
          return (
          <div key={p.id} className="ios-list-item">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#F2F2F7] rounded-[8px] flex items-center justify-center shrink-0 overflow-hidden border border-[#C6C6C8]">
                 {firstImg ? <img src={firstImg} className="w-full h-full object-cover"/> : <ImageIcon size={20} className="text-[#C7C7CC]"/>}
              </div>
              <div>
                <div className="ios-list-text">{p.name}</div>
                <div className="text-[15px] text-[#8E8E93] mt-0.5">{Number(p.price).toLocaleString()} ₸</div>
              </div>
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 active:opacity-50"><Trash2 size={20} /></button>
          </div>
        )})}
        {products.length === 0 && <div className="p-6 text-center text-[#8E8E93]">Нет товаров</div>}
      </div>
    </div>
  );
}