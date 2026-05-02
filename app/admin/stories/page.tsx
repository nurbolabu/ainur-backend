'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2, Upload, Loader2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  async function fetchStories() {
    setIsLoading(true);
    const { data } = await supabase.from('stories').select('*').eq('project_id', MY_PROJECT_ID).order('order_index', { ascending: true });
    if (data) setStories(data);
    setIsLoading(false);
  }
  useEffect(() => { fetchStories(); }, []);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `story_${Date.now()}_${Math.random()}.${fileExt}`;
    
    const { error } = await supabase.storage.from('media').upload(fileName, file);
    if (!error) {
      const { data } = supabase.storage.from('media').getPublicUrl(fileName);
      await supabase.from('stories').insert([{ project_id: MY_PROJECT_ID, media_url: data.publicUrl, order_index: stories.length }]);
      fetchStories();
    } else {
      alert("Ошибка: " + error.message);
    }
    setIsUploading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить стори?')) return;
    await supabase.from('stories').delete().eq('id', id);
    fetchStories();
  }

  if (isLoading) return <div className="p-8 text-gray-500">Загрузка...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div><h1 className="text-3xl font-bold text-gray-900 tracking-tight">Управление Stories</h1></div>
        
        <label className="bg-[#8BFDA8] text-black font-semibold px-5 py-2.5 rounded-xl shadow-sm hover:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer">
          {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
          {isUploading ? 'Загрузка...' : 'Загрузить файл'}
          <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
        </label>
      </header>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stories.map((story, idx) => (
          <div key={story.id} className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden group">
            {story.media_url.includes('.mp4') || story.media_url.includes('.mov') ? <video src={story.media_url} className="w-full h-full object-cover opacity-80" autoPlay muted loop /> : <img src={story.media_url} className="w-full h-full object-cover opacity-80" alt=""/>}
            <button onClick={() => handleDelete(story.id)} className="absolute bottom-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}