'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        
        /* АНИМАЦИИ ДЛЯ МАКЕТОВ */
        .anim-float { animation: float 6s ease-in-out infinite; }
        .anim-story-ring { animation: spin 4s linear infinite; }
        .anim-msg-user { animation: msgUser 8s infinite; transform-origin: bottom right; }
        .anim-msg-ai { animation: msgAi 8s infinite; transform-origin: bottom left; }
        .anim-typing { animation: typingBlink 1.4s infinite ease-in-out both; }
        .anim-scroll-cat { animation: scrollCat 10s infinite linear; }
        .anim-pulse-btn { animation: pulseBtn 2s infinite; }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes msgUser {
          0%, 5% { opacity: 0; transform: scale(0.9) translateY(10px); }
          10%, 90% { opacity: 1; transform: scale(1) translateY(0); }
          95%, 100% { opacity: 0; transform: scale(0.9) translateY(-10px); }
        }
        @keyframes msgAi {
          0%, 40% { opacity: 0; transform: scale(0.9) translateY(10px); }
          45%, 90% { opacity: 1; transform: scale(1) translateY(0); }
          95%, 100% { opacity: 0; transform: scale(0.9) translateY(-10px); }
        }
        @keyframes typingBlink {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes scrollCat {
          0%, 10% { transform: translateY(0); }
          40%, 60% { transform: translateY(-50px); }
          90%, 100% { transform: translateY(0); }
        }
        @keyframes pulseBtn {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); background-color: #34C759; }
          100% { transform: scale(1); }
        }
      `}} />

      <div className="min-h-screen bg-black text-white font-montserrat relative overflow-hidden flex flex-col items-center">
        
        {/* ФОН: Градиенты и микро-точки (Шаг ~8px, цвет белый с opacity 0.09) */}
        <div className="fixed inset-0 z-0 pointer-events-none" style={{ 
          background: 'linear-gradient(180deg, #181818 0%, #000000 40%, #111111 100%)' 
        }}></div>
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40" style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px)', 
            backgroundSize: '8px 8px',
            backgroundPosition: 'center'
        }}></div>

        {/* HEADER (Закрепленный) */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-center backdrop-blur-md bg-black/60 border-b border-white/10">
          <div className="w-full max-w-[1200px] px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-[2px] border-[#8BFDA8] flex items-center justify-center">
                 <div className="w-2 h-2 bg-[#8BFDA8] rounded-full"></div>
              </div>
              <span className="font-bold text-lg tracking-widest text-white uppercase">AI NUR</span>
            </div>
            {/* Desktop Nav */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-white/70 text-[13px] font-medium hover:text-white transition-colors">
                Войти
              </Link>
              <Link href="/login" className="bg-[#8BFDA8] text-black px-5 py-2 rounded-full text-[13px] font-semibold hover:scale-105 transition-transform">
                Кабинет
              </Link>
            </div>
          </div>
        </header>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <main className="relative z-10 w-full max-w-[1200px] px-5 pt-32 pb-24 flex flex-col items-center">
          
          {/* ТЭГИ (Пилюли) */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10 w-full max-w-[400px] md:max-w-none">
            <div className="px-4 py-1.5 bg-[#8BFDA8] text-black text-[12px] rounded-[20px] font-medium border border-[#8BFDA8]">Чат с ИИ</div>
            <div className="px-4 py-1.5 border border-[#8BFDA8] text-white text-[12px] rounded-[20px] font-medium">Stories</div>
            <div className="px-4 py-1.5 border border-[#8BFDA8] text-white text-[12px] rounded-[20px] font-medium">Каталог</div>
            <div className="px-4 py-1.5 border border-[#8BFDA8] text-white text-[12px] rounded-[20px] font-medium">Заявки</div>
          </div>

          {/* HERO TEXT */}
          <div className="text-center max-w-[800px] flex flex-col items-center mb-12">
            <h1 className="text-[24px] md:text-[46px] font-bold uppercase leading-[1.2] mb-6 tracking-wide">
              Превращаем сайты <br className="hidden md:block"/>в диалог с клиентами
            </h1>
            <p className="text-[16px] md:text-[18px] font-normal leading-relaxed text-white/90 max-w-[300px] md:max-w-xl">
              AI NUR это современный способ быстро превратить любой сайт в диалог с клиентом
            </p>
          </div>

          {/* КНОПКИ HERO */}
          <div className="flex justify-center items-center gap-4 w-full mb-20">
            <Link href="/login" className="px-6 py-3.5 bg-[#8BFDA8] text-black text-[14px] font-medium rounded-[30px] flex justify-center items-center hover:scale-105 transition-transform">
              Зарегистрироваться
            </Link>
            <Link href="/login" className="px-6 py-3.5 border border-[#8BFDA8] text-[#8BFDA8] text-[14px] font-medium rounded-[30px] flex justify-center items-center hover:bg-[#8BFDA8]/10 transition-colors">
              Войти
            </Link>
          </div>

          {/* BENTO СЕТКА КАРТОЧЕК */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-[800px] lg:max-w-[1000px]">
            
            {/* ========================================= */}
            {/* КАРТОЧКА 1: ЧАТ */}
            {/* ========================================= */}
            <div className="bg-black border border-[#4D4D4D] rounded-[22px] overflow-hidden flex flex-col h-[520px]">
               <div className="relative h-[280px] w-full flex justify-center overflow-hidden">
                 {/* Макет чата (анимированный) */}
                 <div className="anim-float w-[280px] h-[247px] border-[4px] border-[#DEDEDE] rounded-b-[46px] absolute top-0 bg-black flex flex-col items-center">
                    
                    {/* Сообщение пользователя */}
                    <div className="anim-msg-user self-end mt-10 mr-4 w-[160px] bg-[#E9E9EB] rounded-t-[16px] rounded-bl-[16px] rounded-br-[4px] p-3 flex flex-col gap-2">
                       <div className="h-1.5 bg-black rounded w-full"></div>
                       <div className="h-1.5 bg-black rounded w-2/3"></div>
                    </div>

                    {/* Сообщение ИИ (Градиент) */}
                    <div className="anim-msg-ai self-start mt-4 ml-4 w-[180px] bg-gradient-to-r from-[#61D6FB] to-[#8BFDA8] rounded-t-[16px] rounded-br-[16px] rounded-bl-[4px] p-3 flex flex-col gap-2">
                       <div className="h-1.5 bg-black/80 rounded w-full"></div>
                       <div className="h-1.5 bg-black/80 rounded w-5/6"></div>
                       <div className="h-1.5 bg-black/80 rounded w-1/2"></div>
                    </div>

                    {/* Инпут ввода */}
                    <div className="absolute bottom-4 w-[237px] h-[39px] bg-white rounded-xl flex items-center justify-between px-2 shadow-lg">
                       <div className="flex gap-1.5 ml-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6B6D6C] anim-typing" style={{animationDelay: '0s'}}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6B6D6C] anim-typing" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#6B6D6C] anim-typing" style={{animationDelay: '0.4s'}}></div>
                       </div>
                       <div className="w-[28px] h-[28px] bg-black rounded-[8px] flex items-center justify-center">
                          <div className="w-[12px] h-[12px] bg-gradient-to-t from-[#61D6FB] to-[#8BFDA8] rounded-[3px]"></div>
                       </div>
                    </div>
                 </div>
               </div>
               
               <div className="px-6 mt-auto text-center flex flex-col items-center">
                 <h3 className="text-[22px] font-bold text-white/60 mb-3 leading-tight">Закрепленный чат<br/>внизу экрана</h3>
                 <p className="text-[14px] text-white/80 leading-relaxed font-normal mb-6">
                   Знакомый интерфейс мессенджера на любом сайте. Приглашает начать диалог, а ИИ ответит на любые вопросы.
                 </p>
               </div>

               {/* Подвал карточки */}
               <div className="w-full flex justify-between px-6 pb-6 mt-auto">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 border-[1.5px] border-[#8BFDA8] rounded-full flex items-center justify-center">
                     <div className="w-[1.5px] h-[6px] bg-[#8BFDA8] translate-y-[-2px]"></div>
                   </div>
                   <span className="text-[14px] font-medium text-white">Работает 24/7</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 border-[1.5px] border-[#8BFDA8] rounded flex items-center justify-center">
                     <div className="w-2.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-[#8BFDA8] -rotate-45 mb-[2px]"></div>
                   </div>
                   <span className="text-[14px] font-medium text-white">Конверсия <span className="text-[#8BFDA8]">x2</span></span>
                 </div>
               </div>
            </div>

            {/* ========================================= */}
            {/* КАРТОЧКА 2: МЕНЮ И КОРЗИНА */}
            {/* ========================================= */}
            <div className="bg-black border border-[#4D4D4D] rounded-[22px] overflow-hidden flex flex-col h-[520px]">
               <div className="px-6 pt-10 text-center flex flex-col items-center">
                 <h3 className="text-[22px] font-bold text-white/60 mb-4 leading-tight">Функциональное меню</h3>
                 <p className="text-[14px] text-white/80 leading-relaxed font-normal mb-8">
                   В одном меню есть все важные функции, чтобы клиент всегда нашел нужное
                 </p>
                 <div className="flex gap-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-[1.5px] border-[#8BFDA8] rounded-[6px] flex items-center justify-center relative">
                        <div className="absolute top-1 w-2.5 h-1 border-[1.5px] border-[#8BFDA8] rounded-t-sm"></div>
                      </div>
                      <span className="text-[14px] font-medium text-white">Корзина</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-[1.5px] border-[#8BFDA8] rounded-[4px] flex items-center justify-center relative">
                         <div className="absolute right-1 top-1 w-1.5 h-1.5 border-[1.5px] border-[#8BFDA8] rounded-[2px]"></div>
                      </div>
                      <span className="text-[14px] font-medium text-white">Форма заявки</span>
                    </div>
                 </div>
               </div>

               {/* Иллюстрация */}
               <div className="relative h-[280px] w-full flex justify-center mt-auto">
                 <div className="anim-float w-[280px] h-[247px] border-[4px] border-[#DEDEDE] rounded-t-[46px] absolute bottom-0 overflow-hidden bg-gradient-to-b from-[#272727] to-[#080808] flex flex-col items-center pt-10">
                    <div className="w-[80%] bg-white/10 rounded-2xl p-4 flex items-center gap-4 border border-white/20 mb-4">
                       <div className="w-10 h-10 bg-white/20 rounded-xl"></div>
                       <div className="flex-1 flex flex-col gap-2">
                          <div className="h-2 w-full bg-white/30 rounded"></div>
                          <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                       </div>
                    </div>
                    <div className="w-[80%] bg-white/10 rounded-2xl p-4 flex items-center gap-4 border border-white/20">
                       <div className="w-10 h-10 bg-white/20 rounded-xl"></div>
                       <div className="flex-1 flex flex-col gap-2">
                          <div className="h-2 w-full bg-white/30 rounded"></div>
                          <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                       </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* ========================================= */}
            {/* КАРТОЧКА 3: STORIES */}
            {/* ========================================= */}
            <div className="bg-black border border-[#4D4D4D] rounded-[22px] overflow-hidden flex flex-col h-[520px]">
               <div className="relative h-[260px] w-full flex justify-center">
                 {/* Макет шапки виджета */}
                 <div className="anim-float w-[280px] h-[247px] border-[4px] border-[#DEDEDE] rounded-b-[46px] absolute top-0 overflow-hidden bg-gradient-to-t from-transparent to-[#181818] flex flex-col items-center pt-8">
                    
                    <div className="relative w-[70px] h-[70px] flex items-center justify-center mb-3">
                       <svg className="anim-story-ring absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                         <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8BFDA8"/><stop offset="100%" stopColor="#61D6FB"/></linearGradient></defs>
                         <circle cx="30" cy="30" r="28" stroke="url(#sg)" strokeWidth="3" fill="none" />
                       </svg>
                       <div className="w-[56px] h-[56px] bg-[#111] rounded-full border-[2px] border-black flex items-center justify-center overflow-hidden">
                          <div className="w-[20px] h-[20px] border-[1.5px] border-white/80 rounded-[4px] flex items-center justify-center">
                             <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-white/80 border-b-[4px] border-b-transparent translate-x-[1px]"></div>
                          </div>
                       </div>
                    </div>

                    <div className="text-[12px] font-bold text-white/60 mb-1">Название компании</div>
                    <div className="text-[10px] text-white/40">Профиль, каталог, stories</div>
                 </div>
               </div>

               <div className="px-6 text-center flex flex-col items-center mt-4">
                 <h3 className="text-[22px] font-bold text-white mb-4 leading-tight">
                   <span className="text-[#8BFDA8]">Stories</span><br/>в виджете и на сайте
                 </h3>
                 <p className="text-[14px] text-white/60 leading-relaxed font-normal">
                   Все любят stories и теперь они будут у вас на сайте. Показывайте товары, новости и акции в удобном формате.
                 </p>
               </div>

               <div className="px-6 pb-8 mt-auto flex items-center justify-center gap-2">
                 <div className="w-6 h-6 border-[1.5px] border-[#8BFDA8] rounded-[6px] flex items-center justify-center">
                    <div className="w-2.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-[#8BFDA8] -rotate-45 mb-[2px]"></div>
                 </div>
                 <span className="text-[14px] font-medium text-white">Прогревает клиента</span>
               </div>
            </div>

            {/* ========================================= */}
            {/* КАРТОЧКА 4: КАТАЛОГ ТОВАРОВ (НОВАЯ) */}
            {/* ========================================= */}
            <div className="bg-black border border-[#4D4D4D] rounded-[22px] overflow-hidden flex flex-col h-[520px]">
               <div className="px-6 pt-10 text-center flex flex-col items-center">
                 <h3 className="text-[22px] font-bold text-white/60 mb-4 leading-tight">Встроенный<br/>Каталог</h3>
                 <p className="text-[14px] text-white/80 leading-relaxed font-normal mb-8">
                   Не заставляйте клиента искать товары на основном сайте. Всё доступно прямо в виджете.
                 </p>
                 <div className="flex gap-5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-[1.5px] border-[#8BFDA8] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#8BFDA8] rounded-full"></div>
                      </div>
                      <span className="text-[14px] font-medium text-white">Удобный чекаут</span>
                    </div>
                 </div>
               </div>

               <div className="relative h-[280px] w-full flex justify-center mt-auto">
                 <div className="anim-float w-[280px] h-[247px] border-[4px] border-[#DEDEDE] rounded-t-[46px] absolute bottom-0 overflow-hidden bg-[#0A0A0A] flex flex-col items-center pt-6 px-4">
                    
                    <div className="w-full anim-scroll-cat flex flex-col gap-4">
                       {/* Товар 1 */}
                       <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-3 flex gap-3">
                          <div className="w-16 h-16 bg-[#222] rounded-xl flex-shrink-0 flex items-center justify-center">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          <div className="flex flex-col justify-center flex-1 gap-1.5">
                             <div className="h-2.5 w-full bg-[#333] rounded"></div>
                             <div className="h-2 w-2/3 bg-[#333] rounded mb-1"></div>
                             <div className="anim-pulse-btn w-full py-1.5 bg-[#8BFDA8] rounded flex items-center justify-center">
                                <span className="text-black text-[9px] font-bold">В корзину</span>
                             </div>
                          </div>
                       </div>
                       {/* Товар 2 */}
                       <div className="bg-[#1A1A1A] border border-[#333] rounded-2xl p-3 flex gap-3">
                          <div className="w-16 h-16 bg-[#222] rounded-xl flex-shrink-0 flex items-center justify-center">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                          </div>
                          <div className="flex flex-col justify-center flex-1 gap-1.5">
                             <div className="h-2.5 w-full bg-[#333] rounded"></div>
                             <div className="h-2 w-1/2 bg-[#333] rounded mb-1"></div>
                             <div className="w-full py-1.5 bg-[#222] border border-[#333] rounded flex items-center justify-center">
                                <span className="text-[#888] text-[9px] font-bold">В корзину</span>
                             </div>
                          </div>
                       </div>
                    </div>

                 </div>
               </div>
            </div>

          </div>

          {/* ========================================= */}
          {/* TIMELINE (ПРЕИМУЩЕСТВА) */}
          {/* ========================================= */}
          <div className="w-full max-w-[600px] mt-16 px-4 pb-10">
             <div className="relative pl-10 border-l border-white/20 ml-2 py-4 flex flex-col gap-12">
                
                {/* Элемент 1 */}
                <div className="relative">
                   <div className="absolute -left-[51px] top-0.5 w-[22px] h-[22px] bg-black border-[1.5px] border-[#8BFDA8] rounded-[6px] flex items-center justify-center z-10">
                      <div className="w-2.5 h-1.5 border-b-[1.5px] border-l-[1.5px] border-[#8BFDA8] -rotate-45 mb-[2px]"></div>
                   </div>
                   <div className="text-[16px] font-medium text-white mb-2 leading-none">Увеличивает доверие</div>
                   <div className="text-[13px] text-white/60 leading-relaxed">
                      Сторис постепенно раскрывают ценность компании и подводят к покупке без давления.
                   </div>
                </div>

                {/* Элемент 2 */}
                <div className="relative">
                   <div className="absolute -left-[51px] top-0.5 w-[22px] h-[22px] bg-black border-[1.5px] border-white rounded-[6px] flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                   </div>
                   <div className="text-[16px] font-normal text-white mb-2 leading-none">Повышает конверсию</div>
                   <div className="text-[13px] text-white/60 leading-relaxed">
                      Пользователь вовлекается в контент и чаще переходит к действию — написать или оставить заявку.
                   </div>
                </div>

             </div>
          </div>

        </main>
      </div>
    </>
  );
}