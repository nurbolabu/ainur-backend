'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Package, Search, Pencil, UploadCloud, Loader2 } from 'lucide-react';

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
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);

    if (uploadError) {
      alert('Ошибка при загрузке картинки: ' + uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
    setNewProduct({ ...newProduct, image_url: publicUrl });
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
    <div className="animate-in fade-in duration-300 px-1 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="ios-large-title mb-0">Каталог</h1>
        <button onClick={openAddModal} className="btn-primary !min-h-[44px] !h-[44px] !py-0 !px-5 !text-[15px]">
          <Plus size={20} className="mr-1" /> Добавить
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
        <input 
          className="w-full bg-[#FFFFFF] border border-[#E5E5EA] rounded-[14px] h-[48px] pl-12 pr-4 text-[17px] outline-none focus:border-[#8BFDA8] transition-colors"
          placeholder="Поиск по названию..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20 text-[#8E8E93]">Загрузка товаров...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="ios-module !mb-0 p-4 flex gap-4 relative">
              
              {/* Только кнопка редактирования */}
              <div className="absolute top-3 right-3">
                <button onClick={() => openEditModal(product)} className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center text-[#8E8E93] active:scale-95 transition-transform">
                  <Pencil size={14} />
                </button>
              </div>

              <div className="w-20 h-20 rounded-[12px] bg-[#F2F2F7] overflow-hidden shrink-0 border border-[#E5E5EA]">
                {product.image_url ? (
                  <img src={product.image_url.split(',')[0]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8E8E93]"><Package size={24} /></div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-0.5 pr-12">
                <div>
                  <h3 className="font-semibold text-[17px] text-[#000000] line-clamp-1">{product.name}</h3>
                  <p className="text-[13px] text-[#8E8E93] line-clamp-2 leading-snug">{product.description}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="font-bold text-[16px] text-[#34C759]">{product.price.toLocaleString()} ₸</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
             <div className="col-span-1 md:col-span-2 text-center text-[#8E8E93] py-10">Товары не найдены</div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] w-full max-w-[450px] rounded-[24px] overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6">
                <h2 className="ios-title-2">{isEditing ? 'Редактировать товар' : 'Новый товар'}</h2>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-[12px] bg-[#F2F2F7] border border-[#E5E5EA] flex items-center justify-center overflow-hidden shrink-0">
                       {isUploading ? <Loader2 className="animate-spin text-[#8E8E93]" size={20} /> :
                        newProduct.image_url ? <img src={newProduct.image_url} className="w-full h-full object-cover" /> : <Package size={24} className="text-[#C6C6C8]" />}
                     </div>
                     <label className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-[#F2F2F7] rounded-[12px] cursor-pointer text-[15px] font-medium text-[#000000] active:scale-95 transition-transform">
                       <UploadCloud size={18} /> {newProduct.image_url ? 'Заменить фото' : 'Загрузить фото'}
                       <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                     </label>
                   </div>

                   <input className="input-ios" placeholder="Название" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                   <textarea className="input-ios resize-none" rows={3} placeholder="Описание" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                   <input className="input-ios" placeholder="Цена (только цифры)" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                </div>
                
                {/* Кнопка удаления (показывается только при редактировании) */}
                {isEditing && (
                  <button 
                    onClick={() => { if(editId) { handleDelete(editId); setIsModalOpen(false); } }} 
                    className="w-full mt-6 h-[44px] rounded-[12px] bg-[#FF3B30]/10 text-[#FF3B30] font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <Trash2 size={18} /> Удалить товар
                  </button>
                )}
                
                <div className="flex gap-3 mt-6">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 h-[50px] rounded-[14px] font-semibold text-[#8E8E93] bg-[#F2F2F7] active:scale-95 transition-transform">Отмена</button>
                   <button onClick={handleSaveProduct} disabled={isUploading || !newProduct.name || !newProduct.price} className="flex-1 btn-primary disabled:opacity-50">Сохранить</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}