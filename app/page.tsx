/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  
  // =========================================================================
  // 🖼️ МЕСТО ДЛЯ ВАШИХ КАРТИНОК В ГАЛЕРЕЯХ
  // Вставляйте ссылки между кавычками. Если оставить "", будет серая заглушка.
  // =========================================================================

  const gallery1Images = [
    "https://static.tildacdn.com/tild6335-6637-4734-a563-626562343333/MacBook_Pro_14__-_8.png", 
    "https://static.tildacdn.com/tild6636-3561-4235-b638-313831386332/MacBook_Pro_14__-_11.png", 
    "https://static.tildacdn.com/tild6362-3737-4937-a633-383865346436/MacBook_Pro_14__-_12.png", 
  ];

  const gallery2Images = [
    "https://static.tildacdn.com/tild3837-6531-4530-b032-303032653437/MacBook_Pro_14__-_4-.png", 
    "https://static.tildacdn.com/tild3438-3464-4364-b465-343134333566/MacBook_Pro_14__-_5-.png", 
    "https://static.tildacdn.com/tild3236-3238-4637-a239-336436316362/MacBook_Pro_14__-_6.png",  
  ];

  const gallery3Images = [
    "https://static.tildacdn.com/tild3837-6531-4530-b032-303032653437/MacBook_Pro_14__-_4-.png", 
    "https://static.tildacdn.com/tild3438-3464-4364-b465-343134333566/MacBook_Pro_14__-_5-.png", 
    "https://static.tildacdn.com/tild3236-3238-4637-a239-336436316362/MacBook_Pro_14__-_6.png", 
  ];

  // =========================================================================

  // Состояния для полноэкранной галереи
  const [fullscreenData, setFullscreenData] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);

  // Состояния для свайпа
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  // Установка виджета AI NUR при загрузке страницы
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      (function(){
          var iframe = document.createElement('iframe');
          iframe.src = "https://ainur-backend-eta.vercel.app/widget.html?id=bd4295ee-5a49-4e4b-b90b-c4388121b208";
          iframe.style.position = "fixed";
          iframe.style.bottom = "0";
          iframe.style.left = "50%";
          iframe.style.transform = "translateX(-50%)";
          iframe.style.width = "100%";
          iframe.style.maxWidth = "400px";
          iframe.style.height = "120px";
          iframe.style.border = "none";
          iframe.style.zIndex = "999999";
          iframe.style.background = "transparent";
          iframe.style.transition = "height 0.3s ease, max-width 0.3s ease";
          document.body.appendChild(iframe);

          window.addEventListener('message', function(e) {
              if(e.data === 'ainur_opened') {
                  iframe.style.height = "750px";
                  iframe.style.maxWidth = "400px";
              } else if(e.data === 'ainur_closed') {
                  iframe.style.height = "120px";
                  iframe.style.maxWidth = "400px";
              } else if(e.data === 'ainur_fullscreen') {
                  iframe.style.height = "100vh";
                  iframe.style.maxWidth = "100vw";
              }
          });
      })();
    `;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  // Функция для открытия картинки в полноэкранном режиме
  const openImageFullscreen = (imagesArray: string[], index: number) => {
    setFullscreenData({ images: imagesArray, currentIndex: index });
  };

  const nextFullscreen = () => {
    if (fullscreenData) {
      setFullscreenData({
        ...fullscreenData,
        currentIndex: (fullscreenData.currentIndex + 1) % fullscreenData.images.length
      });
    }
  };

  const prevFullscreen = () => {
    if (fullscreenData) {
      setFullscreenData({
        ...fullscreenData,
        currentIndex: (fullscreenData.currentIndex - 1 + fullscreenData.images.length) % fullscreenData.images.length
      });
    }
  };

  const nextFullscreenImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextFullscreen();
  };

  const prevFullscreenImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevFullscreen();
  };

  const closeFullscreen = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setFullscreenData(null);
    }
  };

  // Обработчики свайпов на телефоне
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndEvent = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextFullscreen();
    if (distance < -minSwipeDistance) prevFullscreen();
  };

  const scrollGallery = (id: string, direction: 'left' | 'right') => {
    const gallery = document.getElementById(id);
    if (gallery) {
      const scrollAmount = direction === 'left' ? -233 : 233; 
      gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const Logo = ({ isDark = false }: { isDark?: boolean }) => (
    <svg width="141" height="20" viewBox="0 0 141 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-auto">
      <path d="M140.125 19.6816H132.108L127.795 14.5587H118.591V19.6816H112.6V9.78305H129.445C130.371 9.78305 131.153 9.5901 131.79 9.20418C132.426 8.81827 132.745 8.28765 132.745 7.61231C132.745 6.85978 132.455 6.30021 131.876 5.9336C131.298 5.54769 130.487 5.35473 129.445 5.35473H112.6V0.318604H128.953C130.053 0.318604 131.191 0.424729 132.368 0.636979C133.545 0.829935 134.616 1.1869 135.581 1.70788C136.546 2.22886 137.337 2.93315 137.954 3.82074C138.591 4.70833 138.91 5.84677 138.91 7.23604C138.91 7.98857 138.794 8.7025 138.562 9.37784C138.331 10.0532 137.993 10.661 137.549 11.2013C137.125 11.7415 136.594 12.2046 135.957 12.5905C135.34 12.9572 134.636 13.2177 133.845 13.372C134.173 13.6229 134.539 13.9412 134.944 14.3271C135.35 14.7131 135.89 15.2437 136.565 15.919L140.125 19.6816Z" fill={isDark ? "white" : "black"}/>
      <path d="M109.262 11.2302C109.262 17.0768 105.239 20 97.193 20C94.8582 20 92.8515 19.8167 91.1728 19.4501C89.4941 19.0835 88.1048 18.5336 87.0049 17.8003C85.9244 17.0671 85.1236 16.1602 84.6026 15.0797C84.1009 13.9798 83.8501 12.6967 83.8501 11.2302V0.318604H89.8124V11.2302C89.8124 11.9441 89.9089 12.5423 90.1019 13.0247C90.2948 13.5071 90.6518 13.9026 91.1728 14.2114C91.713 14.5008 92.4656 14.7131 93.4303 14.8481C94.3951 14.9639 95.6493 15.0218 97.193 15.0218C98.3507 15.0218 99.3155 14.9542 100.087 14.8192C100.859 14.6841 101.477 14.4622 101.94 14.1535C102.403 13.8448 102.731 13.4492 102.924 12.9668C103.136 12.4844 103.242 11.9056 103.242 11.2302V0.318604H109.262V11.2302Z" fill={isDark ? "white" : "black"}/>
      <path d="M77.2798 19.9998C76.8939 19.9998 76.508 19.9323 76.122 19.7972C75.7554 19.6814 75.3406 19.4016 74.8775 18.9578L63.0107 8.30672V19.6814H57.5693V3.61791C57.5693 2.98116 57.6562 2.43123 57.8298 1.96814C58.0228 1.50505 58.264 1.12879 58.5534 0.839354C58.8621 0.549922 59.2095 0.337671 59.5954 0.202602C60.0006 0.067534 60.4154 0 60.8399 0C61.2066 0 61.5732 0.067534 61.9398 0.202602C62.3257 0.318375 62.7599 0.598159 63.2422 1.04196L75.109 11.6931V0.318375H80.5793V16.3529C80.5793 16.9897 80.4828 17.5396 80.2899 18.0027C80.1162 18.4658 79.875 18.8517 79.5663 19.1604C79.2769 19.4499 78.9296 19.6621 78.5243 19.7972C78.1191 19.9323 77.7043 19.9998 77.2798 19.9998Z" fill={isDark ? "white" : "black"}/>
      <path d="M16.2949 0C17.2018 0 17.9546 0.21223 18.5527 0.636719C19.1702 1.0419 19.6907 1.5535 20.1152 2.1709L32.2139 19.6816H9.69629L13.3135 14.7031H19.9707C20.6075 14.7031 21.158 14.7222 21.6211 14.7607C21.351 14.4135 21.0325 13.9798 20.666 13.459C20.3187 12.9188 19.9803 12.4171 19.6523 11.9541L16.1797 6.83105L7.09082 19.6816H0L12.417 2.1709C12.8222 1.61136 13.3337 1.10979 13.9512 0.666016C14.5686 0.222338 15.3496 3.10811e-05 16.2949 0ZM40.4277 19.6816H34.4365V0.318359H40.4277V19.6816Z" fill="#8BFDA8"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans selection:bg-[#8BFDA8] selection:text-black flex flex-col items-center overflow-x-hidden relative pb-[100px]">
      
      {/* МОДАЛЬНОЕ ОКНО ДЛЯ КАРТИНОК НА ВЕСЬ ЭКРАН (С ГАЛЕРЕЕЙ И СВАЙПАМИ) */}
      {fullscreenData && (
        <div 
          className="fixed inset-0 z-[1000000] bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={closeFullscreen}
        >
          {/* Кнопка закрыть */}
          <div 
            className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-colors cursor-pointer z-20"
            onClick={() => setFullscreenData(null)}
          >
            <X size={24} />
          </div>

          <div className="relative flex items-center justify-center w-full max-w-5xl h-[85vh]">
             {/* Кнопка Влево (теперь отображается всегда) */}
             <button 
                onClick={prevFullscreenImage}
                className="absolute left-2 md:left-4 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors z-20 flex cursor-pointer"
             >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
             </button>

             {/* Область картинки со свайпами */}
             <div 
               className="relative h-full flex items-center justify-center w-full z-10" 
               onClick={(e) => e.stopPropagation()}
               onTouchStart={onTouchStart}
               onTouchMove={onTouchMove}
               onTouchEnd={onTouchEndEvent}
             >
                {fullscreenData.images[fullscreenData.currentIndex] ? (
                  <img 
                    src={fullscreenData.images[fullscreenData.currentIndex]} 
                    alt={`Fullscreen image ${fullscreenData.currentIndex + 1}`} 
                    className="max-w-full max-h-full object-contain rounded-[22px] shadow-2xl cursor-default select-none pointer-events-none" 
                  />
                ) : (
                  <div className="w-full max-w-sm aspect-[9/16] bg-[#D9D9D9] rounded-[22px] shadow-2xl cursor-default" />
                )}
             </div>

             {/* Кнопка Вправо (теперь отображается всегда) */}
             <button 
                onClick={nextFullscreenImage}
                className="absolute right-2 md:right-4 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors z-20 flex cursor-pointer"
             >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
             </button>
          </div>

          {/* Индикаторы (Точки внизу) */}
          <div className="absolute bottom-10 flex gap-2 z-20" onClick={(e) => e.stopPropagation()}>
            {fullscreenData.images.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setFullscreenData({ ...fullscreenData, currentIndex: idx })}
                className={`w-2 h-2 rounded-full transition-all ${idx === fullscreenData.currentIndex ? 'bg-[#8BFDA8] w-6' : 'bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 1. ФИКСИРОВАННЫЙ HEADER */}
      <div className="fixed top-[10px] w-[340px] md:w-[690px] z-50 bg-[#FFFFFF] rounded-[22px] pl-[20px] pr-[10px] py-[10px] border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link href="/register" className="h-[40px] md:h-[50px] px-[13px] bg-[#8BFDA8] rounded-[11px] flex items-center justify-center active:scale-95 transition-transform">
            <span className="text-[#000000] text-[13px] md:text-[14px] font-bold leading-none">Регистрация</span>
          </Link>
        </div>
      </div>

      {/* ГЛАВНЫЙ КОНТЕЙНЕР (С отступом 36px между блоками на мобилке) */}
      <main className="w-[340px] md:w-[690px] mx-auto pt-[120px] flex flex-col gap-[36px] md:gap-10">

        {/* БЛОК 1: ДИАЛОГ С КЛИЕНТАМИ (Отступ 12px внутри на мобилке) */}
        <section className="flex flex-col gap-[12px] md:gap-[26px]">
          <h1 className="text-[22px] md:text-[34px] font-bold text-[#000000] leading-tight md:max-w-[456px]">
            Превращаем сайты в диалог с клиентами
          </h1>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-[12px] md:gap-[163px]">
            <p className="text-[14px] md:text-[16px] text-[#000000] font-normal md:w-[457px] leading-relaxed">
              AI NUR это современный способ быстро превратить любой сайт в диалог с клиентом.
            </p>
            <div className="hidden md:flex items-center gap-[10px] shrink-0">
              <button onClick={() => scrollGallery('gallery-1', 'left')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowLeft size={14} strokeWidth={2.5}/>
              </button>
              <button onClick={() => scrollGallery('gallery-1', 'right')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowRight size={14} strokeWidth={2.5}/>
              </button>
            </div>
          </div>

          <div id="gallery-1" className="w-[100vw] md:w-full -ml-[calc((100vw-340px)/2)] md:ml-0 pl-[calc((100vw-340px)/2)] md:pl-0 flex items-center gap-[10px] overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {gallery1Images.map((src, index) => (
              <div 
                key={index}
                onClick={() => openImageFullscreen(gallery1Images, index)} 
                className={`w-[223px] h-[396px] ${src ? 'bg-[#FFFFFF] border border-[#E5E5EA]' : 'bg-[#D9D9D9]'} rounded-[22px] shrink-0 snap-center bg-cover bg-no-repeat bg-center cursor-zoom-in active:scale-[0.98] transition-transform shadow-sm`}
                style={src ? { backgroundImage: `url('${src}')` } : {}}
              ></div>
            ))}
            <div className="shrink-0 w-[calc((100vw-340px)/2)] h-[1px] md:hidden"></div>
          </div>
        </section>


        {/* БЛОК 2: БОЛЬШОЙ ФУНКЦИОНАЛ */}
        <section className="flex flex-col gap-[12px] md:gap-[26px]">
          <h2 className="text-[22px] md:text-[34px] font-bold text-[#000000] leading-tight md:max-w-[456px]">
            Большой функционал в одном виджете
          </h2>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-[12px] md:gap-[163px]">
            <p className="text-[14px] md:text-[16px] text-[#000000] font-normal md:w-[457px] leading-relaxed">
              В виджете вы можете делиться stories, чтобы рассказать об акции. Или превратить обычный сайт в интернет магазин
            </p>
            <div className="hidden md:flex items-center gap-[10px] shrink-0">
              <button onClick={() => scrollGallery('gallery-2', 'left')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowLeft size={14} strokeWidth={2.5}/>
              </button>
              <button onClick={() => scrollGallery('gallery-2', 'right')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowRight size={14} strokeWidth={2.5}/>
              </button>
            </div>
          </div>

          <div id="gallery-2" className="w-[100vw] md:w-full -ml-[calc((100vw-340px)/2)] md:ml-0 pl-[calc((100vw-340px)/2)] md:pl-0 flex items-center gap-[10px] overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {gallery2Images.map((src, index) => (
              <div 
                key={index}
                onClick={() => openImageFullscreen(gallery2Images, index)} 
                className={`w-[223px] h-[396px] ${src ? 'bg-[#FFFFFF] border border-[#E5E5EA]' : 'bg-[#D9D9D9]'} rounded-[22px] shrink-0 snap-center bg-cover bg-no-repeat bg-center cursor-zoom-in active:scale-[0.98] transition-transform shadow-sm`}
                style={src ? { backgroundImage: `url('${src}')` } : {}}
              ></div>
            ))}
            <div className="shrink-0 w-[calc((100vw-340px)/2)] h-[1px] md:hidden"></div>
          </div>
        </section>


        {/* БЛОК 3: ТАРИФЫ (КАК ГАЛЕРЕЯ) */}
        <section className="flex flex-col gap-[12px] md:gap-[26px]">
          <h2 className="text-[22px] md:text-[34px] font-bold text-[#000000] leading-tight md:max-w-[456px]">
            Начните прямо сейчас
          </h2>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-[12px] md:gap-[163px]">
            <p className="text-[14px] md:text-[16px] text-[#000000] font-normal md:w-[457px] leading-relaxed">
              Выберите подходящий тариф. Вы можете начать бесплатно и протестировать все возможности прямо сейчас.
            </p>
            <div className="hidden md:flex items-center gap-[10px] shrink-0">
              <button onClick={() => scrollGallery('gallery-pricing', 'left')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowLeft size={14} strokeWidth={2.5}/>
              </button>
              <button onClick={() => scrollGallery('gallery-pricing', 'right')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowRight size={14} strokeWidth={2.5}/>
              </button>
            </div>
          </div>

          <div id="gallery-pricing" className="w-[100vw] md:w-full -ml-[calc((100vw-340px)/2)] md:ml-0 pl-[calc((100vw-340px)/2)] md:pl-0 flex items-stretch gap-[10px] overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
             
             {/* Тариф 1: Бесплатно */}
             <div className="w-[223px] h-[396px] bg-[#FFFFFF] border border-[#E5E5EA] rounded-[22px] p-5 flex flex-col shrink-0 snap-center shadow-sm">
                <div className="mb-4">
                   <div className="text-[#8E8E93] text-[13px] font-medium mb-1">Ознакомительный</div>
                   <div className="text-[24px] font-bold text-[#000000] leading-none">Бесплатно</div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#000000] text-[13px] font-medium leading-snug">Настройка ИИ под себя</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#000000] text-[13px] font-medium leading-snug">Свой цвет и дизайн</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#000000] text-[13px] font-medium leading-snug">Аналитика конверсии</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#000000] text-[13px] font-medium leading-snug">Тест в админке</span>
                   </div>
                   <div className="flex items-start gap-2 opacity-50 mt-auto mb-2">
                     <X size={16} className="text-[#FF3B30] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#8E8E93] text-[13px] font-medium leading-snug line-through">Установка на сайт</span>
                   </div>
                </div>
                <Link href="/register" className="h-[44px] w-full bg-[#8BFDA8] rounded-[12px] flex items-center justify-center font-bold text-[13px] text-[#000000] active:scale-95 transition-all shadow-[0_4px_14px_rgba(139,253,168,0.3)] hover:bg-[#72eba3]">
                  Зарегистрироваться
                </Link>
             </div>

             {/* Тариф 2: PRO Месяц */}
             <div className="w-[223px] h-[396px] bg-[#000000] border border-[#000000] rounded-[22px] p-5 flex flex-col shrink-0 snap-center shadow-sm">
                <div className="mb-4">
                   <div className="text-[#8E8E93] text-[13px] font-medium mb-1">PRO</div>
                   <div className="text-[24px] font-bold text-[#FFFFFF] leading-none">5 000 ₸ <span className="text-[13px] text-[#8E8E93] font-medium">/ мес</span></div>
                </div>
                <div className="flex flex-col gap-3 flex-1">
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">Установка на сайт</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">ИИ-консультант 24/7</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">Каталог на 50 позиций</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">Встроенная корзина</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">Свой цвет и дизайн</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">История всех чатов</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">Stories в виджете</span>
                   </div>
                </div>
                <Link href="/register" className="h-[44px] w-full bg-[#8BFDA8] rounded-[12px] flex items-center justify-center font-bold text-[13px] text-[#000000] active:scale-95 transition-all shadow-[0_4px_14px_rgba(139,253,168,0.3)] hover:bg-[#72eba3]">
                  Зарегистрироваться
                </Link>
             </div>

             {/* Тариф 3: PRO Год */}
             <div className="w-[223px] h-[396px] bg-[#000000] border border-[#000000] rounded-[22px] p-5 flex flex-col shrink-0 snap-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#8BFDA8] opacity-20 blur-[30px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 mb-4">
                   <div className="flex items-center justify-between mb-1">
                      <div className="text-[#8E8E93] text-[13px] font-medium">PRO на год</div>
                      <div className="bg-[#8BFDA8] text-[#000000] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">-25%</div>
                   </div>
                   <div className="text-[24px] font-bold text-[#FFFFFF] leading-none mb-1">3 750 ₸ <span className="text-[13px] text-[#8E8E93] font-medium">/ мес</span></div>
                   <div className="text-[#8BFDA8] text-[10px] font-semibold tracking-wide">45 000 ₸ при оплате за год</div>
                </div>
                <div className="flex flex-col gap-3 flex-1 relative z-10">
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">Всё из тарифа PRO</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">Приоритетная поддержка</span>
                   </div>
                   <div className="flex items-start gap-2">
                     <Check size={16} className="text-[#8BFDA8] shrink-0 mt-0.5" strokeWidth={3}/> 
                     <span className="text-[#FFFFFF] text-[13px] font-medium leading-snug">Помощь с промптом</span>
                   </div>
                </div>
                <Link href="/register" className="relative z-10 h-[44px] w-full bg-[#8BFDA8] rounded-[12px] flex items-center justify-center font-bold text-[13px] text-[#000000] active:scale-95 transition-all shadow-[0_4px_14px_rgba(139,253,168,0.3)] hover:bg-[#72eba3]">
                  Зарегистрироваться
                </Link>
             </div>

             <div className="shrink-0 w-[calc((100vw-340px)/2)] h-[1px] md:hidden"></div>
          </div>
        </section>


        {/* БЛОК 4: УСТАНОВКА */}
        <section className="flex flex-col gap-[12px] md:gap-[26px]">
          <h2 className="text-[22px] md:text-[34px] font-bold text-[#000000] leading-tight md:max-w-[456px]">
            Установка на ваш сайт за 1 минуту
          </h2>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-[12px] md:gap-[163px]">
            <p className="text-[14px] md:text-[16px] text-[#000000] font-normal md:w-[457px] leading-relaxed">
              Сделайте 3 простых шага и установите виджет на любой сайт (Tilda, wordpress, самописный)
            </p>
            <div className="hidden md:flex items-center gap-[10px] shrink-0">
              <button onClick={() => scrollGallery('gallery-3', 'left')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowLeft size={14} strokeWidth={2.5}/>
              </button>
              <button onClick={() => scrollGallery('gallery-3', 'right')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowRight size={14} strokeWidth={2.5}/>
              </button>
            </div>
          </div>

          <div id="gallery-3" className="w-[100vw] md:w-full -ml-[calc((100vw-340px)/2)] md:ml-0 pl-[calc((100vw-340px)/2)] md:pl-0 flex items-center gap-[10px] overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
            {gallery3Images.map((src, index) => (
              <div 
                key={index}
                onClick={() => openImageFullscreen(gallery3Images, index)} 
                className={`w-[223px] h-[396px] ${src ? 'bg-[#FFFFFF] border border-[#E5E5EA]' : 'bg-[#D9D9D9]'} rounded-[22px] shrink-0 snap-center bg-cover bg-no-repeat bg-center cursor-zoom-in active:scale-[0.98] transition-transform shadow-sm`}
                style={src ? { backgroundImage: `url('${src}')` } : {}}
              ></div>
            ))}
            <div className="shrink-0 w-[calc((100vw-340px)/2)] h-[1px] md:hidden"></div>
          </div>
        </section>


        {/* БЛОК 5: МИНИМАЛИСТИЧНЫЙ ЧЕРНЫЙ ФУТЕР */}
        <footer className="w-full bg-[#000000] rounded-[22px] p-6 md:p-8 flex flex-col gap-6 shadow-sm mb-[40px]">
          <div className="flex justify-between items-center">
            <Logo isDark={true} />
            <div className="flex items-center gap-4">
              <a href="https://wa.me/77077175818" target="_blank" rel="noopener noreferrer" className="w-[26px] h-[26px] text-white hover:text-[#8BFDA8] transition-colors">
                 <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.115.549 4.184 1.593 6.002L.055 23.633l6.059-1.59c1.761.986 3.765 1.506 5.917 1.506 6.635 0 12.03-5.394 12.03-12.031S18.666 0 12.031 0zm0 21.53c-1.782 0-3.52-.478-5.05-1.385l-.36-.214-3.757.986.998-3.664-.235-.373A9.99 9.99 0 0 1 2.04 12.03c0-5.508 4.48-9.986 9.99-9.986 5.51 0 9.988 4.478 9.988 9.986s-4.478 9.987-9.987 9.987zm5.474-7.466c-.3-.15-1.776-.876-2.052-.976-.275-.1-.476-.15-.676.15-.2.3-.776.975-.951 1.175-.176.2-.351.225-.651.075-1.572-.772-3.04-1.774-4.18-3.096-.301-.35-.05-.529.119-.705.141-.15.3-.35.451-.55.15-.176.2-.3.3-.5.1-.2.05-.376-.025-.526-.075-.15-.676-1.626-.926-2.226-.244-.585-.492-.505-.676-.514l-.576-.011c-.2 0-.526.075-.801.375-.275.3-1.051 1.026-1.051 2.503s1.076 2.903 1.226 3.103c.15.2 2.117 3.23 5.132 4.53 1.258.543 2.155.679 2.923.829.742.146 1.417.123 1.95.074.597-.056 1.838-.75 2.095-1.476.257-.726.257-1.352.182-1.476-.076-.126-.276-.201-.576-.351z"/>
                 </svg>
              </a>
              <a href="https://www.instagram.com/ndesign_kz/" target="_blank" rel="noopener noreferrer" className="w-[26px] h-[26px] text-white hover:text-[#8BFDA8] transition-colors">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="w-full h-px bg-[#3A3A3C]/50"></div>
          <div className="flex justify-between items-center text-[12px] md:text-[13px] text-[#8E8E93] font-medium">
            <span>© 2026 AI NUR</span>
            <Link href="/register" className="text-[#FFFFFF] hover:text-[#8BFDA8] transition-colors">
              Создать виджет
            </Link>
          </div>
        </footer>

      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  );
}