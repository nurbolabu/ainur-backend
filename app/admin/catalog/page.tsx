'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Trash2, Edit } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image_urls: [] as string[] });

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').eq('project_id', MY_PROJECT_ID).order('created_at', { ascending: false });
    if (data) setProducts(data);
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
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 px-4 md:px-0">
        <h1 className="ios-large-title mb-0">Каталог</h1>
        {/* Кнопка стала компактной по высоте */}
        {!isAdding && !editId && (
          <button 
            onClick={() => { setIsAdding(true); setEditId(null); setNewProduct({ name: '', description: '', price: '', image_urls: [] }); }} 
            className="btn-primary w-auto !min-h-[40px] !h-[40px] !py-0 !px-5 !text-[15px] !rounded-[12px]"
          >
            Добавить
          </button>
        )}
      </div>

      {/* ФОРМА ДЛЯ НОВОГО ТОВАРА (сверху) */}
      {isAdding && !editId && (
        <div className="ios-module p-6 mx-4 md:mx-0">
          <h2 className="ios-title-2">Новый товар</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="input-ios" placeholder="Название товара" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
            <input className="input-ios" type="number" placeholder="Цена (₸)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
          </div>
          <textarea className="input-ios resize-none mb-6" rows={3} placeholder="Описание товара..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
          
          <h2 className="ios-section-header ml-0">Фотографии</h2>
          <div className="flex gap-4 mb-8 flex-wrap">
            {newProduct.image_urls.map((url, i) => (<img key={i} src={url} className="w-[80px] h-[80px] rounded-[16px] object-cover" />))}
            <label className="w-[80px] h-[80px] rounded-[16px] bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-center cursor-pointer">
              {isUploading ? <Loader2 className="animate-spin text-[#8E8E93]"/> : <span className="text-[24px] text-[#8E8E93]">+</span>}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>

          <div className="flex gap-4">
             <button className="btn-secondary w-auto" onClick={() => {setIsAdding(false); setEditId(null);}}>Отмена</button>
             <button className="btn-primary w-auto" onClick={handleSave}>Сохранить</button>
          </div>
        </div>
      )}

      {/* СЕТКА ТОВАРОВ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
        {products.map(p => {
          // ИНЛАЙН-РЕДАКТИРОВАНИЕ: Если мы редактируем ЭТОТ товар, карточка расширяется на всю ширину сетки
          if (editId === p.id) {
            return (
              <div key={p.id} className="ios-module p-6 mb-0 md:col-span-2 lg:col-span-3">
                <h2 className="ios-title-2">Редактировать товар</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input className="input-ios" placeholder="Название товара" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input className="input-ios" type="number" placeholder="Цена (₸)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <textarea className="input-ios resize-none mb-6" rows={3} placeholder="Описание товара..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                
                <h2 className="ios-section-header ml-0">Фотографии</h2>
                <div className="flex gap-4 mb-8 flex-wrap">
                  {newProduct.image_urls.map((url, i) => (<img key={i} src={url} className="w-[80px] h-[80px] rounded-[16px] object-cover" />))}
                  <label className="w-[80px] h-[80px] rounded-[16px] bg-[#F5F5F7] border border-[#E5E5EA] flex items-center justify-center cursor-pointer">
                    {isUploading ? <Loader2 className="animate-spin text-[#8E8E93]"/> : <span className="text-[24px] text-[#8E8E93]">+</span>}
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>

                <div className="flex gap-4">
                   <button className="btn-secondary w-auto" onClick={() => setEditId(null)}>Отмена</button>
                   <button className="btn-primary w-auto" onClick={handleSave}>Сохранить</button>
                </div>
              </div>
            );
          }

          // ОБЫЧНАЯ КАРТОЧКА ТОВАРА
          const img = p.image_url ? p.image_url.split(',')[0] : '';
          return (
          <div key={p.id} className="ios-module mb-0 flex flex-col">
            <div className="h-[200px] bg-[#F5F5F7] relative">
               {img && <img src={img} className="w-full h-full object-cover" />}
            </div>
            <div className="p-5 flex-1">
              <h3 className="text-[17px] font-semibold text-[#000000] line-clamp-1">{p.name}</h3>
              <p className="text-[15px] text-[#8E8E93] mt-1 line-clamp-2">{p.description}</p>
              <div className="text-[20px] font-bold mt-4 text-[#000000]">{Number(p.price).toLocaleString()} ₸</div>
            </div>
            <div className="flex items-center gap-3 p-4 pt-0">
               <button 
                 onClick={() => {
                   setEditId(p.id); 
                   setIsAdding(false); 
                   setNewProduct({...p, image_urls: p.image_url ? p.image_url.split(',') : []}); 
                 }} 
                 className="flex-1 h-[44px] bg-[#F5F5F7] rounded-[14px] flex items-center justify-center gap-2 text-[#000000] font-medium text-[15px] transition-colors active:bg-[#E5E5EA]"
               >
                 <Edit size={18}/> Редактировать
               </button>
               <button 
                 onClick={() => handleDelete(p.id)} 
                 className="w-[44px] h-[44px] bg-[#F5F5F7] rounded-[14px] flex items-center justify-center text-red-500 shrink-0 transition-colors active:bg-[#E5E5EA]"
               >
                 <Trash2 size={20}/>
               </button>
            </div>
          </div>
        )})}
      </div>
    </div>
  );
}