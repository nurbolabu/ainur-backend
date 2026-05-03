'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Loader2, Upload } from 'lucide-react';

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
    <div className="animate-in fade-in duration-500 w-full pb-20">
      <header className="mb-8 flex justify-between items-center px-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-400">Stories</h1>
        <label className="btn-main cursor-pointer">
           {isUploading ? <Loader2 size={20} className="animate-spin"/> : <Upload size={20}/>}
           <span className="hidden md:block">{isUploading ? 'Загрузка...' : 'Добавить Story'}</span>
           <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stories.map(s => (
          <div key={s.id} className="card-ios aspect-[9/16] relative bg-black group m-0">
            {s.media_url.includes('.mp4') ? <video src={s.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : <img src={s.media_url} className="w-full h-full object-cover" alt=""/>}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => handleDelete(s.id)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 shadow-lg hover:scale-105 active:scale-95"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}