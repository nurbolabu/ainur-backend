'use client';

import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#8BFDA8] selection:text-black">
      
      {/* КЛЮЧЕВЫЕ АНИМАЦИИ (Вшиты через CSS) */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Анимация чата */
        .anim-msg-user { animation: chatUser 8s infinite cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom right; }
        .anim-typing { animation: chatTyping 8s infinite; transform-origin: bottom left; }
        .anim-msg-ai { animation: chatAi 8s infinite cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom left; }
        .dot-1 { animation: dotBlink 1.4s infinite ease-in-out both; animation-delay: -0.32s; }
        .dot-2 { animation: dotBlink 1.4s infinite ease-in-out both; animation-delay: -0.16s; }
        .dot-3 { animation: dotBlink 1.4s infinite ease-in-out both; }

        @keyframes chatUser {
          0%, 5% { opacity: 0; transform: scale(0.8) translate(10px, 10px); }
          10%, 90% { opacity: 1; transform: scale(1) translate(0, 0); }
          95%, 100% { opacity: 0; transform: scale(0.9) translateY(10px); }
        }
        @keyframes chatTyping {
          0%, 15% { opacity: 0; transform: scale(0.8); }
          20%, 40% { opacity: 1; transform: scale(1); }
          45%, 100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes chatAi {
          0%, 45% { opacity: 0; transform: scale(0.8) translate(-10px, 10px); }
          50%, 90% { opacity: 1; transform: scale(1) translate(0, 0); }
          95%, 100% { opacity: 0; transform: scale(0.9) translateY(10px); }
        }
        @keyframes dotBlink {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 
          40% { transform: scale(1); opacity: 1; }
        }

        /* Анимация Каталога и Курсора */
        .anim-cursor { animation: cursorMove 8s infinite; }
        .anim-btn-click { animation: btnClick 8s infinite; }
        .anim-badge { animation: badgePop 8s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        @keyframes cursorMove {
          0%, 15% { transform: translate(50px, 50px); opacity: 0; }
          25% { transform: translate(50px, 50px); opacity: 1; }
          40%, 60% { transform: translate(0px, 0px); opacity: 1; }
          70%, 100% { transform: translate(50px, 50px); opacity: 0; }
        }
        @keyframes btnClick {
          0%, 48% { transform: scale(1); background-color: #8BFDA8; }
          50% { transform: scale(0.95); background-color: #34C759; }
          55%, 100% { transform: scale(1); background-color: #8BFDA8; }
        }
        @keyframes badgePop {
          0%, 50% { opacity: 0; transform: scale(0); }
          55%, 90% { opacity: 1; transform: scale(1); }
          95%, 100% { opacity: 0; transform: scale(0); }
        }

        /* Анимация Stories */
        .anim-spin-grad { animation: spinGrad 3s linear infinite; }
        @keyframes spinGrad { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />

      {/* СЕТКА НА ФОНЕ */}
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-zinc-900 backdrop-blur-md bg-black/50 sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
             <svg className="h-[18px] w-auto" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="white"/>
                <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="white"/>
                <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="white"/>
                <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
             </svg>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Возможности</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Как начать</a>
            <Link href="/login" className="bg-[#1A1A1A] border border-zinc-800 text-white px-5 py-2 rounded-full hover:border-[#8BFDA8] hover:text-[#8BFDA8] transition-all active:scale-95">
              Войти в кабинет
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8BFDA8]/30 bg-[#8BFDA8]/10 text-[#8BFDA8] text-xs font-bold uppercase tracking-widest mb-8">
            <Zap size={14} fill="currentColor" className="animate-pulse" /> Полная автоматизация продаж
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            Продавайте <span className="text-[#8BFDA8]">24/7</span><br />
            без участия менеджера
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI NUR — это виджет с искусственным интеллектом. Бесплатно настройте его в личном кабинете, скопируйте 1 строку кода на свой сайт и получайте заявки.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/login" className="w-full sm:w-auto h-16 px-10 bg-[#8BFDA8] text-black rounded-[18px] font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(139,253,168,0.4)] transition-all active:scale-95">
              Создать виджет бесплатно <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ФУНКЦИОНАЛ: BENTO GRID (Модульная сетка блоков) */}
      <section id="features" className="relative z-10 py-16 px-6 max-w-6xl mx-auto">
        
        {/* БЛОК 1: ИИ-ЧАТ (На всю ширину) */}
        <div className="bg-[#111111] border border-zinc-800/80 rounded-[32px] overflow-hidden flex flex-col md:flex-row mb-6">
           <div className="p-12 md:w-1/2 flex flex-col justify-center">
              <h3 className="text-3xl font-black mb-4">Нейросеть-продавец</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                 ИИ изучает ваши товары, цены и базу знаний. Он мгновенно отвечает клиентам, консультирует как лучший продавец и сам закрывает сделки.
              </p>
              <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle2 size={16} className="text-[#8BFDA8]"/> Отвечает за 1 секунду</li>
                 <li className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle2 size={16} className="text-[#8BFDA8]"/> Не придумывает цены (берет из базы)</li>
                 <li className="flex items-center gap-3 text-sm text-zinc-300"><CheckCircle2 size={16} className="text-[#8BFDA8]"/> Забирает контакты (лидогенерация)</li>
              </ul>
           </div>
           {/* Анимация чата */}
           <div className="md:w-1/2 bg-[#1A1A1A] p-8 md:p-12 flex items-center justify-center border-l border-zinc-800/80">
              <div className="w-full max-w-[320px] flex flex-col gap-4">
                 {/* Сообщение клиента */}
                 <div className="anim-msg-user self-end bg-[#8BFDA8] text-black px-4 py-3 rounded-2xl rounded-br-sm text-[15px] font-medium max-w-[85%] shadow-lg">
                    Сколько стоят кроссовки Nike?
                 </div>
                 {/* Индикатор печати ИИ */}
                 <div className="anim-typing self-start bg-[#2C2C2E] px-4 py-4 rounded-2xl rounded-bl-sm flex gap-1 items-center w-fit shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-1"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-2"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-3"></div>
                 </div>
                 {/* Ответ ИИ */}
                 <div className="anim-msg-ai self-start bg-[#2C2C2E] text-white px-4 py-3 rounded-2xl rounded-bl-sm text-[15px] font-medium shadow-lg leading-relaxed mt-[-46px]">
                    Nike Air Max сейчас в наличии. Цена 45 000 ₸. Желаете оформить заказ прямо сейчас в корзине?
                 </div>
              </div>
           </div>
        </div>

        {/* НИЖНИЙ РЯД: КАТАЛОГ И STORIES (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* БЛОК 2: КАТАЛОГ */}
           <div className="bg-[#111111] border border-zinc-800/80 rounded-[32px] overflow-hidden flex flex-col h-[500px]">
              <div className="p-10 pb-6 flex-shrink-0">
                 <h3 className="text-2xl font-black mb-3">Встроенный каталог</h3>
                 <p className="text-zinc-400 text-sm leading-relaxed">
                    Клиентам не нужно искать товары на сайте. Весь каталог доступен внутри виджета с корзиной и чекаутом.
                 </p>
              </div>
              {/* Анимация каталога */}
              <div className="flex-1 bg-[#1A1A1A] border-t border-zinc-800/80 p-8 flex items-center justify-center relative overflow-hidden">
                 
                 {/* Шапка виджета с корзиной */}
                 <div className="absolute top-0 left-0 w-full p-4 flex justify-end">
                    <div className="relative bg-zinc-800/50 p-2 rounded-full">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8BFDA8" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                       <div className="anim-badge absolute -top-1 -right-1 w-4 h-4 bg-[#8BFDA8] text-black text-[10px] font-bold rounded-full flex items-center justify-center border border-[#1A1A1A]">1</div>
                    </div>
                 </div>

                 {/* Карточка товара */}
                 <div className="bg-zinc-900 border border-zinc-800 rounded-[20px] p-3 w-[220px] flex flex-col gap-3 relative z-10 shadow-2xl">
                    <div className="w-full h-[100px] bg-zinc-800 rounded-[12px] animate-pulse"></div>
                    <div>
                       <div className="h-4 w-3/4 bg-zinc-700 rounded mb-2"></div>
                       <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
                    </div>
                    <div className="mt-2 anim-btn-click text-black font-bold text-[13px] py-2 rounded-[8px] flex justify-center items-center cursor-default">
                       В корзину
                    </div>
                    {/* Курсор (Имитация мыши) */}
                    <div className="anim-cursor absolute bottom-2 right-4 z-20" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'}}>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86 3.6 7.4c.14.28.47.4.75.26l2.16-1.05c.28-.14.4-.47.26-.75l-3.55-7.3 5.48-.55c.44-.04.62-.6.28-.88L6.34 2.86c-.32-.28-.84-.06-.84.35z"/></svg>
                    </div>
                 </div>
              </div>
           </div>

           {/* БЛОК 3: STORIES */}
           <div className="bg-[#111111] border border-zinc-800/80 rounded-[32px] overflow-hidden flex flex-col h-[500px]">
              <div className="p-10 pb-6 flex-shrink-0">
                 <h3 className="text-2xl font-black mb-3">Ваши Stories</h3>
                 <p className="text-zinc-400 text-sm leading-relaxed">
                    Загружайте короткие видео и фото прямо из админки. Вовлекайте посетителей привычным "инстаграмным" форматом.
                 </p>
              </div>
              {/* Анимация Stories */}
              <div className="flex-1 bg-[#1A1A1A] border-t border-zinc-800/80 p-8 flex items-center justify-center">
                 <div className="flex gap-4">
                    {/* Story 1 (Крутится) */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                       <svg className="anim-spin-grad absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                          <defs>
                             <linearGradient id="grad-story" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#8BFDA8" /><stop offset="100%" stopColor="#00B0F2" />
                             </linearGradient>
                          </defs>
                          <circle cx="30" cy="30" r="28" stroke="url(#grad-story)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="60 10" />
                       </svg>
                       <div className="absolute inset-[4px] bg-zinc-800 rounded-full border-2 border-[#1A1A1A]"></div>
                    </div>
                    {/* Story 2 */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                       <circle cx="30" cy="30" r="28" stroke="#333" strokeWidth="2" fill="none" />
                       <div className="absolute inset-[4px] bg-zinc-800 rounded-full border-2 border-[#1A1A1A]"></div>
                    </div>
                    {/* Story 3 */}
                    <div className="relative w-20 h-20 flex-shrink-0 hidden sm:block">
                       <circle cx="30" cy="30" r="28" stroke="#333" strokeWidth="2" fill="none" />
                       <div className="absolute inset-[4px] bg-zinc-800 rounded-full border-2 border-[#1A1A1A]"></div>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </section>

      {/* ШАГИ ПОДКЛЮЧЕНИЯ */}
      <section id="how-it-works" className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
           <h2 className="text-3xl md:text-5xl font-black mb-16">Установка в <span className="text-[#8BFDA8]">3 шага</span></h2>
           
           <div className="flex flex-col md:flex-row justify-between gap-8 text-left relative">
              {/* Линия связи на десктопе */}
              <div className="hidden md:block absolute top-6 left-10 right-10 h-[1px] bg-zinc-800 z-0"></div>
              
              <div className="flex-1 relative z-10">
                 <div className="w-12 h-12 rounded-full bg-[#8BFDA8] text-black font-black flex items-center justify-center text-xl mb-4 border-[4px] border-black">1</div>
                 <h4 className="font-bold text-lg mb-2">Кабинет</h4>
                 <p className="text-zinc-500 text-sm">Создайте аккаунт и настройте промпт для ИИ.</p>
              </div>
              <div className="flex-1 relative z-10">
                 <div className="w-12 h-12 rounded-full bg-zinc-900 text-white border border-zinc-800 font-black flex items-center justify-center text-xl mb-4">2</div>
                 <h4 className="font-bold text-lg mb-2">Наполнение</h4>
                 <p className="text-zinc-500 text-sm">Добавьте свои товары, цены и загрузите Stories.</p>
              </div>
              <div className="flex-1 relative z-10">
                 <div className="w-12 h-12 rounded-full bg-zinc-900 text-white border border-zinc-800 font-black flex items-center justify-center text-xl mb-4">3</div>
                 <h4 className="font-bold text-lg mb-2">Установка</h4>
                 <p className="text-zinc-500 text-sm">Вставьте одну строку кода на ваш Tilda или кастомный сайт.</p>
              </div>
           </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-32 border-t border-zinc-900 bg-gradient-to-b from-transparent to-[#8BFDA8]/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Начните собирать заявки <br /> уже сегодня</h2>
          <p className="text-lg text-zinc-400 mb-12">
            Регистрация и базовая настройка бесплатны.
          </p>
          <Link href="/login" className="inline-flex h-16 px-12 bg-[#8BFDA8] text-black rounded-[20px] font-black text-xl items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-[0_0_40px_rgba(139,253,168,0.3)]">
            Зарегистрироваться
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-12 border-t border-zinc-900 bg-black">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer flex items-center">
             <span className="text-white font-black text-xl tracking-tighter">AI NUR</span>
          </div>
          <div className="text-sm text-zinc-600">
            © 2026 AI NUR Platform. Все права защищены.
          </div>
        </div>
      </footer>

    </div>
  );
}