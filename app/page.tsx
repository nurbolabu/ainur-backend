'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');
        
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        
        /* Плавные анимации элементов макета */
        .anim-bubble-user { animation: popIn 3s infinite alternate cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom right; }
        .anim-bubble-ai { animation: popIn 3s infinite alternate-reverse cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom left; }
        .anim-pulse-ring { animation: ringPulse 2s infinite; }
        .anim-float { animation: float 6s ease-in-out infinite; }
        .anim-story-ring { animation: spin 4s linear infinite; }
        
        @keyframes popIn {
          0%, 10% { transform: scale(0.95); opacity: 0.8; }
          90%, 100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ringPulse {
          0% { box-shadow: 0 0 0 0 rgba(139, 253, 168, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(139, 253, 168, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 253, 168, 0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />

      <div className="min-h-screen bg-black text-white font-montserrat relative overflow-hidden flex flex-col items-center">
        
        {/* ФОН: Градиент + Сетка из точек (шаг ~20px, размер 3.29px как в макете) */}
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(0deg, #181818 0%, black 50%, #2B2B2B 100%)' }}></div>
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.09) 1.65px, transparent 1.65px)', 
            backgroundSize: '20px 20px',
            backgroundPosition: 'center'
        }}></div>

        {/* HEADER (Закрепленный) */}
        <header className="fixed top-0 left-0 w-full z-50 flex justify-center backdrop-blur-md bg-black/50 border-b border-white/5">
          <div className="w-full max-w-6xl px-6 py-4 flex justify-between items-center">
            <span className="font-bold text-xl tracking-widest text-white uppercase">AI NUR</span>
            <div className="flex gap-4">
              <Link href="/login" className="hidden sm:flex items-center text-[#8BFDA8] text-sm font-medium hover:opacity-80 transition-opacity">
                Войти
              </Link>
              <Link href="/login" className="bg-[#8BFDA8] text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                Регистрация
              </Link>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT CONTAINER */}
        <main className="relative z-10 w-full max-w-6xl px-4 sm:px-6 pt-32 pb-24 flex flex-col items-center">
          
          {/* HERO SECTION */}
          <div className="text-center max-w-3xl flex flex-col items-center">
            <h1 className="text-[28px] md:text-[48px] font-bold uppercase leading-tight mb-6 tracking-wide drop-shadow-lg">
              Превращаем сайты<br />в диалог с клиентами
            </h1>
            <p className="text-[16px] md:text-[20px] font-normal leading-relaxed text-white/90 max-w-[500px] md:max-w-xl mb-10">
              AI NUR это современный способ быстро превратить любой сайт в диалог с клиентом
            </p>
            
            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link href="/login" className="w-full sm:w-[260px] py-4 bg-[#8BFDA8] text-black text-[14px] font-medium rounded-[30px] flex justify-center items-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(139,253,168,0.2)]">
                Зарегистрироваться
              </Link>
              <Link href="/login" className="w-full sm:w-[260px] py-4 border border-[#8BFDA8] text-[#8BFDA8] text-[14px] font-medium rounded-[30px] flex justify-center items-center hover:bg-[#8BFDA8]/10 transition-colors">
                Войти
              </Link>
            </div>

            {/* Фишки (Пилюли) */}
            <div className="flex flex-wrap justify-center gap-2.5 mt-10 max-w-[400px] md:max-w-none">
              <div className="px-4 py-2 bg-[#8BFDA8] text-black text-[12px] rounded-full font-medium border border-[#8BFDA8]">Чат с ИИ</div>
              <div className="px-4 py-2 border border-[#8BFDA8] text-white text-[12px] rounded-full font-medium">Stories</div>
              <div className="px-4 py-2 border border-[#8BFDA8] text-white text-[12px] rounded-full font-medium">Каталог</div>
              <div className="px-4 py-2 border border-[#8BFDA8] text-white text-[12px] rounded-full font-medium">Заявки</div>
            </div>
          </div>

          {/* КАРТОЧКИ (GRID) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20 w-full max-w-[1100px]">
            
            {/* Карточка 1: Чат */}
            <div className="bg-black border border-[#4D4D4D] rounded-[22px] overflow-hidden flex flex-col h-[520px]">
               {/* Иллюстрация (Точная копия из макета) */}
               <div className="relative h-[260px] flex justify-center">
                 <div className="anim-float w-[280px] h-[247px] border-[4px] border-[#DEDEDE] rounded-b-[46px] absolute top-0 overflow-hidden bg-black shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                    {/* Сообщение клиента */}
                    <div className="anim-bubble-user absolute top-[70px] left-[12px] w-[250px] bg-[#E9E9EB] rounded-t-[22px] rounded-br-[22px] p-3.5 flex flex-col gap-2">
                       <div className="flex gap-2"><div className="w-[30px] h-[8px] bg-black rounded-[2px]"></div><div className="w-[40px] h-[8px] bg-black rounded-[2px]"></div><div className="w-[20px] h-[8px] bg-black rounded-[2px]"></div></div>
                       <div className="flex gap-2"><div className="w-[50px] h-[8px] bg-black rounded-[2px]"></div><div className="w-[35px] h-[8px] bg-black rounded-[2px]"></div></div>
                    </div>
                    {/* Сообщение ИИ */}
                    <div className="anim-bubble-ai absolute top-[135px] left-[18px] w-[250px] bg-gradient-to-r from-[#61D6FB] to-[#8BFDA8] rounded-t-[22px] rounded-bl-[22px] p-3.5 flex flex-col gap-2">
                       <div className="flex gap-2"><div className="w-[35px] h-[8px] bg-black/80 rounded-[2px]"></div><div className="w-[45px] h-[8px] bg-black/80 rounded-[2px]"></div><div className="w-[25px] h-[8px] bg-black/80 rounded-[2px]"></div></div>
                       <div className="flex gap-2"><div className="w-[40px] h-[8px] bg-black/80 rounded-[2px]"></div><div className="w-[30px] h-[8px] bg-black/80 rounded-[2px]"></div><div className="w-[50px] h-[8px] bg-black/80 rounded-[2px]"></div></div>
                    </div>
                    {/* Поле ввода */}
                    <div className="absolute top-[195px] left-[20px] w-[237px] h-[39px] bg-white rounded-xl flex items-center p-1.5 justify-between">
                       <div className="flex gap-1.5 ml-2">
                          <div className="w-[20px] h-[4px] bg-[#6B6D6C] rounded-[2px]"></div><div className="w-[30px] h-[4px] bg-[#6B6D6C] rounded-[2px]"></div>
                       </div>
                       <div className="w-[28px] h-[28px] bg-black rounded-[8px] flex items-center justify-center">
                          <div className="w-[12px] h-[12px] bg-[#8BFDA8] rounded-[3px]"></div>
                       </div>
                    </div>
                 </div>
               </div>
               {/* Текст */}
               <div className="px-6 pb-8 pt-4 flex flex-col items-center text-center mt-auto">
                 <h3 className="text-[22px] font-bold text-white/60 mb-4">Закрепленный чат<br/>внизу экрана</h3>
                 <p className="text-[14px] text-white/80 leading-relaxed font-normal">
                   Знакомый интерфейс мессенджера на любом сайте. Приглашает клиентов начать диалог, а ИИ ответит на любые вопросы.
                 </p>
               </div>
            </div>

            {/* Карточка 2: Меню */}
            <div className="bg-black border border-[#4D4D4D] rounded-[22px] overflow-hidden flex flex-col h-[520px]">
               {/* Иллюстрация */}
               <div className="relative h-[260px] flex justify-center">
                 <div className="anim-float w-[280px] h-[247px] border-[4px] border-[#DEDEDE] rounded-b-[46px] absolute top-0 overflow-hidden bg-gradient-to-t from-[#272727] to-[#080808] flex flex-col items-center">
                    <div className="mt-8 bg-white/10 p-3 rounded-2xl border border-white/20 flex gap-4 w-[200px]">
                       <div className="w-10 h-10 bg-white/20 rounded-xl"></div>
                       <div className="flex flex-col gap-2 justify-center w-full">
                         <div className="h-2 w-full bg-white/20 rounded"></div>
                         <div className="h-2 w-2/3 bg-white/20 rounded"></div>
                       </div>
                    </div>
                    <div className="mt-4 bg-white/10 p-3 rounded-2xl border border-white/20 flex gap-4 w-[200px]">
                       <div className="w-10 h-10 bg-white/20 rounded-xl"></div>
                       <div className="flex flex-col gap-2 justify-center w-full">
                         <div className="h-2 w-full bg-white/20 rounded"></div>
                         <div className="h-2 w-1/2 bg-white/20 rounded"></div>
                       </div>
                    </div>
                 </div>
               </div>
               {/* Текст */}
               <div className="px-6 flex flex-col items-center text-center mt-4">
                 <h3 className="text-[22px] font-bold text-white/60 mb-4">Функциональное меню</h3>
                 <p className="text-[14px] text-white/80 leading-relaxed font-normal">
                   В одном меню есть все важные функции, чтобы клиент всегда нашел нужное.
                 </p>
               </div>
               {/* Преимущества внутри карточки */}
               <div className="mt-auto px-6 pb-8 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="anim-pulse-ring w-6 h-6 rounded-full border-[1.5px] border-[#8BFDA8] flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#8BFDA8] rounded-full"></div>
                    </div>
                    <span className="text-[14px] font-medium text-white">Работает 24/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md border-[1.5px] border-[#8BFDA8] flex items-center justify-center">
                      <div className="w-3 h-1.5 border-b-[1.5px] border-l-[1.5px] border-[#8BFDA8] -rotate-45 mb-0.5"></div>
                    </div>
                    <span className="text-[14px] font-medium text-white">Конверсия <span className="text-[#8BFDA8]">x2</span></span>
                  </div>
               </div>
            </div>

            {/* Карточка 3: Stories */}
            <div className="bg-black border border-[#4D4D4D] rounded-[22px] overflow-hidden flex flex-col h-[520px]">
               {/* Иллюстрация */}
               <div className="relative h-[260px] flex justify-center">
                 <div className="anim-float w-[280px] h-[247px] border-[4px] border-[#DEDEDE] rounded-b-[46px] absolute top-0 overflow-hidden bg-gradient-to-t from-transparent to-[#080808] flex flex-col items-center pt-10">
                    <div className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center z-10 mb-4">
                       <svg className="anim-story-ring absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                         <defs><linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8BFDA8"/><stop offset="100%" stopColor="#61D6FB"/></linearGradient></defs>
                         <circle cx="30" cy="30" r="28" stroke="url(#sg)" strokeWidth="3" fill="none" />
                       </svg>
                       <div className="w-[58px] h-[58px] bg-[#111] rounded-full border-2 border-black flex items-center justify-center">
                         <div className="w-6 h-6 border-2 border-white/50 rounded-sm"></div>
                       </div>
                    </div>
                    <div className="text-[12px] font-bold text-white/60 mb-1">Название компании</div>
                    <div className="text-[10px] text-white/40">Профиль, каталог, stories</div>
                 </div>
               </div>
               {/* Текст */}
               <div className="px-6 flex flex-col items-center text-center mt-4">
                 <h3 className="text-[22px] font-bold text-white mb-4 leading-tight">
                   <span className="text-[#8BFDA8]">Stories</span><br/>в виджете и на сайте
                 </h3>
                 <p className="text-[14px] text-white/80 leading-relaxed font-normal">
                   Все любят stories и теперь они будут у вас на сайте. Загружайте новинки и акции прямо из телефона.
                 </p>
               </div>
               {/* Иконка снизу */}
               <div className="mt-auto px-6 pb-8 flex items-center justify-center gap-3">
                  <div className="w-6 h-6 rounded-md border-[1.5px] border-[#8BFDA8] flex items-center justify-center">
                     <div className="w-2 h-2 bg-[#8BFDA8] rounded-full"></div>
                  </div>
                  <span className="text-[14px] font-medium text-white">Прогревает клиента</span>
               </div>
            </div>

          </div>

          {/* ========================================= */}
          {/* ВЕРТИКАЛЬНАЯ ЛИНИЯ ПРЕИМУЩЕСТВ (TIMELINE) */}
          {/* ========================================= */}
          <div className="mt-24 w-full max-w-[600px] mx-auto relative px-4">
             {/* Линия связи */}
             <div className="absolute left-[35px] top-6 bottom-6 w-[2px] bg-white/20"></div>

             <div className="flex flex-col gap-12">
                <div className="relative pl-16 flex flex-col gap-2">
                   <div className="absolute left-[24px] top-0 w-[24px] h-[24px] bg-black rounded-md border-[2px] border-[#8BFDA8] flex items-center justify-center z-10">
                      <div className="w-3 h-1.5 border-b-2 border-l-2 border-[#8BFDA8] -rotate-45 mb-0.5"></div>
                   </div>
                   <h4 className="text-[18px] font-normal text-white">Увеличивает доверие</h4>
                   <p className="text-[14px] text-white/60 leading-relaxed max-w-[400px]">
                      Сторис постепенно раскрывают ценность компании и подводят к покупке без давления.
                   </p>
                </div>

                <div className="relative pl-16 flex flex-col gap-2">
                   <div className="absolute left-[24px] top-0 w-[24px] h-[24px] bg-black rounded-md border-[2px] border-white flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                   </div>
                   <h4 className="text-[18px] font-normal text-white">Повышает конверсию</h4>
                   <p className="text-[14px] text-white/60 leading-relaxed max-w-[400px]">
                      Пользователь вовлекается в контент и чаще переходит к действию — написать или оставить заявку.
                   </p>
                </div>
             </div>
          </div>

        </main>
      </div>
    </>
  );
}