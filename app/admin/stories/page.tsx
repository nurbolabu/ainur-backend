'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Trash2, Loader2, Upload } from 'lucide-react';

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
    const file = e.target.files[0];
    const fileName = `story_${Date.now()}_${Math.random()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (!error) {
      const publicUrl = supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl;
      await supabase.from('stories').insert([{ project_id: MY_PROJECT_ID, media_url: publicUrl, order_index: stories.length }]);
      fetchStories();
    }
    setIsUploading(false);
  }

  async function handleDelete(id: string) {
    if (confirm('Удалить эту сторис?')) {
      await supabase.from('stories').delete().eq('id', id);
      fetchStories();
    }
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <header className="mb-8 flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold tracking-tight">Stories</h1>
        <label className="btn-sec w-auto px-6 cursor-pointer">
           {isUploading ? <Loader2 size={24} className="animate-spin text-gray-400"/> : <Upload size={20}/>}
           {isUploading ? 'Загрузка...' : 'Загрузить файл'}
           <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-0">
        {stories.map(s => (
          <div key={s.id} className="ios-bubble aspect-[9/16] relative bg-black group m-0">
            {s.media_url.includes('.mp4') ? <video src={s.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : <img src={s.media_url} className="w-full h-full object-cover" alt=""/>}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => handleDelete(s.id)} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-95"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
        {stories.length === 0 && <div className="ios-bubble aspect-[9/16] flex flex-col items-center justify-center text-[#8E8E93] bg-[#EDEDED]">Пусто</div>}
      </div>
    </div>
  );
}