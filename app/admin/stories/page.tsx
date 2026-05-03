'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Trash2, Plus } from 'lucide-react';

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
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center pr-4 md:pr-0 mb-4">
        <h1 className="ios-large-title mb-0 mt-4">Stories</h1>
        <label className="btn-text cursor-pointer">
           {isUploading ? <Loader2 size={20} className="animate-spin text-black"/> : <Plus size={20}/>}
           {isUploading ? 'Идет загрузка' : 'Загрузить'}
           <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 ios-bubble-margin">
        {stories.map(s => (
          <div key={s.id} className="ios-bubble mb-0 aspect-[9/16] relative bg-black">
            {s.media_url.includes('.mp4') ? <video src={s.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : <img src={s.media_url} className="w-full h-full object-cover" alt=""/>}
            <button onClick={() => handleDelete(s.id)} className="absolute top-3 right-3 w-[40px] h-[40px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white"><Trash2 size={20} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}