/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('year');

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

  // Функция для прокрутки галерей по клику на стрелки
  const scrollGallery = (id: string, direction: 'left' | 'right') => {
    const gallery = document.getElementById(id);
    if (gallery) {
      const scrollAmount = direction === 'left' ? -233 : 233; // 223px карточка + 10px gap
      gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Логотип в SVG формате
  const Logo = ({ isDark = false }: { isDark?: boolean }) => (
    <svg width="141" height="20" viewBox="0 0 141 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[20px] w-auto">
      <path d="M140.125 19.6816H132.108L127.795 14.5587H118.591V19.6816H112.6V9.78305H129.445C130.371 9.78305 131.153 9.5901 131.79 9.20418C132.426 8.81827 132.745 8.28765 132.745 7.61231C132.745 6.85978 132.455 6.30021 131.876 5.9336C131.298 5.54769 130.487 5.35473 129.445 5.35473H112.6V0.318604H128.953C130.053 0.318604 131.191 0.424729 132.368 0.636979C133.545 0.829935 134.616 1.1869 135.581 1.70788C136.546 2.22886 137.337 2.93315 137.954 3.82074C138.591 4.70833 138.91 5.84677 138.91 7.23604C138.91 7.98857 138.794 8.7025 138.562 9.37784C138.331 10.0532 137.993 10.661 137.549 11.2013C137.125 11.7415 136.594 12.2046 135.957 12.5905C135.34 12.9572 134.636 13.2177 133.845 13.372C134.173 13.6229 134.539 13.9412 134.944 14.3271C135.35 14.7131 135.89 15.2437 136.565 15.919L140.125 19.6816Z" fill={isDark ? "white" : "black"}/>
      <path d="M109.262 11.2302C109.262 17.0768 105.239 20 97.193 20C94.8582 20 92.8515 19.8167 91.1728 19.4501C89.4941 19.0835 88.1048 18.5336 87.0049 17.8003C85.9244 17.0671 85.1236 16.1602 84.6026 15.0797C84.1009 13.9798 83.8501 12.6967 83.8501 11.2302V0.318604H89.8124V11.2302C89.8124 11.9441 89.9089 12.5423 90.1019 13.0247C90.2948 13.5071 90.6518 13.9026 91.1728 14.2114C91.713 14.5008 92.4656 14.7131 93.4303 14.8481C94.3951 14.9639 95.6493 15.0218 97.193 15.0218C98.3507 15.0218 99.3155 14.9542 100.087 14.8192C100.859 14.6841 101.477 14.4622 101.94 14.1535C102.403 13.8448 102.731 13.4492 102.924 12.9668C103.136 12.4844 103.242 11.9056 103.242 11.2302V0.318604H109.262V11.2302Z" fill={isDark ? "white" : "black"}/>
      <path d="M77.2798 19.9998C76.8939 19.9998 76.508 19.9323 76.122 19.7972C75.7554 19.6814 75.3406 19.4016 74.8775 18.9578L63.0107 8.30672V19.6814H57.5693V3.61791C57.5693 2.98116 57.6562 2.43123 57.8298 1.96814C58.0228 1.50505 58.264 1.12879 58.5534 0.839354C58.8621 0.549922 59.2095 0.337671 59.5954 0.202602C60.0006 0.067534 60.4154 0 60.8399 0C61.2066 0 61.5732 0.067534 61.9398 0.202602C62.3257 0.318375 62.7599 0.598159 63.2422 1.04196L75.109 11.6931V0.318375H80.5793V16.3529C80.5793 16.9897 80.4828 17.5396 80.2899 18.0027C80.1162 18.4658 79.875 18.8517 79.5663 19.1604C79.2769 19.4499 78.9296 19.6621 78.5243 19.7972C78.1191 19.9323 77.7043 19.9998 77.2798 19.9998Z" fill={isDark ? "white" : "black"}/>
      <path d="M16.2949 0C17.2018 0 17.9546 0.21223 18.5527 0.636719C19.1702 1.0419 19.6907 1.5535 20.1152 2.1709L32.2139 19.6816H9.69629L13.3135 14.7031H19.9707C20.6075 14.7031 21.158 14.7222 21.6211 14.7607C21.351 14.4135 21.0325 13.9798 20.666 13.459C20.3187 12.9188 19.9803 12.4171 19.6523 11.9541L16.1797 6.83105L7.09082 19.6816H0L12.417 2.1709C12.8222 1.61136 13.3337 1.10979 13.9512 0.666016C14.5686 0.222338 15.3496 3.10811e-05 16.2949 0ZM40.4277 19.6816H34.4365V0.318359H40.4277V19.6816Z" fill="#8BFDA8"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans selection:bg-[#8BFDA8] selection:text-black flex flex-col items-center overflow-x-hidden relative pb-[150px]">
      
      {/* 1. ФИКСИРОВАННЫЙ HEADER */}
      {/* На десктопе ширина 690px, на мобилке ширина 100% с отступами */}
      <div className="fixed top-[10px] w-[calc(100%-20px)] md:w-[690px] z-50 bg-[#FFFFFF] rounded-[22px] px-5 py-2.5 border border-[#E5E5EA] shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/"><Logo /></Link>
          <Link href="/register" className="h-[50px] px-[13px] bg-[#8BFDA8] rounded-[11px] flex items-center justify-center active:scale-95 transition-transform">
            <span className="text-[#000000] text-[14px] font-medium leading-none">Регистрация</span>
          </Link>
        </div>
      </div>

      {/* ГЛАВНЫЙ КОНТЕЙНЕР ДЛЯ ВСЕХ БЛОКОВ */}
      <main className="w-full md:w-[691px] px-4 md:px-0 pt-[120px] flex flex-col gap-10">

        {/* БЛОК 1: ДИАЛОГ С КЛИЕНТАМИ */}
        <section className="flex flex-col gap-[26px]">
          <h1 className="text-[34px] font-bold text-[#000000] leading-tight md:max-w-[456px]">
            Превращаем сайты в диалог с клиентами
          </h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-[163px]">
            <p className="text-[16px] text-[#000000] font-normal md:w-[457px] leading-relaxed">
              AI NUR это современный способ быстро превратить любой сайт в диалог с клиентом.
            </p>
            {/* Кнопки навигации (скрыты на мобильных, так как там свайп) */}
            <div className="hidden md:flex items-center gap-[10px] shrink-0">
              <button onClick={() => scrollGallery('gallery-1', 'left')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowLeft size={14} strokeWidth={2.5}/>
              </button>
              <button onClick={() => scrollGallery('gallery-1', 'right')} className="w-6 h-6 rounded-full border-[1.5px] border-[#000000] flex items-center justify-center hover:bg-[#E5E5EA] transition-colors active:scale-90">
                 <ArrowRight size={14} strokeWidth={2.5}/>
              </button>
            </div>
          </div>

          {/* Галерея 1 */}
          {/* Скролл с прилипанием (snap) для телефонов, скрытый скроллбар */}
          <div id="gallery-1" className="flex items-center gap-[10px] w-full overflow-x-auto snap-x snap-mandatory pb-4 -mb-4 scrollbar-hide">
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
            {/* Добавьте еще пустых div'ов, если картинок будет больше 3 */}
          </div>
        </section>


        {/* БЛОК 2: БОЛЬШОЙ ФУНКЦИОНАЛ */}
        <section className="flex flex-col gap-[26px]">
          <h2 className="text-[34px] font-bold text-[#000000] leading-tight md:max-w-[456px]">
            Большой функционал в одном виджете
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-[163px]">
            <p className="text-[16px] text-[#000000] font-normal md:w-[457px] leading-relaxed">
              В виджете вы можете делится stories, чтобы рассказать об акции. Или превратить обычный сайт в интернет магазин
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

          <div id="gallery-2" className="flex items-center gap-[10px] w-full overflow-x-auto snap-x snap-mandatory pb-4 -mb-4 scrollbar-hide">
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
          </div>
        </section>


        {/* БЛОК 3: ЦЕНА (Переключатель) */}
        <section className="w-full bg-[#000000] rounded-[22px] py-[25px] px-6 md:px-[22px] md:pl-[38px] flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex flex-col md:flex-row md:items-center gap-2">
             <span className="text-[#FFFFFF] text-[28px] md:text-[34px] font-bold leading-none">Всего за</span>
             <div className="flex items-baseline gap-2">
                <span className="text-[#8BFDA8] text-[34px] font-bold leading-none">
                  {billingPeriod === 'year' ? '3 750' : '5 000'}
                </span>
                <span className="text-[#FFFFFF] text-[28px] md:text-[34px] font-bold leading-none">тг/мес</span>
             </div>
           </div>

           {/* iOS Toggle */}
           <div className="w-[180px] h-[50px] bg-[#313131] rounded-[11px] p-[8px] flex items-center shrink-0 relative cursor-pointer" onClick={() => setBillingPeriod(billingPeriod === 'year' ? 'month' : 'year')}>
              <div 
                className={`absolute w-[84px] h-[34px] bg-[#FFFFFF] rounded-[6px] transition-all duration-300 ease-out shadow-sm`}
                style={{ left: billingPeriod === 'year' ? '88px' : '8px' }}
              ></div>
              <div className="w-1/2 flex items-center justify-center z-10 text-[15px] font-medium transition-colors" style={{ color: billingPeriod === 'month' ? '#000000' : '#C4C4C4'}}>
                месяц
              </div>
              <div className="w-1/2 flex items-center justify-center z-10 text-[15px] font-medium transition-colors" style={{ color: billingPeriod === 'year' ? '#000000' : '#C4C4C4'}}>
                в год
              </div>
           </div>
        </section>


        {/* БЛОК 4: УСТАНОВКА */}
        <section className="flex flex-col gap-[26px]">
          <h2 className="text-[34px] font-bold text-[#000000] leading-tight md:max-w-[456px]">
            Установка на ваш сайт за 1 минуту
          </h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-[163px]">
            <p className="text-[16px] text-[#000000] font-normal md:w-[457px] leading-relaxed">
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

          <div id="gallery-3" className="flex items-center gap-[10px] w-full overflow-x-auto snap-x snap-mandatory pb-4 -mb-4 scrollbar-hide">
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
            <div className="w-[223px] h-[396px] bg-[#D9D9D9] rounded-[22px] shrink-0 snap-center bg-cover bg-center"></div>
          </div>
        </section>


        {/* БЛОК 5: ФУТЕР (Контакты) */}
        <section className="w-full bg-[#000000] rounded-[22px] p-5 md:py-[10px] md:pl-[20px] md:pr-[10px] flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-4 mb-[40px]">
           <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between md:justify-start md:gap-[270px]">
                 <Logo isDark={true} />
                 <Link href="/register" className="h-[50px] px-[13px] bg-[#8BFDA8] rounded-[11px] flex items-center justify-center active:scale-95 transition-transform">
                   <span className="text-[#000000] text-[14px] font-medium leading-none">Регистрация</span>
                 </Link>
              </div>
              <div className="text-[#FFFFFF] text-[16px] font-normal mt-4 md:mt-0">
                Контакты для связи
              </div>
           </div>

           <div className="flex items-center gap-[20px] md:pr-4">
              <a href="#" className="w-[26px] h-[27px] hover:opacity-80 transition-opacity">
                {/* SVG Instagram */}
                <svg viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2.894C16.48 2.894 16.892 2.907 18.264 2.97C21.785 3.13 23.431 4.805 23.591 8.303C23.654 9.675 23.667 10.086 23.667 13.56C23.667 17.034 23.654 17.445 23.591 18.817C23.43 22.316 21.787 23.99 18.264 24.15C16.892 24.213 16.481 24.226 13 24.226C9.519 24.226 9.108 24.213 7.736 24.15C4.205 23.99 2.568 22.314 2.409 18.817C2.346 17.445 2.333 17.034 2.333 13.56C2.333 10.086 2.346 9.675 2.409 8.303C2.57 4.803 4.215 3.13 7.736 2.97C9.108 2.907 9.519 2.894 13 2.894ZM13 0.55C9.467 0.55 9.025 0.565 7.638 0.628C2.915 0.845 0.292 3.468 0.076 8.192C0.012 9.578 0 10.02 0 13.56C0 17.1 0.012 17.542 0.076 18.928C0.291 23.653 2.915 26.275 7.638 26.491C9.025 26.554 9.467 26.569 13 26.569C16.533 26.569 16.975 26.554 18.362 26.491C23.084 26.275 25.707 23.652 25.923 18.928C25.987 17.542 26 17.1 26 13.56C26 10.02 25.987 9.578 25.923 8.192C25.708 3.468 23.085 0.845 18.362 0.628C16.975 0.565 16.533 0.55 13 0.55ZM13 6.877C9.309 6.877 6.314 9.872 6.314 13.568C6.314 17.264 9.309 20.259 13 20.259C16.691 20.259 19.686 17.264 19.686 13.568C19.686 9.872 16.691 6.877 13 6.877ZM13 17.915C10.603 17.915 8.658 15.971 8.658 13.568C8.658 11.165 10.603 9.221 13 9.221C15.397 9.221 17.342 11.165 17.342 13.568C17.342 15.971 15.397 17.915 13 17.915ZM20.089 4.673C19.229 4.673 18.525 5.377 18.525 6.237C18.525 7.097 19.229 7.801 20.089 7.801C20.949 7.801 21.653 7.097 21.653 6.237C21.653 5.377 20.949 4.673 20.089 4.673Z" fill="white"/>
                </svg>
              </a>
              <a href="#" className="w-[26px] h-[27px] hover:opacity-80 transition-opacity">
                 {/* SVG WhatsApp */}
                 <svg viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12.981 0C5.816 0 0 5.816 0 12.98C0 15.267 0.597 17.498 1.733 19.458L0.063 26.938L7.701 25.265C9.575 26.299 11.724 26.843 12.98 26.843C20.145 26.843 25.961 21.027 25.961 13.862C25.961 6.697 20.145 0.881 12.981 0.881V0ZM12.981 2.155C19.444 2.155 24.693 7.404 24.693 13.867C24.693 20.33 19.444 25.579 12.981 25.579C10.999 25.579 9.096 25.075 7.409 24.137L7.027 23.903L3.067 24.776L3.929 20.923L3.674 20.518C2.658 18.905 2.115 16.994 2.115 15.008C2.115 8.545 7.364 3.296 13.827 3.296H12.981V2.155ZM8.566 7.21C8.286 7.21 7.822 7.315 7.449 7.721C7.075 8.127 5.955 9.176 5.955 11.319C5.955 13.462 7.495 15.534 7.704 15.814C7.914 16.094 10.74 20.479 15.08 22.357C16.113 22.805 16.924 23.067 17.558 23.267C18.598 23.597 19.54 23.548 20.278 23.411C21.1 23.259 22.802 22.316 23.153 21.267C23.502 20.218 23.502 19.32 23.385 19.133C23.268 18.946 22.988 18.841 22.568 18.631C22.148 18.421 20.095 17.407 19.721 17.267C19.348 17.127 19.068 17.057 18.788 17.477C18.508 17.897 17.761 18.841 17.528 19.121C17.295 19.401 17.062 19.436 16.642 19.226C16.222 19.016 14.873 18.575 13.277 17.151C12.036 16.043 11.203 14.678 10.97 14.258C10.737 13.838 10.945 13.618 11.155 13.409C11.344 13.22 11.577 12.917 11.787 12.684C11.997 12.451 12.067 12.276 12.207 11.996C12.347 11.716 12.277 11.483 12.172 11.273C12.067 11.063 11.248 9.034 10.906 8.21C10.575 7.412 10.242 7.52 9.986 7.509C9.753 7.498 9.473 7.498 9.193 7.498C8.913 7.498 8.846 7.21 8.566 7.21Z" fill="white"/>
                 </svg>
              </a>
           </div>
        </section>

      </main>

      {/* Глобальные стили для скрытия скроллбара в галереях */}
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

    </div>
  );
}