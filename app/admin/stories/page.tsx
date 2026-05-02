'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trash2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);
const MY_PROJECT_ID = '8c49172a-333f-4708-ad0c-f08d70045891';

export default function StoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUrl, setNewUrl] = useState('');

  async function fetchStories() {
    setIsLoading(true);
    const { data } = await supabase.from('stories').select('*').eq('project_id', MY_PROJECT_ID).order('order_index', { ascending: true });
    if (data) setStories(data);
    setIsLoading(false);
  }
  useEffect(() => { fetchStories(); }, []);

  async function handleAddStory() {
    if (!newUrl) return;
    const { error } = await supabase.from('stories').insert([{ project_id: MY_PROJECT_ID, media_url: newUrl, order_index: stories.length }]);
    if (error) alert('Ошибка добавления (проверьте RLS в Supabase!): ' + error.message);
    else { setNewUrl(''); fetchStories(); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить стори?')) return;
    await supabase.from('stories').delete().eq('id', id);
    fetchStories();
  }

  if (isLoading) return <div className="p-8 text-gray-500">Загрузка...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8"><h1 className="text-3xl font-bold text-gray-900 tracking-tight">Управление Stories</h1></header>
      <div className="bg-white/80 border p-6 rounded-[24px] shadow-sm mb-8 flex gap-4">
        <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} className="flex-grow px-4 py-3 rounded-xl bg-gray-50 border outline-none" placeholder="Ссылка на фото или видео (https://...)" />
        <button onClick={handleAddStory} className="bg-[#8BFDA8] text-black font-bold px-6 rounded-xl hover:scale-95 transition-all">Добавить</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {stories.map((story, idx) => (
          <div key={story.id} className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden group">
            {story.media_url.includes('.mp4') ? <video src={story.media_url} className="w-full h-full object-cover opacity-80" autoPlay muted loop /> : <img src={story.media_url} className="w-full h-full object-cover opacity-80" alt=""/>}
            <button onClick={() => handleDelete(story.id)} className="absolute bottom-2 right-2 w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-105"><Trash2 size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}