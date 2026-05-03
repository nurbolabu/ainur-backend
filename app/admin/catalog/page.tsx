'use client';
import { useState } from 'react';
import { Plus, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function CatalogPage() {
  const [isAdding, setIsAdding] = useState(false);
  const products = [{ id: '1', name: 'Создание Лендинга', price: 150000 }];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center pr-4 md:pr-0">
        <h1 className="ios-title mt-4 mb-4">Каталог</h1>
        {!isAdding && <button onClick={() => setIsAdding(true)} className="text-[#007AFF] text-[17px] active:opacity-50 mb-4"><Plus size={24}/></button>}
      </div>

      {isAdding && (
        <div className="mx-4 md:mx-0 mb-8">
          <div className="ios-list mb-4">
            <div className="p-2 border-b border-[#E5E5EA]"><input className="input-ios" placeholder="Название" /></div>
            <div className="p-2"><input className="input-ios" type="number" placeholder="Цена (₸)" /></div>
          </div>
          <div className="flex gap-3">
             <button className="btn-secondary" onClick={() => setIsAdding(false)}>Отмена</button>
             <button className="btn-primary">Сохранить</button>
          </div>
        </div>
      )}

      <div className="ios-list">
        {products.map(p => (
          <button key={p.id} className="ios-list-item flex items-center gap-3">
            <div className="w-12 h-12 bg-[#F2F2F7] rounded-[8px] flex items-center justify-center shrink-0"><ImageIcon size={20} className="text-[#C7C7CC]"/></div>
            <div className="flex-1 text-left">
              <div className="ios-list-text">{p.name}</div>
              <div className="text-[15px] text-[#8E8E93] mt-0.5">{p.price.toLocaleString()} ₸</div>
            </div>
            <ChevronRight size={20} className="text-[#C7C7CC]" />
          </button>
        ))}
      </div>
    </div>
  );
}