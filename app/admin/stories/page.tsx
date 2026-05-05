'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Trash2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  async function fetchStories() {
    const { data } = await supabase.from('stories').select('*').eq('project_id', MY_PROJECT_ID).order('order_index', { ascending: true });
    if (data) setStories(data);
  }
  useEffect(() => { fetchStories(); }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const fileName = `story_${Date.now()}_${Math.random()}.${e.target.files[0].name.split('.').pop()}`;
    const { error } = await supabase.storage.from('media').upload(fileName, e.target.files[0]);
    if (!error) {
      await supabase.from('stories').insert([{ project_id: MY_PROJECT_ID, media_url: supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl, order_index: stories.length }]);
      fetchStories();
    }
    setIsUploading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Удалить эту историю?')) { await supabase.from('stories').delete().eq('id', id); fetchStories(); }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6 px-1 md:px-0">
        <h1 className="ios-large-title mb-0">Stories</h1>
        <label className="btn-primary w-auto cursor-pointer !min-h-[44px] !h-[44px] !py-0 !px-5 !text-[15px]">
           {isUploading ? <Loader2 className="animate-spin" size={18}/> : null} Загрузить 
           <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] px-1 md:px-0">
        {stories.map((s, index) => (
          <div key={s.id} className="ios-module mb-0 aspect-[9/16] relative bg-[#E5E5EA] overflow-hidden group">
            {s.media_url.includes('.mp4') ? <video src={s.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : <img src={s.media_url} className="w-full h-full object-cover"/>}
            
            {/* Оверлей градиентом для читаемости бейджа */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30"></div>
            
            <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1 rounded-[8px] text-[#000000] text-[13px] font-bold">#{index + 1}</div>
            
            <button onClick={() => handleDelete(s.id)} className="absolute bottom-4 right-4 w-10 h-10 bg-[#FFFFFF]/90 backdrop-blur-md rounded-full flex items-center justify-center text-[#FF3B30] active:scale-95 transition-transform">
               <Trash2 size={20}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}