'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Trash2, Plus, PlayCircle } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function StoriesPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [stories, setStories] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Безопасное получение ID только на клиенте (браузере)
  useEffect(() => {
    const id = localStorage.getItem('ainur_admin_project_id');
    if (id) {
      setProjectId(id);
      fetchStories(id);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchStories(id: string) {
    setIsLoading(true);
    const { data } = await supabase
      .from('stories')
      .select('*')
      .eq('project_id', id)
      .order('order_index', { ascending: true });
    
    if (data) setStories(data);
    setIsLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0 || !projectId) return;
    
    setIsUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `story_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    // ВАЖНО: Убедитесь, что бакет 'media' существует в Supabase и сделан Public
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
      await supabase.from('stories').insert([{ 
        project_id: projectId, 
        media_url: publicUrl, 
        order_index: stories.length 
      }]);
      fetchStories(projectId);
    } else {
      console.error("Upload error", error);
      alert("Ошибка при загрузке. Проверьте настройки бакета 'media' в Supabase.");
    }
    
    setIsUploading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Удалить эту историю?')) { 
      await supabase.from('stories').delete().eq('id', id); 
      if (projectId) fetchStories(projectId); 
    }
  }

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="ios-large-title mb-0">Истории</h1>
        
        {stories.length > 0 && (
          <label className="btn-primary cursor-pointer w-auto shadow-sm">
             {isUploading ? <Loader2 className="animate-spin mr-2" size={18}/> : <Plus className="mr-1" size={18}/>}
             <span className="hidden sm:inline">{isUploading ? 'Загрузка...' : 'Добавить'}</span>
             <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
          </label>
        )}
      </div>

      {isLoading ? (
         <div className="flex-1 flex items-center justify-center text-[#8E8E93]">Загрузка историй...</div>
      ) : stories.length === 0 ? (
         <div className="ios-module p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="w-16 h-16 bg-[#F2F2F7] rounded-full flex items-center justify-center text-[#8E8E93] mb-4">
              <PlayCircle size={32} />
            </div>
            <h3 className="ios-title-2 mb-2">Нет активных историй</h3>
            <p className="text-[15px] text-[#8E8E93] max-w-sm mb-6">Загрузите фото или видео, чтобы они появились в формате сторис в виджете на вашем сайте.</p>
            <label className="btn-primary cursor-pointer shadow-sm">
               {isUploading ? <Loader2 className="animate-spin mr-2" size={18}/> : <Plus className="mr-2" size={18}/>}
               {isUploading ? 'Загрузка...' : 'Добавить первую историю'}
               <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
            </label>
         </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[16px]">
          {stories.map((s, index) => {
            const isVideo = s.media_url.toLowerCase().includes('.mp4') || s.media_url.toLowerCase().includes('.mov');
            
            return (
              <div key={s.id} className="ios-module mb-0 aspect-[9/16] relative bg-[#E5E5EA] overflow-hidden group shadow-sm">
                {isVideo ? (
                  <video src={s.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                ) : (
                  <img src={s.media_url} className="w-full h-full object-cover"/>
                )}
                
                {/* Оверлей градиентом для читаемости бейджа и кнопки */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none"></div>
                
                <div className="absolute top-3 left-3 bg-[#FFFFFF]/90 backdrop-blur-md px-2.5 py-1 rounded-[8px] text-[#000000] text-[12px] font-bold shadow-sm">
                  #{index + 1}
                </div>
                
                <button onClick={() => handleDelete(s.id)} className="absolute bottom-3 right-3 w-9 h-9 bg-[#FFFFFF]/90 backdrop-blur-md rounded-[8px] flex items-center justify-center text-[#FF3B30] active:scale-95 transition-transform shadow-sm">
                   <Trash2 size={18}/>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}