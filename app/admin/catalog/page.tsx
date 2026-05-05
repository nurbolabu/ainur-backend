'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Trash2, Edit, Plus, Image as ImageIcon, X } from 'lucide-react';

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
    const uploadedUrls: string[] = [];
    for (const file of Array.from(e.target.files)) {
      const fileName = `${Date.now()}_${Math.random()}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file);
      if (!error) uploadedUrls.push(supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl);
    }
    setNewProduct(prev => ({ ...prev, image_urls: [...prev.image_urls, ...uploadedUrls] }));
    setIsUploading(false);
  }

  function removeUploadedImage(index: number) {
    setNewProduct(prev => ({ ...prev, image_urls: prev.image_urls.filter((_, i) => i !== index) }));
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
    if (confirm('Точно удалить этот товар?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  }

  if (isLoading) return <div className="p-8 text-gray-500 font-bold text-center">Загрузка каталога...</div>;

  return (
    <div className="animate-in fade-in duration-300 w-full">
      
      {/* ШАПКА - Стандартный дизайн без хаков с leading-none */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="ios-large-title mb-0">Каталог</h1>
        {!isAdding && !editId && (
          <button 
            onClick={() => { setIsAdding(true); setEditId(null); setNewProduct({ name: '', description: '', price: '', image_urls: [] }); }} 
            className="btn-main w-full md:w-auto"
          >
            <Plus size={20} className="text-black" /> Добавить
          </button>
        )}
      </div>

      {/* Форма добавления нового товара */}
      {isAdding && !editId && (
        <div className="ios-module p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6">Новый товар</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="input-ios" placeholder="Название (например: Лендинг)" />
            <input type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="input-ios" placeholder="Цена (₸)" />
          </div>
          <textarea rows={4} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="input-ios resize-none mb-8" placeholder="Подробное описание товара..."></textarea>

          <div className="mb-8">
            <label className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Фотографии</label>
            <div className="flex flex-wrap gap-4 items-start">
              {newProduct.image_urls.map((url, i) => (
                <div key={i} className="relative w-24 h-24 rounded-[16px] border border-gray-200 overflow-hidden group">
                  <img src={url} className="w-full h-full object-cover" alt="" />
                  <button onClick={() => removeUploadedImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"><X size={14}/></button>
                </div>
              ))}
              <label className="w-24 h-24 flex flex-col items-center justify-center bg-[#F2F2F7] border-2 border-dashed border-gray-300 rounded-[16px] cursor-pointer hover:bg-gray-200 transition-colors">
                {isUploading ? <Loader2 className="animate-spin text-gray-400" size={24}/> : <Plus className="text-gray-400" size={24} />}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading}/>
              </label>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-end pt-6 border-t border-gray-100">
            <button onClick={() => {setIsAdding(false); setEditId(null); setNewProduct({name:'', description:'', price:'', image_urls:[]})}} className="btn-sec w-full md:w-auto">Отмена</button>
            <button onClick={handleSave} className="btn-main w-full md:w-auto">Сохранить</button>
          </div>
        </div>
      )}

      {/* Сетка товаров (с режимом In-line редактирования) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] mb-8">
        {products.map(p => {
          
          if (editId === p.id) {
            return (
              <div key={p.id} className="ios-module p-6 md:p-8 mb-0 md:col-span-2 lg:col-span-3">
                <h2 className="text-2xl font-bold mb-6">Редактировать товар</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input className="input-ios" placeholder="Название товара" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  <input className="input-ios" type="number" placeholder="Цена (₸)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                <textarea className="input-ios resize-none mb-8" rows={4} placeholder="Описание товара..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                
                <div className="mb-8">
                  <h2 className="block text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Фотографии</h2>
                  <div className="flex gap-4 flex-wrap">
                    {newProduct.image_urls.map((url, i) => (
                      <div key={i} className="relative w-24 h-24 rounded-[16px] border border-gray-200 overflow-hidden">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => removeUploadedImage(i)} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"><X size={14}/></button>
                      </div>
                    ))}
                    <label className="w-24 h-24 rounded-[16px] bg-[#F2F2F7] border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                      {isUploading ? <Loader2 className="animate-spin text-gray-400" size={24}/> : <Plus className="text-gray-400" size={24} />}
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading}/>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-end pt-6 border-t border-gray-100">
                   <button className="btn-sec w-full md:w-auto" onClick={() => setEditId(null)}>Отмена</button>
                   <button className="btn-main w-full md:w-auto" onClick={handleSave}>Сохранить</button>
                </div>
              </div>
            );
          }

          const img = p.image_url ? p.image_url.split(',')[0] : '';
          return (
          <div key={p.id} className="ios-module mb-0 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="h-[220px] w-full bg-[#F2F2F7] relative border-b border-gray-100 flex items-center justify-center">
               {img ? <img src={img} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={56}/>}
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center">
              <h3 className="text-[17px] font-semibold text-black line-clamp-1">{p.name}</h3>
              <p className="text-[15px] text-gray-500 mt-1 line-clamp-2">{p.description}</p>
              <div className="text-[20px] font-bold mt-3 text-black">{Number(p.price).toLocaleString()} ₸</div>
            </div>
            <div className="flex items-center gap-3 p-4 pt-0">
               <button 
                 onClick={() => {
                   setEditId(p.id); 
                   setIsAdding(false); 
                   setNewProduct({...p, image_urls: p.image_url ? p.image_url.split(',') : []}); 
                 }} 
                 className="flex-1 h-[44px] bg-[#F5F5F7] rounded-[14px] flex items-center justify-center gap-2 text-black font-medium text-[15px] transition-colors active:bg-[#E5E5EA]"
               >
                 <Edit size={18}/> Редактировать
               </button>
               <button 
                 onClick={() => handleDelete(p.id)} 
                 className="w-[44px] h-[44px] bg-[#F5F5F7] rounded-[14px] flex items-center justify-center text-red-500 shrink-0 transition-colors active:bg-red-50"
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