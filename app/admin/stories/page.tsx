'use client';
import { Plus } from 'lucide-react';

export default function StoriesPage() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center pr-4 md:pr-0">
        <h1 className="ios-title mt-4 mb-4">Stories</h1>
        <button className="text-[#007AFF] text-[17px] active:opacity-50 mb-4"><Plus size={24}/></button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
        <div className="aspect-[9/16] bg-[#E3E3E8] rounded-[10px] flex items-center justify-center text-[#8E8E93] border border-[#C6C6C8]">Пусто</div>
      </div>
    </div>
  );
}