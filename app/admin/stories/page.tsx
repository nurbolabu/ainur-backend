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
    <div className="animate-in fade-in duration-300 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="ios-large-title mb-0">Stories</h1>
        <label className="btn-main w-full md:w-auto cursor-pointer">
           {isUploading ? <Loader2 className="animate-spin text-black" size={20}/> : <Plus className="text-black" size={20}/>}
           {isUploading ? 'Загрузка...' : 'Загрузить'}
           <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
        {stories.map((s, index) => (
          <div key={s.id} className="ios-bubble !mb-0 aspect-[9/16] relative bg-[#000000]">
            {s.media_url.includes('.mp4') ? <video src={s.media_url} className="w-full h-full object-cover opacity-90" autoPlay muted loop /> : <img src={s.media_url} className="w-full h-full object-cover opacity-90"/>}
            <button onClick={() => handleDelete(s.id)} className="absolute top-3 right-3 w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:scale-105 transition-transform"><Trash2 size={20}/></button>
          </div>
        ))}
      </div>
    </div>
  );
}