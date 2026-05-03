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
    if (confirm('Удалить стори?')) {
      await supabase.from('stories').delete().eq('id', id);
      fetchStories();
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center pr-4 md:pr-0">
        <h1 className="ios-title mt-4 mb-4">Stories</h1>
        <label className="btn-text mb-4 cursor-pointer flex items-center gap-1">
           {isUploading ? <Loader2 size={24} className="animate-spin"/> : <Plus size={28}/>}
           <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
        {stories.map((story) => (
          <div key={story.id} className="ios-bubble m-0 relative aspect-[9/16] bg-black">
            {story.media_url.includes('.mp4') ? <video src={story.media_url} className="w-full h-full object-cover" autoPlay muted loop playsInline /> : <img src={story.media_url} className="w-full h-full object-cover" alt=""/>}
            <button onClick={() => handleDelete(story.id)} className="absolute bottom-3 right-3 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-95"><Trash2 size={20} /></button>
          </div>
        ))}
        {stories.length === 0 && <div className="aspect-[9/16] bg-[#E3E3E8] rounded-[10px] flex items-center justify-center text-[#8E8E93] border border-[#C6C6C8]">Пусто</div>}
      </div>
    </div>
  );
}