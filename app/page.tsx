'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, LayoutGrid, ShoppingBag, ListOrdered, CheckCircle2, PlaySquare, ArrowRight } from 'lucide-react';

export default function MobileLandingPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden flex justify-center">
      
      {/* ФОН: Градиент + Сетка из точек (шаг 8px) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#181818] via-black to-[#2B2B2B]"></div>
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{ 
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1.5px, transparent 1.5px)', 
          backgroundSize: '8px 8px' 
        }}
      ></div>

      {/* АНИМАЦИИ */}
      <style dangerouslySetInnerHTML={{__html: `
        .anim-slide-up { animation: slideUp 4s infinite cubic-bezier(0.16, 1, 0.3, 1); transform-origin: bottom center; }
        .anim-pulse-glow { animation: pulseGlow 3s infinite alternate; }
        .anim-spin-grad { animation: spinGrad 4s linear infinite; }
        .anim-scroll-y { animation: scrollY 6s infinite linear; }
        
        @keyframes slideUp {
          0%, 10% { transform: translateY(100px); opacity: 0; }
          20%, 80% { transform: translateY(0); opacity: 1; }
          90%, 100% { transform: translateY(100px); opacity: 0; }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 10px rgba(139,253,168,0.2); }
          100% { box-shadow: 0 0 25px rgba(139,253,168,0.6); }
        }
        @keyframes spinGrad { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
        @keyframes scrollY {
          0%, 10% { transform: translateY(0); }
          45%, 55% { transform: translateY(-40px); }
          90%, 100% { transform: translateY(0); }
        }
      `}} />

      {/* ГЛАВНЫЙ КОНТЕЙНЕР (Мобильная ширина) */}
      <div className="relative z-10 w-full max-w-[430px] px-6 pt-12 pb-24 flex flex-col">
        
        {/* ХЕДЕР (Закрепленный) */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-center pointer-events-none">
          <div className="w-full max-w-[430px] px-6 py-4 flex justify-between items-center pointer-events-auto backdrop-blur-md bg-black/40 border-b border-white/5">
            <span className="font-black text-xl tracking-tighter">AI NUR</span>
            <Link href="/login" className="bg-[#1A1A1A] border border-white/10 text-white text-xs font-semibold px-4 py-2 rounded-full">
              Войти
            </Link>
          </div>
        </header>

        {/* HERO SECTION */}
        <div className="mt-16 mb-10 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold uppercase tracking-tight leading-snug mb-4">
            Превращаем сайты <br/>в диалог с клиентами
          </h1>
          <p className="text-[15px] text-white/80 font-medium leading-relaxed max-w-[300px]">
            AI NUR — это современный способ быстро превратить любой сайт в диалог с клиентом
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 w-full">
            <Link href="/login" className="flex-1 bg-[#8BFDA8] text-black font-semibold py-3.5 rounded-full text-sm hover:scale-[1.02] transition-transform flex justify-center items-center">
              Зарегистрироваться
            </Link>
            <Link href="/login" className="flex-1 border border-[#8BFDA8] text-[#8BFDA8] font-semibold py-3.5 rounded-full text-sm hover:bg-[#8BFDA8]/10 transition-colors flex justify-center items-center">
              Войти
            </Link>
          </div>
        </div>

        {/* НАВИГАЦИОННЫЕ ПИЛЛЫ */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <div className="bg-[#8BFDA8] text-black px-4 py-1.5 rounded-full text-xs font-semibold border border-[#8BFDA8]">Чат с ИИ</div>
          <div className="border border-[#8BFDA8] text-white px-4 py-1.5 rounded-full text-xs font-medium">Stories</div>
          <div className="border border-[#8BFDA8] text-white px-4 py-1.5 rounded-full text-xs font-medium">Каталог</div>
          <div className="border border-[#8BFDA8] text-white px-4 py-1.5 rounded-full text-xs font-medium">Заявки</div>
        </div>

        {/* ========================================= */}
        {/* КАРТОЧКА 1: ЧАТ */}
        {/* ========================================= */}
        <div className="bg-black rounded-[22px] border border-[#4D4D4D] overflow-hidden mb-6 relative">
          <div className="h-[220px] relative flex justify-center items-end pb-0 bg-gradient-to-b from-[#181818] to-black border-b border-[#333]">
            {/* Анимация чата */}
            <div className="anim-slide-up w-[260px] bg-[#111] rounded-t-[30px] border-t border-l border-r border-[#333] p-4 flex flex-col gap-3 relative z-10 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
               <div className="self-end bg-[#8BFDA8] text-black text-[11px] px-3 py-2 rounded-2xl rounded-br-sm font-semibold max-w-[80%]">
                 Как быстро настроить?
               </div>
               <div className="self-start bg-[#2C2C2E] text-white text-[11px] px-3 py-2 rounded-2xl rounded-bl-sm font-medium leading-relaxed max-w-[90%]">
                 Всего пара кликов! Я уже готов продавать ваши товары.
               </div>
               {/* Имитация инпута */}
               <div className="w-full bg-[#1A1A1A] rounded-full h-8 border border-[#333] mt-2 flex items-center px-3 gap-2">
                 <div className="flex-1 h-2 bg-[#333] rounded-full"></div>
                 <div className="w-5 h-5 bg-[#8BFDA8] rounded-full flex items-center justify-center">
                    <ArrowRight size={10} color="black" strokeWidth={3} />
                 </div>
               </div>
            </div>
          </div>
          <div className="p-6 text-center flex flex-col items-center">
            <h3 className="text-[20px] font-bold text-white/80 mb-3 leading-tight">Закрепленный чат<br/>внизу экрана</h3>
            <p className="text-[13px] text-white/60 leading-relaxed">
              Знакомый интерфейс мессенджера на любом сайте. Искусственный интеллект ответит на любые вопросы клиента.
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* КАРТОЧКА 2: МЕНЮ */}
        {/* ========================================= */}
        <div className="bg-black rounded-[22px] border border-[#4D4D4D] overflow-hidden mb-6">
          <div className="p-6 text-center flex flex-col items-center border-b border-[#333]">
            <h3 className="text-[20px] font-bold text-white/80 mb-3 leading-tight">Функциональное меню</h3>
            <p className="text-[13px] text-white/60 leading-relaxed mb-6">
              В одном меню есть все важные функции, чтобы клиент всегда нашел нужное
            </p>
            {/* Меню UI */}
            <div className="w-full bg-[#111] rounded-2xl border border-[#333] p-2 flex justify-around">
               <div className="flex flex-col items-center gap-1.5 p-2 bg-[#1A1A1A] rounded-xl border border-[#333] w-[30%]">
                 <MessageSquare size={18} className="text-[#8BFDA8]" />
                 <span className="text-[9px] font-semibold text-white/80">Чат</span>
               </div>
               <div className="flex flex-col items-center gap-1.5 p-2 w-[30%]">
                 <ShoppingBag size={18} className="text-white/40" />
                 <span className="text-[9px] font-semibold text-white/40">Корзина</span>
               </div>
               <div className="flex flex-col items-center gap-1.5 p-2 w-[30%]">
                 <ListOrdered size={18} className="text-white/40" />
                 <span className="text-[9px] font-semibold text-white/40">Заявка</span>
               </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-5 bg-[#0A0A0A]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border border-[#8BFDA8] flex items-center justify-center anim-pulse-glow">
                <div className="w-1.5 h-1.5 bg-[#8BFDA8] rounded-full"></div>
              </div>
              <span className="text-xs font-semibold text-white">Работает 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs font-semibold text-white">Конверсия <span className="text-[#8BFDA8]">x2</span></div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* КАРТОЧКА 3: STORIES */}
        {/* ========================================= */}
        <div className="bg-black rounded-[22px] border border-[#4D4D4D] overflow-hidden mb-6">
          <div className="h-[200px] flex items-center justify-center relative bg-gradient-to-b from-[#181818] to-[#0A0A0A] border-b border-[#333]">
             {/* Кружок Stories */}
             <div className="relative w-20 h-20 flex-shrink-0 z-10 border border-zinc-800 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-2xl">
                <svg className="anim-spin-grad absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                   <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8BFDA8"/><stop offset="100%" stopColor="#61D6FB"/></linearGradient></defs>
                   <circle cx="30" cy="30" r="27" stroke="url(#g1)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="50 15" />
                </svg>
                <PlaySquare size={20} className="text-white/60 ml-0.5" />
             </div>
             {/* Тени для красоты */}
             <div className="absolute w-32 h-32 bg-[#8BFDA8] rounded-full blur-[60px] opacity-10"></div>
          </div>
          <div className="p-6 text-center flex flex-col items-center">
            <h3 className="text-[20px] font-bold text-white mb-3 leading-tight"><span className="text-[#8BFDA8]">Stories</span> в виджете</h3>
            <p className="text-[13px] text-white/60 leading-relaxed mb-5">
              Все любят stories и теперь они будут у вас на сайте. Быстро делитесь новостями и акциями.
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* КАРТОЧКА 4: КАТАЛОГ (НОВАЯ) */}
        {/* ========================================= */}
        <div className="bg-black rounded-[22px] border border-[#4D4D4D] overflow-hidden mb-12">
          <div className="h-[220px] flex items-center justify-center relative bg-gradient-to-b from-[#181818] to-black border-b border-[#333] overflow-hidden">
             {/* Анимация скролла каталога */}
             <div className="anim-scroll-y w-[220px] flex flex-col gap-3">
               {[1,2].map((i) => (
                 <div key={i} className="bg-[#111] border border-[#333] rounded-2xl p-3 flex gap-3 items-center">
                   <div className="w-14 h-14 bg-[#222] rounded-xl flex-shrink-0 flex items-center justify-center">
                     <LayoutGrid size={16} className="text-white/20" />
                   </div>
                   <div className="flex flex-col gap-1.5 flex-1">
                     <div className="h-2 w-full bg-[#333] rounded"></div>
                     <div className="h-2 w-1/2 bg-[#333] rounded"></div>
                     <div className="mt-1 h-6 w-full bg-[#8BFDA8]/10 border border-[#8BFDA8]/30 rounded-lg flex items-center justify-center">
                       <span className="text-[9px] text-[#8BFDA8] font-bold">В корзину</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
          <div className="p-6 text-center flex flex-col items-center">
            <h3 className="text-[20px] font-bold text-white mb-3 leading-tight"><span className="text-[#8BFDA8]">Каталог</span> товаров</h3>
            <p className="text-[13px] text-white/60 leading-relaxed">
              Клиентам не нужно искать товары на сайте. Удобная корзина и оформление прямо в виджете.
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* ВЕРТИКАЛЬНАЯ ЛИНИЯ ПРЕИМУЩЕСТВ */}
        {/* ========================================= */}
        <div className="relative pl-8 pb-10">
           {/* Вертикальная серая линия */}
           <div className="absolute left-[11px] top-2 bottom-0 w-[1px] bg-white/20"></div>

           <div className="relative mb-10">
              {/* Кружок на линии */}
              <div className="absolute -left-[28.5px] top-0 w-[22px] h-[22px] rounded-full border-[1.5px] border-[#8BFDA8] bg-black flex items-center justify-center">
                <CheckCircle2 size={12} className="text-[#8BFDA8]" />
              </div>
              <h4 className="text-[16px] font-bold text-white mb-2 leading-none">Прогревает клиента</h4>
              <p className="text-[13px] text-white/60 leading-relaxed">
                Сторис постепенно раскрывают ценность компании и подводят к покупке без давления.
              </p>
           </div>

           <div className="relative mb-10">
              <div className="absolute -left-[28.5px] top-0 w-[22px] h-[22px] rounded-full border-[1.5px] border-[#8BFDA8] bg-black flex items-center justify-center">
                <CheckCircle2 size={12} className="text-[#8BFDA8]" />
              </div>
              <h4 className="text-[16px] font-bold text-white mb-2 leading-none">Увеличивает доверие</h4>
              <p className="text-[13px] text-white/60 leading-relaxed">
                Быстрые точные ответы ИИ и визуальный контент формируют надежный образ бренда.
              </p>
           </div>

           <div className="relative">
              <div className="absolute -left-[28.5px] top-0 w-[22px] h-[22px] rounded-full border-[1.5px] border-white bg-black flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
              <h4 className="text-[16px] font-bold text-white mb-2 leading-none">Повышает конверсию</h4>
              <p className="text-[13px] text-white/60 leading-relaxed">
                Пользователь вовлекается в контент и чаще переходит к действию — написать или заказать.
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}