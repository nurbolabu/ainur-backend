'use client';

import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#8BFDA8] selection:text-black relative overflow-hidden">
      
      {/* МАГИЧЕСКИЙ ФОН: Темно-серые точки + Вспыхивающие зеленые кластеры */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Базовый слой: Темно-серые точки */}
        <div className="absolute inset-0 opacity-40" 
             style={{ backgroundImage: 'radial-gradient(circle, #333 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}>
        </div>
        
        {/* Анимированный слой 1: Левый кластер */}
        <div className="anim-pulse-1 absolute inset-0" 
             style={{ backgroundImage: 'radial-gradient(circle, #8BFDA8 1.5px, transparent 1.5px)', backgroundSize: '32px 32px', WebkitMaskImage: 'radial-gradient(circle 350px at 20% 30%, black, transparent)', maskImage: 'radial-gradient(circle 350px at 20% 30%, black, transparent)' }}>
        </div>
        
        {/* Анимированный слой 2: Правый нижний кластер */}
        <div className="anim-pulse-2 absolute inset-0" 
             style={{ backgroundImage: 'radial-gradient(circle, #8BFDA8 1.5px, transparent 1.5px)', backgroundSize: '32px 32px', WebkitMaskImage: 'radial-gradient(circle 400px at 80% 70%, black, transparent)', maskImage: 'radial-gradient(circle 400px at 80% 70%, black, transparent)' }}>
        </div>
        
        {/* Анимированный слой 3: Центральный кластер */}
        <div className="anim-pulse-3 absolute inset-0" 
             style={{ backgroundImage: 'radial-gradient(circle, #8BFDA8 1.5px, transparent 1.5px)', backgroundSize: '32px 32px', WebkitMaskImage: 'radial-gradient(circle 250px at 50% 50%, black, transparent)', maskImage: 'radial-gradient(circle 250px at 50% 50%, black, transparent)' }}>
        </div>
      </div>

      {/* КЛЮЧЕВЫЕ АНИМАЦИИ (Вшиты через CSS) */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Анимация фона */
        .anim-pulse-1 { animation: pulsePattern 7s infinite alternate ease-in-out; }
        .anim-pulse-2 { animation: pulsePattern 11s infinite alternate-reverse ease-in-out; }
        .anim-pulse-3 { animation: pulsePattern 9s infinite alternate ease-in-out 3s; }
        @keyframes pulsePattern { 0% { opacity: 0; transform: scale(0.98); } 100% { opacity: 0.5; transform: scale(1.02); } }

        /* 1. Чат */
        .anim-msg-user { animation: chatUser 10s infinite cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom right; }
        .anim-typing { animation: chatTyping 10s infinite; transform-origin: bottom left; }
        .anim-msg-ai { animation: chatAi 10s infinite cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom left; }
        .dot-1 { animation: dotBlink 1.4s infinite ease-in-out both; animation-delay: -0.32s; }
        .dot-2 { animation: dotBlink 1.4s infinite ease-in-out both; animation-delay: -0.16s; }
        .dot-3 { animation: dotBlink 1.4s infinite ease-in-out both; }

        @keyframes chatUser {
          0%, 5% { opacity: 0; transform: scale(0.8) translate(10px, 10px); }
          10%, 85% { opacity: 1; transform: scale(1) translate(0, 0); }
          90%, 100% { opacity: 0; transform: scale(0.9) translateY(10px); }
        }
        @keyframes chatTyping {
          0%, 15% { opacity: 0; transform: scale(0.8); }
          20%, 35% { opacity: 1; transform: scale(1); }
          40%, 100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes chatAi {
          0%, 40% { opacity: 0; transform: scale(0.8) translate(-10px, 10px); }
          45%, 85% { opacity: 1; transform: scale(1) translate(0, 0); }
          90%, 100% { opacity: 0; transform: scale(0.9) translateY(10px); }
        }
        @keyframes dotBlink {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 
          40% { transform: scale(1); opacity: 1; }
        }

        /* 2. Stories */
        .anim-spin-grad { animation: spinGrad 3s linear infinite; }
        .anim-story-avatar { animation: storyAvatar 10s infinite; }
        .anim-story-modal { animation: storyModal 10s infinite cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: center; }
        .anim-story-cursor { animation: storyCursor 10s infinite; }
        .anim-story-btn { animation: storyBtn 10s infinite; }

        @keyframes spinGrad { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes storyAvatar {
          0%, 15% { transform: scale(1); opacity: 1; }
          18% { transform: scale(0.9); opacity: 1; }
          22%, 80% { transform: scale(0.9); opacity: 0; pointer-events: none; }
          85%, 100% { transform: scale(1); opacity: 1; }
        }
        @keyframes storyModal {
          0%, 20% { opacity: 0; transform: scale(0.5) translateY(50px); pointer-events: none; }
          25%, 75% { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
          80%, 100% { opacity: 0; transform: scale(0.8) translateY(20px); pointer-events: none; }
        }
        @keyframes storyCursor {
          0%, 35% { transform: translate(40px, 60px); opacity: 0; }
          40% { transform: translate(40px, 60px); opacity: 1; }
          50%, 65% { transform: translate(0px, 0px); opacity: 1; }
          70%, 100% { transform: translate(40px, 60px); opacity: 0; }
        }
        @keyframes storyBtn {
          0%, 53% { transform: scale(1); background: #8BFDA8; }
          55% { transform: scale(0.95); background: #34C759; }
          58%, 100% { transform: scale(1); background: #8BFDA8; }
        }

        /* 3. Каталог */
        .anim-cat-cursor { animation: catCursor 10s infinite; }
        .anim-cat-btn { animation: catBtn 10s infinite; }
        .anim-cat-badge { animation: catBadge 10s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        @keyframes catCursor {
          0%, 15% { transform: translate(50px, 50px); opacity: 0; }
          25% { transform: translate(50px, 50px); opacity: 1; }
          40%, 75% { transform: translate(0px, 0px); opacity: 1; }
          85%, 100% { transform: translate(50px, 50px); opacity: 0; }
        }
        @keyframes catBtn {
          0%, 48% { transform: scale(1); background-color: #8BFDA8; }
          50% { transform: scale(0.95); background-color: #34C759; }
          55%, 100% { transform: scale(1); background-color: #8BFDA8; }
        }
        @keyframes catBadge {
          0%, 50% { opacity: 0; transform: scale(0); }
          55%, 90% { opacity: 1; transform: scale(1); }
          95%, 100% { opacity: 0; transform: scale(0); }
        }

        /* 4. Заявки (Лиды) */
        .anim-lead-form { animation: leadForm 10s infinite; }
        .anim-lead-type1 { animation: leadType1 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-lead-type2 { animation: leadType2 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-lead-btn { animation: leadBtn 10s infinite; }
        .anim-lead-success { animation: leadSuccess 10s infinite; }

        @keyframes leadForm {
          0%, 65% { opacity: 1; transform: scale(1); pointer-events: auto; }
          70%, 100% { opacity: 0; transform: scale(0.9); pointer-events: none; }
        }
        @keyframes leadType1 { 0%, 15% { width: 0%; opacity: 0; } 25%, 100% { width: 60%; opacity: 1; } }
        @keyframes leadType2 { 0%, 30% { width: 0%; opacity: 0; } 40%, 100% { width: 80%; opacity: 1; } }
        @keyframes leadBtn {
          0%, 48% { transform: scale(1); } 50% { transform: scale(0.95); background: #34C759; } 55%, 100% { transform: scale(1); }
        }
        @keyframes leadSuccess {
          0%, 65% { opacity: 0; transform: scale(0.5); pointer-events: none; }
          70%, 95% { opacity: 1; transform: scale(1); pointer-events: auto; }
          100% { opacity: 0; transform: scale(0.9); pointer-events: none; }
        }

        /* 5. Аналитика */
        .anim-bar-1 { animation: bar1 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-bar-2 { animation: bar2 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-bar-3 { animation: bar3 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        
        @keyframes bar1 { 0%, 10% { height: 10%; } 30%, 90% { height: 60%; } 100% { height: 10%; } }
        @keyframes bar2 { 0%, 20% { height: 15%; } 40%, 90% { height: 40%; } 100% { height: 15%; } }
        @keyframes bar3 { 0%, 30% { height: 20%; } 50%, 90% { height: 90%; } 100% { height: 20%; } }
      `}} />

      {/* HEADER */}
      <header className="relative z-10 border-b border-zinc-900/60 backdrop-blur-md bg-black/40 sticky top-0">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
             <svg className="h-[14px] w-auto" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="white"/>
                <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="white"/>
                <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="white"/>
                <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
             </svg>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Возможности</a>
            <Link href="/login" className="bg-[#1A1A1A] border border-zinc-800 text-white px-4 py-1.5 rounded-full hover:border-[#8BFDA8] hover:text-[#8BFDA8] transition-all active:scale-95">
              Войти в кабинет
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8BFDA8]/30 bg-[#8BFDA8]/10 text-[#8BFDA8] text-[11px] font-bold uppercase tracking-widest mb-6">
            <Zap size={12} fill="currentColor" className="animate-pulse" /> Полная автоматизация продаж
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
            Продавайте <span className="text-[#8BFDA8]">24/7</span><br />
            без участия менеджера
          </h1>
          <p className="text-base md:text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI NUR — это виджет с искусственным интеллектом. Бесплатно настройте его в личном кабинете, скопируйте 1 строку кода на свой сайт и получайте заявки.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto h-12 px-8 bg-[#8BFDA8] text-black rounded-[14px] font-bold text-base flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,253,168,0.4)] transition-all active:scale-95">
              Создать виджет бесплатно <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ФУНКЦИОНАЛ: BENTO GRID */}
      <section id="features" className="relative z-10 py-12 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* БЛОК 1: ИИ-ЧАТ (Занимает 2 колонки) */}
          <div className="col-span-1 lg:col-span-2 bg-[#111111] border border-zinc-800/80 rounded-[28px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[260px] bg-[#1A1A1A] border-b border-zinc-800/80 flex items-center justify-center relative overflow-hidden">
               <div className="w-full max-w-[380px] flex flex-col gap-3 px-6 relative z-10 mt-[-20px]">
                 <div className="anim-msg-user self-end bg-[#8BFDA8] text-black px-4 py-2.5 rounded-2xl rounded-br-sm text-[14px] font-medium shadow-lg">
                    У вас есть кроссовки Nike?
                 </div>
                 <div className="anim-typing self-start bg-[#2C2C2E] px-3.5 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-1"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-2"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-3"></div>
                 </div>
                 <div className="anim-msg-ai self-start bg-[#2C2C2E] text-white px-4 py-2.5 rounded-2xl rounded-bl-sm text-[14px] font-medium shadow-lg leading-relaxed mt-[-36px]">
                    Да! Nike Air Max в наличии. Цена 45 000 ₸. Можете оформить заказ прямо здесь в корзине.
                 </div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 md:p-8 flex-shrink-0">
               <h3 className="text-xl font-bold mb-2 text-white">Нейросеть-продавец</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                 ИИ мгновенно отвечает клиентам 24/7, консультирует по каталогу и сам закрывает сделки.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Вы перестаете терять клиентов ночью, в выходные или когда менеджер занят.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Повышает лояльность за счет моментального и точного ответа по базе знаний.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* БЛОК 2: STORIES */}
          <div className="col-span-1 bg-[#111111] border border-zinc-800/80 rounded-[28px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[260px] bg-[#1A1A1A] border-b border-zinc-800/80 flex items-center justify-center relative">
               {/* Кружок Stories */}
               <div className="anim-story-avatar relative w-20 h-20 flex-shrink-0 z-10">
                  <svg className="anim-spin-grad absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                     <defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8BFDA8"/><stop offset="100%" stopColor="#00B0F2"/></linearGradient></defs>
                     <circle cx="30" cy="30" r="28" stroke="url(#grad1)" strokeWidth="2.5" fill="none" strokeDasharray="50 15" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-[3px] bg-zinc-800 rounded-full border-[2px] border-[#1A1A1A] flex items-center justify-center">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">News</span>
                  </div>
               </div>

               {/* Модальное окно (Открытый сторис) */}
               <div className="anim-story-modal absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                  <div className="w-[140px] h-[220px] bg-zinc-900 rounded-2xl border border-zinc-700 relative overflow-hidden flex flex-col">
                     <div className="absolute top-2 left-2 right-2 flex gap-1"><div className="h-1 bg-white/50 w-full rounded"></div></div>
                     <div className="flex-1 flex items-center justify-center text-white/20 font-bold text-xs">VIDEO</div>
                     <div className="p-3 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent">
                        <div className="anim-story-btn w-full bg-[#8BFDA8] text-black text-[10px] font-bold py-2 rounded-md text-center">Оставить заявку</div>
                     </div>
                     {/* Курсор */}
                     <div className="anim-story-cursor absolute z-30" style={{ bottom: '10px', left: '60px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'}}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86 3.6 7.4c.14.28.47.4.75.26l2.16-1.05c.28-.14.4-.47.26-.75l-3.55-7.3 5.48-.55c.44-.04.62-.6.28-.88L6.34 2.86c-.32-.28-.84-.06-.84.35z"/></svg>
                     </div>
                  </div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 md:p-8 flex-shrink-0">
               <h3 className="text-xl font-bold mb-2 text-white">Интерактивные Stories</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                 Загружайте короткие видео и фото прямо из админки в привычном формате.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Быстро делитесь акциями или новинками.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Вовлекает клиента и конвертирует просмотры в заявки напрямую через кнопки в видео.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* БЛОК 3: КАТАЛОГ */}
          <div className="col-span-1 bg-[#111111] border border-zinc-800/80 rounded-[28px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[260px] bg-[#1A1A1A] border-b border-zinc-800/80 flex items-center justify-center relative">
               <div className="absolute top-4 right-6 bg-zinc-800 p-2 rounded-full">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8BFDA8" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                  <div className="anim-cat-badge absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8BFDA8] text-black text-[9px] font-bold rounded-full flex items-center justify-center">1</div>
               </div>
               <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3 w-[180px] shadow-2xl relative">
                  <div className="w-full h-[80px] bg-zinc-800 rounded-lg mb-3"></div>
                  <div className="h-2 w-3/4 bg-zinc-700 rounded mb-2"></div>
                  <div className="h-2 w-1/3 bg-zinc-800 rounded mb-3"></div>
                  <div className="anim-cat-btn bg-[#8BFDA8] text-black font-bold text-[11px] py-2 rounded-md text-center">В корзину</div>
                  <div className="anim-cat-cursor absolute z-20" style={{ bottom: '2px', right: '15px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'}}>
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86 3.6 7.4c.14.28.47.4.75.26l2.16-1.05c.28-.14.4-.47.26-.75l-3.55-7.3 5.48-.55c.44-.04.62-.6.28-.88L6.34 2.86c-.32-.28-.84-.06-.84.35z"/></svg>
                  </div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 md:p-8 flex-shrink-0">
               <h3 className="text-xl font-bold mb-2 text-white">Встроенный каталог</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                 Клиенты просматривают услуги и товары, не покидая чат.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Бесшовный опыт: клиенту не нужно искать товары на основном сайте.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Удобная корзина и оформление заказа прямо в виджете повышают конверсию.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* БЛОК 4: ЗАЯВКИ */}
          <div className="col-span-1 bg-[#111111] border border-zinc-800/80 rounded-[28px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[260px] bg-[#1A1A1A] border-b border-zinc-800/80 flex items-center justify-center relative">
               <div className="anim-lead-form bg-zinc-900 border border-zinc-800 rounded-[16px] p-5 w-[200px] shadow-2xl absolute flex flex-col gap-3">
                  <div className="h-3 w-1/2 bg-zinc-700 rounded mb-1 mx-auto"></div>
                  <div className="h-8 w-full bg-zinc-800 rounded-lg relative overflow-hidden px-2 flex items-center">
                     <div className="anim-lead-type1 h-3 bg-zinc-600 rounded"></div>
                  </div>
                  <div className="h-8 w-full bg-zinc-800 rounded-lg relative overflow-hidden px-2 flex items-center">
                     <div className="anim-lead-type2 h-3 bg-zinc-600 rounded"></div>
                  </div>
                  <div className="anim-lead-btn bg-[#8BFDA8] text-black font-bold text-[11px] py-2.5 rounded-lg text-center mt-1">Отправить</div>
               </div>

               <div className="anim-lead-success absolute flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-[#34C759] rounded-full flex items-center justify-center">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="text-white font-bold text-sm">Отправлено</div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 md:p-8 flex-shrink-0">
               <h3 className="text-xl font-bold mb-2 text-white">Генерация лидов</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                 Сбор контактов без сложных и скучных форм.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>ИИ сам предложит клиенту оставить номер WhatsApp, если тот сомневается.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Вы получаете базу теплых контактов для дальнейших продаж.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* БЛОК 5: АНАЛИТИКА */}
          <div className="col-span-1 bg-[#111111] border border-zinc-800/80 rounded-[28px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[260px] bg-[#1A1A1A] border-b border-zinc-800/80 flex items-center justify-center relative p-6">
               <div className="w-[80%] h-full border-b border-l border-zinc-800 flex items-end justify-around pb-1 pl-3 gap-3">
                  <div className="w-full bg-zinc-700 rounded-t-md anim-bar-1 relative">
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 font-mono">1.2k</div>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-t-md anim-bar-2 relative">
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 font-mono">840</div>
                  </div>
                  <div className="w-full bg-[#8BFDA8] rounded-t-md anim-bar-3 relative shadow-[0_0_15px_rgba(139,253,168,0.3)]">
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-[#8BFDA8] font-bold font-mono">3.4k</div>
                  </div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 md:p-8 flex-shrink-0">
               <h3 className="text-xl font-bold mb-2 text-white">Сквозная аналитика</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                 Следите за всеми метриками в удобной панели управления.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Точно знаете, сколько человек открыли виджет или перешли в каталог.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[13px] text-zinc-300">
                    <CheckCircle2 size={16} className="text-[#8BFDA8] mt-0.5 shrink-0"/> 
                    <span>Помогает оценивать эффективность маркетинга и рекламы.</span>
                 </li>
               </ul>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-24 border-t border-zinc-900 bg-gradient-to-b from-transparent to-[#8BFDA8]/5 mt-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Начните собирать заявки <br /> уже сегодня</h2>
          <p className="text-base md:text-lg text-zinc-400 mb-10">
            Регистрация и базовая настройка полностью бесплатны.
          </p>
          <Link href="/login" className="inline-flex h-14 px-10 bg-[#8BFDA8] text-black rounded-[16px] font-bold text-lg items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(139,253,168,0.2)]">
            Создать платформу
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-10 border-t border-zinc-900 bg-black">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer flex items-center">
             <span className="text-white font-black text-lg tracking-tighter">AI NUR</span>
          </div>
          <div className="text-xs text-zinc-600">
            © 2026 AI NUR Platform. Все права защищены.
          </div>
        </div>
      </footer>

    </div>
  );
}