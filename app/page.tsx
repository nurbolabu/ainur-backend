/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  
  // Этот хук правильно встраивает ваш скрипт виджета при загрузке страницы
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

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-[#080808] text-white min-h-screen pb-[150px] overflow-x-hidden relative font-sans selection:bg-[#8BFDA8] selection:text-black">
      
      {/* Встроенные CSS анимации */}
      <style dangerouslySetInnerHTML={{ __html: `
        .chat-bubble-1 { animation: slideUp 4s infinite 0s; opacity: 0; transform-origin: bottom left;}
        .chat-bubble-2 { animation: slideUp 4s infinite 1.5s; opacity: 0; transform-origin: bottom right;}
        @keyframes slideUp {
            0% { opacity: 0; transform: translateY(20px) scale(0.9); }
            10%, 80% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-20px) scale(0.9); }
        }
        .story-ring { animation: spin 8s linear infinite; }
        .story-pulse { animation: pulseStory 2s infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulseStory {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 253, 168, 0.4); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(139, 253, 168, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(139, 253, 168, 0); }
        }
        .catalog-float { animation: float 6s ease-in-out infinite; }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .bounce-arrow { animation: bounceArrow 2s infinite; }
        @keyframes bounceArrow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
        }
        .glass-panel {
            background: rgba(28, 28, 30, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
      `}} />

      {/* ФОНОВЫЕ СВЕЧЕНИЯ */}
      <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[#8BFDA8] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-[#00B0F2] opacity-[0.05] blur-[120px] rounded-full pointer-events-none"></div>

      {/* ЗАКРЕПЛЕННЫЙ HEADER */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-6xl z-50 glass-panel rounded-full border border-[#3A3A3C] px-6 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center">
              <svg width="120" height="20" viewBox="0 0 141 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                  <path d="M140.125 19.6816H132.108L127.795 14.5587H118.591V19.6816H112.6V9.78305H129.445C130.371 9.78305 131.153 9.5901 131.79 9.20418C132.426 8.81827 132.745 8.28765 132.745 7.61231C132.745 6.85978 132.455 6.30021 131.876 5.9336C131.298 5.54769 130.487 5.35473 129.445 5.35473H112.6V0.318604H128.953C130.053 0.318604 131.191 0.424729 132.368 0.636979C133.545 0.829935 134.616 1.1869 135.581 1.70788C136.546 2.22886 137.337 2.93315 137.954 3.82074C138.591 4.70833 138.91 5.84677 138.91 7.23604C138.91 7.98857 138.794 8.7025 138.562 9.37784C138.331 10.0532 137.993 10.661 137.549 11.2013C137.125 11.7415 136.594 12.2046 135.957 12.5905C135.34 12.9572 134.636 13.2177 133.845 13.372C134.173 13.6229 134.539 13.9412 134.944 14.3271C135.35 14.7131 135.89 15.2437 136.565 15.919L140.125 19.6816Z" fill="#FFFFFF"/>
                  <path d="M109.262 11.2302C109.262 17.0768 105.239 20 97.193 20C94.8582 20 92.8515 19.8167 91.1728 19.4501C89.4941 19.0835 88.1048 18.5336 87.0049 17.8003C85.9244 17.0671 85.1236 16.1602 84.6026 15.0797C84.1009 13.9798 83.8501 12.6967 83.8501 11.2302V0.318604H89.8124V11.2302C89.8124 11.9441 89.9089 12.5423 90.1019 13.0247C90.2948 13.5071 90.6518 13.9026 91.1728 14.2114C91.713 14.5008 92.4656 14.7131 93.4303 14.8481C94.3951 14.9639 95.6493 15.0218 97.193 15.0218C98.3507 15.0218 99.3155 14.9542 100.087 14.8192C100.859 14.6841 101.477 14.4622 101.94 14.1535C102.403 13.8448 102.731 13.4492 102.924 12.9668C103.136 12.4844 103.242 11.9056 103.242 11.2302V0.318604H109.262V11.2302Z" fill="#FFFFFF"/>
                  <path d="M77.2798 19.9998C76.8939 19.9998 76.508 19.9323 76.122 19.7972C75.7554 19.6814 75.3406 19.4016 74.8775 18.9578L63.0107 8.30672V19.6814H57.5693V3.61791C57.5693 2.98116 57.6562 2.43123 57.8298 1.96814C58.0228 1.50505 58.264 1.12879 58.5534 0.839354C58.8621 0.549922 59.2095 0.337671 59.5954 0.202602C60.0006 0.067534 60.4154 0 60.8399 0C61.2066 0 61.5732 0.067534 61.9398 0.202602C62.3257 0.318375 62.7599 0.598159 63.2422 1.04196L75.109 11.6931V0.318375H80.5793V16.3529C80.5793 16.9897 80.4828 17.5396 80.2899 18.0027C80.1162 18.4658 79.875 18.8517 79.5663 19.1604C79.2769 19.4499 78.9296 19.6621 78.5243 19.7972C78.1191 19.9323 77.7043 19.9998 77.2798 19.9998Z" fill="#FFFFFF"/>
                  <path d="M16.2949 0C17.2018 0 17.9546 0.21223 18.5527 0.636719C19.1702 1.0419 19.6907 1.5535 20.1152 2.1709L32.2139 19.6816H9.69629L13.3135 14.7031H19.9707C20.6075 14.7031 21.158 14.7222 21.6211 14.7607C21.351 14.4135 21.0325 13.9798 20.666 13.459C20.3187 12.9188 19.9803 12.4171 19.6523 11.9541L16.1797 6.83105L7.09082 19.6816H0L12.417 2.1709C12.8222 1.61136 13.3337 1.10979 13.9512 0.666016C14.5686 0.222338 15.3496 3.10811e-05 16.2949 0ZM40.4277 19.6816H34.4365V0.318359H40.4277V19.6816Z" fill="#8BFDA8"/>
              </svg>
          </div>
          <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors hidden md:block">Войти</Link>
              <Link href="/register" className="bg-[#8BFDA8] text-black px-5 py-2.5 rounded-full text-sm font-bold hover:scale-95 transition-transform">Установить виджет</Link>
          </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-6xl mx-auto px-4 pt-[140px] flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#3A3A3C] bg-[#1C1C1E] mb-8">
              <span className="flex h-2 w-2 rounded-full bg-[#8BFDA8]"></span>
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-300">Работает 24/7 на вашем сайте</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 max-w-4xl">
              Превращаем сайты в <br className="hidden md:block"/>
              <span className="text-[#8BFDA8]">диалог с клиентами</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
              Современный способ общаться с покупателями. Умный ИИ-менеджер, встроенный каталог товаров и Stories прямо в окне чата.
          </p>

          <Link href="/register" className="bg-white text-black px-8 py-4 rounded-2xl text-lg font-bold hover:scale-95 transition-transform flex items-center gap-2 shadow-[0_0_40px_rgba(139,253,168,0.2)]">
              Попробовать бесплатно
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>

          {/* Указатель на реальный виджет */}
          <div className="mt-20 flex flex-col items-center gap-4 opacity-70">
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">Попробуйте наш виджет прямо здесь</span>
              <svg className="bounce-arrow text-[#8BFDA8]" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
          </div>
      </main>

      {/* BENTO GRID SECTION */}
      <section className="max-w-6xl mx-auto px-4 mt-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Карточка 1: Искусственный Интеллект (Большая) */}
              <div className="md:col-span-2 bg-[#1C1C1E] border border-[#3A3A3C] rounded-[32px] p-8 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#8BFDA8] opacity-10 blur-[80px] rounded-full pointer-events-none group-hover:opacity-20 transition-opacity"></div>
                  
                  <div className="mb-12 relative z-10">
                      <h3 className="text-3xl font-bold mb-3">Умный ИИ-ассистент</h3>
                      <p className="text-gray-400 text-base max-w-sm">Загрузите информацию о компании, и искусственный интеллект сам проконсультирует клиента и доведет до продажи.</p>
                  </div>

                  {/* Анимация чата */}
                  <div className="relative z-10 bg-[#111111] border border-[#3A3A3C] rounded-3xl p-6 h-[220px] flex flex-col gap-4 overflow-hidden mask-image-bottom">
                      <div className="chat-bubble-1 self-end max-w-[80%] bg-[#8BFDA8] text-black px-4 py-3 rounded-2xl rounded-br-sm text-sm font-medium">
                          Привет! Как работает ваш виджет?
                      </div>
                      <div className="chat-bubble-2 self-start max-w-[80%] bg-[#3A3A3C] text-white px-4 py-3 rounded-2xl rounded-bl-sm text-sm font-medium flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#8BFDA8] flex-shrink-0 mt-0.5 flex items-center justify-center">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M12 2a2 2 0 0 1 2 2c0 1.1-.9 2-2 2s-2-.9-2-2a2 2 0 0 1 2-2z"/><path d="M19 15v-3a7 7 0 0 0-14 0v3"/><path d="M14.5 15h-5"/><path d="M22 15a2 2 0 0 1-2 2h-1c-.55 0-1-.45-1-1v-2c0-.55-.45-1 1-1h1.5l1.5 2z"/><path d="M2 15a2 2 0 0 0 2 2h1c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1H3.5L2 15z"/></svg>
                          </div>
                          <div>Я ИИ-менеджер! Я анализирую ваш сайт и сам общаюсь с клиентами 24/7. Попробуйте нажать на кнопку в правом нижнем углу 👇</div>
                      </div>
                  </div>
              </div>

              {/* Карточка 2: Stories */}
              <div className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-[32px] p-8 flex flex-col items-center text-center justify-between group overflow-hidden relative z-10">
                  <div className="w-full flex justify-center mb-8 relative pt-6">
                      <div className="relative w-24 h-24 story-pulse rounded-full flex items-center justify-center">
                          <svg className="absolute w-full h-full story-ring" viewBox="0 0 100 100">
                              <defs>
                                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#8BFDA8" />
                                      <stop offset="100%" stopColor="#00B0F2" />
                                  </linearGradient>
                              </defs>
                              <circle cx="50" cy="50" r="46" stroke="url(#grad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="80 20"/>
                          </svg>
                          <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=200&auto=format&fit=crop" className="w-[84px] h-[84px] rounded-full object-cover border-4 border-[#1C1C1E]" alt="Stories"/>
                      </div>
                  </div>
                  <div>
                      <h3 className="text-2xl font-bold mb-2"><span className="text-[#8BFDA8]">Stories</span> на сайте</h3>
                      <p className="text-gray-400 text-sm">Привычный формат историй прогревает трафик. Публикуйте акции и отзывы.</p>
                  </div>
              </div>

              {/* Карточка 3: Каталог и Корзина */}
              <div className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-[32px] p-8 flex flex-col justify-between group overflow-hidden relative z-10">
                  <div>
                      <h3 className="text-2xl font-bold mb-2">Каталог товаров</h3>
                      <p className="text-gray-400 text-sm mb-8">Клиенты могут покупать ваши услуги не покидая окно чата. Удобно как в любимом приложении.</p>
                  </div>
                  
                  <div className="relative w-full h-[140px]">
                      <div className="absolute inset-x-0 bottom-0 catalog-float bg-[#111111] border border-[#3A3A3C] p-3 rounded-2xl flex items-center gap-4">
                          <div className="w-16 h-16 bg-[#3A3A3C] rounded-xl flex-shrink-0 flex items-center justify-center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="m9 21 3-9 3 9"/></svg>
                          </div>
                          <div className="flex-grow">
                              <div className="text-sm font-bold text-white mb-1">Дизайн сайта</div>
                              <div className="text-xs font-semibold text-[#8BFDA8]">150 000 ₸</div>
                          </div>
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Карточка 4: Призыв к действию (Большая) */}
              <div className="md:col-span-2 bg-gradient-to-r from-[#8BFDA8] to-[#61D6FB] rounded-[32px] p-8 flex flex-col md:flex-row items-center justify-between text-black group relative z-10">
                  <div className="text-center md:text-left mb-6 md:mb-0">
                      <h3 className="text-3xl font-black mb-2">Начните за 1 минуту</h3>
                      <p className="font-medium opacity-80 max-w-md">Добавьте виджет на свой сайт (Tilda, WordPress, HTML) просто скопировав одну строчку кода.</p>
                  </div>
                  <Link href="/register" className="bg-black text-white px-8 py-4 rounded-2xl text-base font-bold hover:scale-95 transition-transform whitespace-nowrap">
                      Создать виджет
                  </Link>
              </div>

          </div>
      </section>
    </div>
  );
}