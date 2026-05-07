'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================================
  // АНИМАЦИЯ ФОНА (МИКРОТОЧКИ И ЗЕЛЕНЫЕ ВСПЫШКИ)
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let baseDots: { x: number, y: number }[] = [];
    let pulseDots: { x: number, y: number, alpha: number, speed: number }[] = [];
    let animationFrameId: number;
    
    const config = {
      baseColor: '#333333', // Темно-серые точки
      pulseColor: '#8BFDA8', // Неоновый зеленый
      dotSize: 1.5, // Размер точек
      spacing: 28, // Плотность сетки
      totalPulseDots: 35, // Кол-во анимированных точек
      activeZoneHeight: window.innerHeight * 1.5 // Убрано затухание, точки по всей высоте
    };

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = document.documentElement.scrollHeight; // На всю высоту документа
      
      initDots();
    }

    function initDots() {
        baseDots = [];
        pulseDots = [];
        
        // Создаем базовую сетку
        for (let x = 0; x < width; x += config.spacing) {
            for (let y = 0; y < height; y += config.spacing) {
                baseDots.push({ x, y });
            }
        }
        
        // Создаем анимированные точки
        for (let i = 0; i < config.totalPulseDots; i++) {
            const index = Math.floor(Math.random() * baseDots.length);
            pulseDots.push({
                x: baseDots[index].x,
                y: baseDots[index].y,
                alpha: Math.random(),
                speed: 0.003 + Math.random() * 0.006 // Медленное плавное мерцание
            });
        }
    }

    const handleResize = () => {
        resize();
    };

    window.addEventListener('resize', handleResize);

    function animate() {
        ctx!.clearRect(0, 0, width, height);
        ctx!.save();
        
        // Слой 1: Базовая сетка (Dark Gray)
        ctx!.fillStyle = config.baseColor;
        baseDots.forEach(dot => {
            ctx!.beginPath();
            ctx!.arc(dot.x, dot.y, config.dotSize, 0, Math.PI * 2);
            ctx!.fill();
        });
        
        // Слой 2: Анимированные неоновые точки
        pulseDots.forEach(dot => {
            dot.alpha += dot.speed;
            if (dot.alpha > 1 || dot.alpha < 0) dot.speed = -dot.speed;
            
            ctx!.globalAlpha = Math.max(0, dot.alpha); // Проверка на отрицательную прозрачность
            ctx!.fillStyle = config.pulseColor;
            
            // Добавляем небольшое свечение неоновой точке
            ctx!.shadowColor = config.pulseColor;
            ctx!.shadowBlur = 8;
            
            ctx!.beginPath();
            ctx!.arc(dot.x, dot.y, config.dotSize * 1.2, 0, Math.PI * 2);
            ctx!.fill();
            ctx!.shadowBlur = 0; // Сбрасываем тень для производительности
        });
        
        ctx!.restore();
        animationFrameId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#8BFDA8] selection:text-black relative">
      
      {/* CANVAS BACKGROUND (ОБНОВЛЕННЫЙ ФОН: ТОЧКИ И ЗЕЛЕНЫЕ ВСПЫШКИ) */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full z-0 pointer-events-none"
      />

      {/* КЛЮЧЕВЫЕ АНИМАЦИИ (Вшиты через CSS) */}
      <style dangerouslySetInnerHTML={{__html: `
        /* 1. Чат (Скелетный макет в точности как виджет) */
        .anim-msg-user { animation: chatUser 10s infinite; transform-origin: bottom right; }
        .anim-typing { animation: chatTyping 10s infinite; transform-origin: bottom left; }
        .anim-msg-ai { animation: chatAi 10s infinite; transform-origin: bottom left; }
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
        @keyframes dotBlink { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }

        /* 2. Stories (Анимация нативного вида) */
        .anim-story-avatar { animation: storyAvatar 10s infinite; }
        .anim-spin-grad { animation: spinGrad 3s linear infinite; }
        .anim-story-modal { animation: storyModal 10s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-origin: center; }
        .anim-story-cursor { animation: storyCursor 10s infinite; }
        .anim-story-btn { animation: storyBtn 10s infinite; }

        @keyframes storyAvatar {
          0%, 10% { transform: scale(1); opacity: 1; }
          13% { transform: scale(0.9); opacity: 1; }
          16%, 85% { transform: scale(0.9); opacity: 0; pointer-events: none; }
          90%, 100% { transform: scale(1); opacity: 1; }
        }
        @keyframes spinGrad { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes storyModal {
          0%, 15% { opacity: 0; transform: scale(0.5) translateY(50px); pointer-events: none; }
          20%, 80% { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
          85%, 100% { opacity: 0; transform: scale(0.8) translateY(20px); pointer-events: none; }
        }
        @keyframes storyCursor {
          0%, 30% { transform: translate(50px, 80px); opacity: 0; }
          35% { transform: translate(50px, 80px); opacity: 1; }
          50%, 65% { transform: translate(0px, 0px); opacity: 1; }
          70%, 100% { transform: translate(50px, 80px); opacity: 0; }
        }
        @keyframes storyBtn {
          0%, 53% { transform: scale(1); background: #262626; border-color: #333; }
          55% { transform: scale(0.95); background: #8BFDA8; border-color: #8BFDA8; }
          58%, 100% { transform: scale(1); background: #262626; border-color: #333; }
        }

        /* 3. Каталог (Скелетные карточки) */
        .anim-cat-cursor { animation: catCursor 10s infinite; }
        .anim-cat-btn { animation: catBtn 10s infinite; }
        .anim-cat-badge { animation: catBadge 10s infinite; }

        @keyframes catCursor {
          0%, 15% { transform: translate(60px, 60px); opacity: 0; }
          25% { transform: translate(60px, 60px); opacity: 1; }
          40%, 75% { transform: translate(0px, 0px); opacity: 1; }
          85%, 100% { transform: translate(60px, 60px); opacity: 0; }
        }
        @keyframes catBtn {
          0%, 48% { background-color: #262626; border-color: #333; }
          50% { background-color: #8BFDA8; border-color: #8BFDA8; }
          55%, 100% { background-color: #262626; border-color: #333; }
        }
        @keyframes catBadge { 0%, 50% { opacity: 0; transform: scale(0); } 55%, 90% { opacity: 1; transform: scale(1); } 95%, 100% { opacity: 0; transform: scale(0); } }

        /* 4. Заявки (Интерактивная форма) */
        .anim-lead-form { animation: leadForm 10s infinite; }
        .anim-lead-type1 { animation: leadType1 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-lead-type2 { animation: leadType2 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-lead-success { animation: leadSuccess 10s infinite; }

        @keyframes leadForm {
          0%, 65% { opacity: 1; transform: scale(1); pointer-events: auto; }
          70%, 100% { opacity: 0; transform: scale(0.9); pointer-events: none; }
        }
        @keyframes leadType1 { 0%, 15% { width: 0%; opacity: 0; } 25%, 100% { width: 60%; opacity: 1; } }
        @keyframes leadType2 { 0%, 30% { width: 0%; opacity: 0; } 40%, 100% { width: 80%; opacity: 1; } }
        @keyframes leadSuccess {
          0%, 65% { opacity: 0; transform: scale(0.5); pointer-events: none; }
          70%, 95% { opacity: 1; transform: scale(1); pointer-events: auto; }
          100% { opacity: 0; transform: scale(0.9); pointer-events: none; }
        }

        /* 5. Аналитика (Графики) */
        .anim-bar-1 { animation: bar1 10s infinite; }
        .anim-bar-2 { animation: bar2 10s infinite; }
        .anim-bar-3 { animation: bar3 10s infinite; }
        
        @keyframes bar1 { 0%, 10% { height: 10%; } 30%, 90% { height: 60%; } 100% { height: 10%; } }
        @keyframes bar2 { 0%, 20% { height: 15%; } 40%, 90% { height: 40%; } 100% { height: 15%; } }
        @keyframes bar3 { 0%, 30% { height: 20%; } 50%, 90% { height: 90%; } 100% { height: 20%; } }

        /* АНИМАЦИИ ШАГОВ ВНЕДРЕНИЯ */
        /* Шаг 1: Форма регистрации */
        .anim-step1-type { animation: step1Type 6s infinite; }
        .anim-step1-btn { animation: step1Btn 6s infinite; }
        @keyframes step1Type { 0%, 20% { width: 0%; } 40%, 100% { width: 70%; } }
        @keyframes step1Btn { 0%, 60% { background-color: #262626; transform: scale(1); } 65% { background-color: #8BFDA8; transform: scale(0.96); } 70%, 100% { background-color: #262626; transform: scale(1); } }

        /* Шаг 2: Каталог Drag'n'Drop */
        .anim-step2-drag { animation: step2Drag 6s infinite ease-in-out; }
        @keyframes step2Drag { 0% { transform: translate(0, 0); } 30% { transform: translate(50px, 30px); } 40% { transform: translate(50px, 30px); opacity: 0; } 41% { transform: translate(0, 0); opacity: 0; } 50%, 100% { transform: translate(0, 0); opacity: 1; } }

        /* Шаг 3: Copy-Paste Кода */
        .anim-step3-select { animation: step3Select 6s infinite; }
        .anim-step3-copy { animation: step3Copy 6s infinite; opacity: 0; }
        @keyframes step3Select { 0%, 20% { width: 0%; } 40% { width: 80%; } 100% { width: 80%; } }
        @keyframes step3Copy { 0%, 45% { opacity: 0; } 50%, 90% { opacity: 1; } 100% { opacity: 0; } }
      `}} />

      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-zinc-900 backdrop-blur-md bg-black/40">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
             <svg className="h-[14px] w-auto" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="white"/>
                <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="white"/>
                <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="white"/>
                <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
             </svg>
          </div>
          <nav className="flex items-center gap-5 text-[13px] font-medium text-zinc-400">
            <Link href="/login" className="hover:text-white transition-colors">
              Вход
            </Link>
            <Link href="/login" className="bg-[#1A1A1A] border border-zinc-800 text-white px-5 py-2 rounded-full hover:border-[#8BFDA8] hover:text-[#8BFDA8] transition-all active:scale-95">
              Регистрация
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-36 pb-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8BFDA8]/30 bg-[#8BFDA8]/10 text-[#8BFDA8] text-[11px] font-bold uppercase tracking-widest mb-8">
            <Zap size={12} fill="currentColor" className="animate-pulse" /> Полная автоматизация продаж
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            Превратим ваш сайт<br />
            в диалог с клиентом
          </h1>
          <p className="text-base md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Виджет AI NUR — это легкий и быстрый способ внедрить ИИ в сайт, который будет продавать 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto h-14 px-10 bg-[#8BFDA8] text-black rounded-[16px] font-bold text-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,253,168,0.4)] transition-all active:scale-95">
              Создать виджет бесплатно <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ФУНКЦИОНАЛ: Bento-сетка макетов (ЧЕРНЫЕ СКЕЛЕТОНЫ) */}
      <section id="features" className="relative z-10 py-16 px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          
          {/* КАРТОЧКА 1: ЧАТ (Полный черный макет) */}
          <div className="bg-[#111111] border border-zinc-800 rounded-[28px] overflow-hidden group">
            {/* Анимация ЧЕРНОГО СКЕЛЕТОНА */}
            <div className="h-[260px] bg-black border-b border-zinc-800 p-6 flex flex-col justify-end">
               <div className="w-[85%] self-start flex items-start gap-2.5 anim-msg-ai">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 shrink-0 border border-zinc-700"></div>
                  <div className="bg-[#1A1A1A] border border-zinc-800 px-4 py-2.5 rounded-2xl rounded-bl-sm flex flex-col gap-1.5 w-[240px]">
                     <div className="h-3 w-1/3 bg-zinc-700 rounded anim-typing flex gap-1.5 items-center px-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 dot-1"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 dot-2"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 dot-3"></div>
                     </div>
                     <div className="h-3 w-full bg-zinc-700 rounded"></div>
                     <div className="h-3 w-[70%] bg-zinc-700 rounded"></div>
                  </div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-8">
               <h3 className="text-xl font-bold mb-3 text-white">Умный ИИ-ассистент</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">ИИ знает ваш каталог и отвечает за 1 секунду. Не придумывает цены. Забирает контакты.</p>
               <ul className="space-y-2 text-[13px] text-zinc-300">
                  {[
                    "Отвечает на 98% вопросов мгновенно.",
                    "Разгружает поддержку.",
                    "Обучается на вашем промпте."
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                       <CheckCircle2 size={16} className="text-[#8BFDA8] shrink-0" /> {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>

          {/* КАРТОЧКА 2: STORIES */}
          <div className="bg-[#111111] border border-zinc-800 rounded-[28px] overflow-hidden">
            {/* Анимация STORIES */}
            <div className="h-[260px] bg-black border-b border-zinc-800 flex items-center justify-center p-6 relative">
                {/* Кружок Stories (Как в реальном виджете) */}
                <div className="anim-story-avatar relative w-20 h-20 flex-shrink-0 z-10 border border-zinc-800 bg-[#1A1A1A] rounded-full flex items-center justify-center cursor-pointer shadow-lg">
                    <svg className="anim-spin-grad absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                        <defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8BFDA8" stopOpacity="0.4"/><stop offset="100%" stopColor="#00B0F2" stopOpacity="0.4"/></linearGradient></defs>
                        <circle cx="30" cy="30" r="28" stroke="url(#g1)" strokeWidth="4" fill="none" strokeLinecap="round" />
                    </svg>
                    <div className="text-zinc-600 text-[10px] font-black uppercase">Видео</div>
                </div>

                {/* Модалка Сториса (При наведении) */}
                <div className="anim-story-modal absolute inset-0 bg-black/70 backdrop-blur-sm p-8 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-[200px] h-[300px] bg-[#111111] border border-zinc-800 rounded-[20px] flex flex-col relative overflow-hidden shadow-2xl">
                        <div className="absolute top-2 left-2 right-2 flex gap-1.5"><div className="h-1 bg-zinc-800 w-full rounded"></div><div className="h-1 bg-white/20 w-full rounded"></div></div>
                        <div className="flex-1 flex items-center justify-center text-zinc-800 font-black text-xl">МАКЕТ</div>
                        <div className="p-4 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent">
                            <div className="anim-story-btn w-full bg-[#262626] border border-zinc-800 text-zinc-400 text-xs font-bold py-2.5 rounded-lg text-center">Оставить заявку</div>
                        </div>
                        {/* Неоновый зеленый курсор */}
                        <div className="anim-story-cursor absolute bottom-2 right-4 z-30" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'}}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#8BFDA8" stroke="black" strokeWidth="1"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86 3.6 7.4c.14.28.47.4.75.26l2.16-1.05c.28-.14.4-.47.26-.75l-3.55-7.3 5.48-.55c.44-.04.62-.6.28-.88L6.34 2.86c-.32-.28-.84-.06-.84.35z"/></svg>
                        </div>
                    </div>
                </div>
            </div>
            {/* Текст */}
            <div className="p-8 group-hover:bg-[#161616] transition-colors">
               <h3 className="text-xl font-bold mb-3 text-white">Интерактивные Stories</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">Делитесь акциями в привычном формате. Узнаваемый круг виджета.</p>
               <ul className="space-y-2 text-[13px] text-zinc-300">
                  {[
                    "Полностью кастомизируемый круг виджета.",
                    "Загружайте видео/фото в один клик.",
                    "Кнопка действия (CTA) внутри."
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                       <CheckCircle2 size={16} className="text-[#8BFDA8] shrink-0" /> {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>

          {/* КАРТОЧКА 3: КАТАЛОГ */}
          <div className="bg-[#111111] border border-zinc-800 rounded-[28px] overflow-hidden group">
            {/* Анимация ЧЕРНЫХ СКЕЛЕТОВ КАТАЛОГА */}
            <div className="h-[260px] bg-black border-b border-zinc-800 p-6 flex items-center justify-center relative">
               <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 w-[240px] shadow-2xl relative">
                  <div className="w-full h-[110px] bg-zinc-800 rounded-lg mb-3 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C2C2E" strokeWidth="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <div className="h-3 w-3/4 bg-zinc-700 rounded mb-2.5"></div>
                  <div className="h-3 w-1/3 bg-zinc-800 rounded mb-4"></div>
                  <div className="anim-cat-btn bg-[#262626] border border-zinc-800 text-zinc-400 text-xs font-bold py-2.5 rounded-lg text-center">Заказать</div>
                  {/* Зеленый неоновый курсор */}
                  <div className="anim-cat-cursor absolute bottom-2 right-4 z-20" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#8BFDA8" stroke="black" strokeWidth="1"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86 3.6 7.4c.14.28.47.4.75.26l2.16-1.05c.28-.14.4-.47.26-.75l-3.55-7.3 5.48-.55c.44-.04.62-.6.28-.88L6.34 2.86c-.32-.28-.84-.06-.84.35z"/></svg>
                  </div>
                  <div className="anim-cat-badge absolute -top-1 -right-1 w-4 h-4 bg-[#8BFDA8] text-black text-[11px] font-bold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">1</div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-8 group-hover:bg-[#161616] transition-colors">
               <h3 className="text-xl font-bold mb-3 text-white">Встроенный каталог</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">Услуги прямо в чате. Не нужно искать товары на основном сайте.</p>
               <ul className="space-y-2 text-[13px] text-zinc-300">
                  {[
                    "Автоматический импорт из админки.",
                    "Удобная корзина и чекаут.",
                    "Мгновенный переход к оплате."
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                       <CheckCircle2 size={16} className="text-[#8BFDA8] shrink-0" /> {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>

          {/* КАРТОЧКА 4: ЗАЯВКИ (ЧЕРНЫЕ СКЕЛЕТЫ ЛИДОВ) */}
          <div className="bg-[#111111] border border-zinc-800 rounded-[28px] overflow-hidden group">
            {/* Анимация ЛИДОВ */}
            <div className="h-[260px] bg-black border-b border-zinc-800 p-6 flex items-center justify-center relative">
               <div className="anim-lead-form bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[260px] flex flex-col gap-3 shadow-2xl">
                  <div className="h-3.5 w-1/2 bg-zinc-800 rounded mb-2 mx-auto"></div>
                  {[
                    {w: "80%", type: "anim-lead-type1"},
                    {w: "full", type: "anim-lead-type2"},
                  ].map((field, idx) => (
                    <div key={idx} className="h-10 w-full bg-[#1A1A1A] rounded-xl relative overflow-hidden px-3.5 flex items-center border border-zinc-800">
                        <div className={`h-3 bg-zinc-700 rounded ${field.type}`}></div>
                    </div>
                  ))}
                  <div className="bg-[#262626] text-zinc-400 font-bold text-sm py-3 rounded-xl text-center mt-2 group-hover:bg-[#8BFDA8] group-hover:text-black transition-colors">Отправить</div>
               </div>
               <div className="anim-lead-success absolute inset-0 bg-[#34C759]/10 border border-[#34C759] backdrop-blur-lg p-10 flex flex-col items-center justify-center gap-4 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all">
                  <div className="w-14 h-14 bg-[#34C759] rounded-full flex items-center justify-center border border-[#FFFFFF]/20">
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="text-white font-bold">Лид забран!</div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-8 group-hover:bg-[#161616] transition-colors">
               <h3 className="text-xl font-bold mb-3 text-white">Генерация лидов</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">ИИ ненавязчиво собирает контакты, если клиент сомневается.</p>
               <ul className="space-y-2 text-[13px] text-zinc-300">
                  {[
                    "Автоматическое определение намерения покупки.",
                    "Интеграция с WhatsApp / Telegram.",
                    "Готовая CRM внутри админки."
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                       <CheckCircle2 size={16} className="text-[#8BFDA8] shrink-0" /> {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>

          {/* КАРТОЧКА 5: АНАЛИТИКА */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-[#111111] border border-zinc-800 rounded-[28px] overflow-hidden group">
            {/* Анимация ЧЕРНОЙ АНАЛИТИКИ */}
            <div className="h-[260px] bg-black border-b border-zinc-800 p-8 flex items-end justify-between relative overflow-hidden">
               <div className="flex items-end gap-3.5 pb-2 pl-3">
                  {[
                    {h: "anim-bar-1", val: "1.2k"},
                    {h: "anim-bar-2", val: "840"},
                    {h: "anim-bar-3", val: "3.4k", active: true},
                  ].map((bar, idx) => (
                    <div key={idx} className={`w-14 bg-[#1A1A1A] border border-zinc-800 rounded-t-lg ${bar.h} relative ${bar.active ? 'group-hover:border-[#8BFDA8] group-hover:bg-[#8BFDA8]/5 group-hover:shadow-[0_0_20px_rgba(139,253,168,0.3)]' : ''} transition-all`}>
                        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono font-bold ${bar.active ? 'text-white' : 'text-zinc-600'}`}>{bar.val}</div>
                    </div>
                  ))}
               </div>
               {/* Неоновый зеленый линейный график */}
               <svg className="absolute top-1/2 right-10 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" width="220" height="120" viewBox="0 0 220 120">
                  <path d="M0,110 C40,90 60,60 100,50 S140,20 180,10 L220,10" fill="none" stroke="#8BFDA8" strokeWidth="4" strokeLinecap="round" style={{filter: 'drop-shadow(0 0 10px #8BFDA8)'}}/>
                  <path d="M0,110 C40,90 60,60 100,50 S140,20 180,10 L220,10 L220,120 L0,120 Z" fill="url(#ga)" stroke="none" />
                  <defs><linearGradient id="ga" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8BFDA8" stopOpacity="0.2"/><stop offset="100%" stopColor="#8BFDA8" stopOpacity="0"/></linearGradient></defs>
               </svg>
            </div>
            {/* Текст */}
            <div className="p-8 group-hover:bg-[#161616] transition-colors">
               <h3 className="text-xl font-bold mb-3 text-white">Сквозная аналитика</h3>
               <p className="text-zinc-400 text-sm leading-relaxed mb-4">Полный контроль. Узнайте, сколько ИИ принес денег и лидов.</p>
               <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px] text-zinc-300">
                  {[
                    "Трекинг кликов.",
                    "Просмотры Stories.",
                    "Конверсия в покупку.",
                    "Гео-данные.",
                    "Браузеры.",
                    "Воронка продаж."
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                       <CheckCircle2 size={16} className="text-[#8BFDA8] shrink-0" /> {item}
                    </li>
                  ))}
               </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ШАГИ ВНЕДРЕНИЯ (Новая секция) */}
      <section className="relative z-10 py-20 px-6 max-w-[1200px] mx-auto">
        <h2 className="text-3xl md:text-5xl font-black mb-16 tracking-tighter text-left">Внедри ИИ в свой сайт за <span className="text-[#8BFDA8]">3 шага</span></h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Шаг 1: Форма регистрации */}
          <div className="bg-[#111111] border border-zinc-800 rounded-[28px] overflow-hidden group">
            <div className="h-[240px] bg-black border-b border-zinc-800 p-8 flex items-center justify-center relative">
               <div className="bg-[#111111] border border-zinc-800 rounded-[18px] p-5 w-[200px] shadow-lg relative z-10 flex flex-col gap-3">
                  <div className="h-4 w-1/2 bg-zinc-800 rounded mb-1 mx-auto"></div>
                  <div className="h-9 w-full bg-[#1A1A1A] rounded-lg border border-zinc-800 flex items-center px-3 relative overflow-hidden">
                    <div className="anim-step1-type h-3 bg-zinc-700 rounded"></div>
                  </div>
                  <div className="h-9 w-full bg-[#1A1A1A] rounded-lg border border-zinc-800 flex items-center px-3 relative overflow-hidden">
                    <div className="anim-step1-type h-3 bg-zinc-700 rounded" style={{animationDelay: '1.5s'}}></div>
                  </div>
                  <div className="anim-step1-btn h-10 w-full bg-[#262626] text-white font-bold text-sm py-2 rounded-xl text-center mt-1 border border-zinc-800">Создать</div>
               </div>
               <div className="absolute w-24 h-24 bg-[#8BFDA8] rounded-full blur-[90px] opacity-10"></div>
            </div>
            <div className="p-8">
               <span className="text-[#8BFDA8] font-bold text-lg mb-2 block">1 шаг</span>
               <h3 className="text-2xl font-black mb-3 leading-tight text-white">Регистрация и промпт</h3>
               <p className="text-zinc-400 text-sm leading-relaxed">Создайте аккаунт и обучите ИИ-ассистента правилам игры.</p>
            </div>
          </div>

          {/* Шаг 2: Каталог Drag'n'Drop */}
          <div className="bg-[#111111] border border-zinc-800 rounded-[28px] overflow-hidden">
            <div className="h-[240px] bg-black border-b border-zinc-800 p-8 flex items-center justify-center relative">
               <div className="w-[80%] flex items-center justify-between gap-3 relative z-10">
                  <div className="w-1/2 p-3 bg-[#111111] border border-zinc-800 rounded-xl anim-step2-drag">
                    <div className="w-full h-[60px] bg-zinc-800 rounded mb-2 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2E" strokeWidth="2"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    </div>
                    <div className="h-2 w-2/3 bg-zinc-700 rounded mb-1.5"></div>
                    <div className="h-2 w-1/3 bg-zinc-800 rounded"></div>
                  </div>
                  <div className="w-1/2 h-[100px] border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center text-zinc-700 font-medium">КАТАЛОГ</div>
               </div>
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8BFDA8] to-transparent opacity-20"></div>
            </div>
            <div className="p-8">
               <span className="text-[#8BFDA8] font-bold text-lg mb-2 block">2 шаг</span>
               <h3 className="text-2xl font-black mb-3 leading-tight text-white">Товары и Stories</h3>
               <p className="text-zinc-400 text-sm leading-relaxed">Загрузите каталог услуг и добавьте вовлекающие истории.</p>
            </div>
          </div>

          {/* Шаг 3: Код в body */}
          <div className="bg-[#111111] border border-zinc-800 rounded-[28px] overflow-hidden group">
            <div className="h-[240px] bg-black border-b border-zinc-800 p-8 flex items-center justify-center relative">
               <div className="bg-[#111111] border border-zinc-800 rounded-xl p-5 w-full font-mono text-[10px] text-zinc-600 relative z-10 flex flex-col gap-1.5 overflow-hidden shadow-lg border border-zinc-800">
                  <div className="anim-step3-select absolute bottom-5 left-1/2 -translate-x-1/2 h-4.5 bg-[#8BFDA8]/10 border border-[#8BFDA8]/30 rounded"></div>
                  <div className="anim-step3-copy absolute top-3 right-3 text-[#8BFDA8] font-bold text-[9px] bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-[#8BFDA8]/30">COPY</div>
                  <p><span className="text-zinc-700">&lt;body&gt;</span></p>
                  <p>...</p>
                  <p><span className="text-zinc-500">&lt;!-- AI NUR widget script --&gt;</span></p>
                  <p><span className="text-white">&lt;script <span className="text-zinc-400">src</span><span className="text-[#8BFDA8]">&quot;...ainur.pro/w.js&quot;</span> <span className="text-zinc-400">id</span><span className="text-[#8BFDA8]">&quot;nur-w&quot;</span>&gt;&lt;/script&gt;</span></p>
                  <p><span className="text-white">&lt;script&gt;<span className="text-zinc-400">AinurW</span><span className="text-zinc-500">.init</span>({<span className="text-zinc-400">id:</span> <span className="text-[#8BFDA8]">&quot;nur-user-5a...9e&quot;</span>})&lt;/script&gt;</span></p>
                  <p><span className="text-zinc-700">&lt;/body&gt;</span></p>
               </div>
               <div className="absolute w-24 h-24 bg-[#00B0F2] rounded-full blur-[90px] opacity-10"></div>
            </div>
            <div className="p-8">
               <span className="text-[#8BFDA8] font-bold text-lg mb-2 block">3 шаг</span>
               <h3 className="text-2xl font-black mb-3 leading-tight text-white">Установка кода</h3>
               <p className="text-zinc-400 text-sm leading-relaxed">Просто вставьте одну строку кода перед закрывающим <span className="font-mono text-xs text-white">&lt;/body&gt;</span>.</p>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-32 border-t border-zinc-900 bg-gradient-to-b from-transparent to-[#8BFDA8]/5 mt-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">Начните собирать заявки <br /> уже сегодня</h2>
          <p className="text-lg md:text-xl text-zinc-400 mb-12">Регистрация и базовая настройка бесплатны. Протестируйте бесплатно 7 дней.</p>
          <Link href="/login" className="inline-flex h-16 px-12 bg-[#8BFDA8] text-black rounded-[20px] font-black text-xl items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-[0_0_40px_rgba(139,253,168,0.3)]">
            Попробовать AI NUR бесплатно
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-12 border-t border-zinc-900 bg-black">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-600">
          <div className="opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer flex items-center">
             <span className="text-white font-black text-xl tracking-tighter">AI NUR</span>
          </div>
          <p>© 2026 AI NUR Platform. Все права защищены. <br/> <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a></p>
          <p>Сделано с любовью к ИИ.<br/> <a href="https://t.me/pro_nur" className="hover:text-white transition-colors">t.me/pro_nur</a></p>
        </div>
      </footer>

    </div>
  );
}