'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Package, Search, Pencil, UploadCloud, Loader2, Settings } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function CatalogPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image_url: '' });

  useEffect(() => {
    const id = localStorage.getItem('ainur_admin_project_id');
    if (id) {
      setProjectId(id);
      fetchProducts(id);
    }
  }, []);

  async function fetchProducts(id: string) {
    setIsLoading(true);
    const { data } = await supabase.from('products').select('*').eq('project_id', id).order('created_at', { ascending: false });
    if (data) setProducts(data);
    setIsLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage.from('products').upload(fileName, file);

    if (uploadError) {
      alert('Ошибка при загрузке картинки: ' + uploadError.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
      setNewProduct({ ...newProduct, image_url: publicUrl });
    }
    setIsUploading(false);
  }

  function openAddModal() {
    setIsEditing(false);
    setEditId(null);
    setNewProduct({ name: '', description: '', price: '', image_url: '' });
    setIsModalOpen(true);
  }

  function openEditModal(product: any) {
    setIsEditing(true);
    setEditId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      image_url: product.image_url || ''
    });
    setIsModalOpen(true);
  }

  async function handleSaveProduct() {
    if (!projectId) return;
    
    if (isEditing && editId) {
      const { error } = await supabase.from('products').update({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        image_url: newProduct.image_url
      }).eq('id', editId);
      
      if (!error) {
        setIsModalOpen(false);
        fetchProducts(projectId);
      }
    } else {
      const { error } = await supabase.from('products').insert([{ 
        ...newProduct, 
        project_id: projectId,
        price: parseFloat(newProduct.price) 
      }]);
      
      if (!error) {
        setIsModalOpen(false);
        fetchProducts(projectId);
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    await supabase.from('products').delete().eq('id', id);
    if (projectId) fetchProducts(projectId);
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full max-w-[690px] mx-auto px-[17px] md:px-0 pt-[100px] animate-in fade-in duration-300 flex flex-col gap-6 pb-[100px]">
      
      {/* 1. ФИКСИРОВАННЫЙ HEADER */}
      <div className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[calc(100%-34px)] md:w-full max-w-[690px] z-40 bg-[#FFFFFF] rounded-[22px] flex items-center justify-between pl-[20px] pr-[10px] py-[10px] border border-[#E5E5EA]">
        <Link href="/admin">
          <svg width="99" height="14" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="black"/>
            <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="black"/>
            <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="black"/>
            <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
          </svg>
        </Link>
        <Link href="/admin/settings" className="w-[50px] h-[50px] shrink-0 bg-[#8BFDA8] rounded-[11px] flex items-center justify-center active:scale-95 transition-transform">
          <Settings size={24} strokeWidth={1.5} className="text-[#000000]" />
        </Link>
      </div>

      {/* 2. ЗАГОЛОВОК СТРАНИЦЫ И ПОИСК */}
      <div className="flex flex-col gap-4 px-1 mt-2">
        <div className="flex justify-between items-center">
          <h1 className="text-[28px] font-bold text-[#000000]">Каталог</h1>
          <button onClick={openAddModal} className="bg-[#000000] text-[#FFFFFF] rounded-[11px] px-5 py-3 font-medium text-[14px] flex items-center gap-1 active:scale-95 transition-transform">
            <Plus size={18} strokeWidth={1.5} /> Добавить
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} strokeWidth={1.5} />
          <input 
            className="w-full bg-[#FFFFFF] border border-[#E5E5EA] rounded-[16px] h-[50px] pl-12 pr-4 text-[15px] outline-none focus:border-[#8BFDA8] transition-colors"
            placeholder="Поиск по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 3. СЕТКА КАРТОЧЕК ТОВАРОВ (1 в ряд на мобилках, 2 на ПК) */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#8E8E93]" size={32} strokeWidth={1.5} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-4 flex gap-4 relative">
              
              <button onClick={() => openEditModal(product)} className="absolute top-4 right-4 w-8 h-8 rounded-[10px] bg-[#F2F2F7] flex items-center justify-center text-[#000000] active:scale-95 transition-transform">
                <Pencil size={14} strokeWidth={1.5} />
              </button>

              <div className="w-24 h-24 rounded-[16px] bg-[#F2F2F7] overflow-hidden shrink-0">
                {product.image_url ? (
                  <img src={product.image_url.split(',')[0]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8E8E93]">
                    <Package size={24} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1 pr-10">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold text-[16px] text-[#000000] line-clamp-1">{product.name}</h3>
                  <p className="text-[13px] text-[#8E8E93] line-clamp-2 leading-snug">{product.description}</p>
                </div>
                <div className="font-bold text-[18px] text-[#000000]">{product.price.toLocaleString()} ₸</div>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
             <div className="col-span-1 md:col-span-2 text-center text-[#8E8E93] py-10 bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px]">Товары не найдены</div>
          )}
        </div>
      )}

      {/* 4. МОДАЛЬНОЕ ОКНО СОЗДАНИЯ/РЕДАКТИРОВАНИЯ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[450px] rounded-[22px] overflow-hidden border border-[#E5E5EA] animate-in zoom-in-95 duration-200 p-6 flex flex-col gap-6">
             
             <h2 className="text-[20px] font-bold text-[#000000]">{isEditing ? 'Редактировать товар' : 'Новый товар'}</h2>
             
             <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[14px] bg-[#F2F2F7] border border-[#E5E5EA] flex items-center justify-center overflow-hidden shrink-0">
                    {isUploading ? <Loader2 className="animate-spin text-[#8E8E93]" size={20} strokeWidth={1.5} /> :
                     newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <Package size={24} strokeWidth={1.5} className="text-[#C6C6C8]" />}
                  </div>
                  <label className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-[#F2F2F7] rounded-[12px] cursor-pointer text-[14px] font-medium text-[#000000] active:scale-95 transition-transform">
                    <UploadCloud size={18} strokeWidth={1.5} /> {newProduct.image_url ? 'Заменить фото' : 'Загрузить фото'}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                  </label>
                </div>

                <input className="input-ios" placeholder="Название" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <textarea className="input-ios resize-none h-[100px]" placeholder="Описание" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                <input className="input-ios" placeholder="Цена (например: 15000)" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
             </div>
             
             {isEditing && (
               <button onClick={() => { if(editId) { handleDelete(editId); setIsModalOpen(false); } }} className="w-full h-[44px] rounded-[12px] bg-[#FF3B30]/10 text-[#FF3B30] font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
                 <Trash2 size={18} strokeWidth={1.5} /> Удалить товар
               </button>
             )}
             
             <div className="flex gap-2.5">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 h-[50px] rounded-[12px] font-medium text-[#000000] bg-[#F2F2F7] active:scale-95 transition-transform">Отмена</button>
                <button onClick={handleSaveProduct} disabled={isUploading || !newProduct.name || !newProduct.price} className="flex-1 h-[50px] rounded-[12px] font-medium text-[#000000] bg-[#8BFDA8] disabled:opacity-50 active:scale-95 transition-transform">Сохранить</button>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}