import Link from 'next/link';
import { Bot, ShoppingCart, PlaySquare, ArrowRight, Zap, Smartphone, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans selection:bg-[#8BFDA8] selection:text-black flex flex-col relative overflow-hidden">
      
      {/* ФОНОВЫЕ ЭЛЕМЕНТЫ (Для красоты и объема) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8BFDA8] opacity-[0.15] blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#00B0F2] opacity-[0.1] blur-[100px] rounded-full pointer-events-none"></div>

      {/* 1. ПЛАВАЮЩИЙ HEADER */}
      <header className="fixed top-[10px] left-1/2 -translate-x-1/2 w-[calc(100%-34px)] max-w-[800px] z-50 bg-[#FFFFFF]/80 backdrop-blur-xl rounded-[22px] flex items-center justify-between px-5 py-3 border border-[#E5E5EA] shadow-sm animate-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#000000] rounded-[10px] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8BFDA8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <span className="font-black text-[18px] tracking-tight text-[#000000]">AI NUR</span>
        </div>
        <div className="flex items-center gap-1 md:gap-3">
          <Link href="/login" className="hidden md:flex px-4 py-2 text-[14px] font-bold text-[#8E8E93] hover:text-[#000000] transition-colors">
            Войти
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-[#8BFDA8] text-[#000000] text-[14px] font-bold rounded-[12px] active:scale-95 transition-transform">
            Создать виджет
          </Link>
        </div>
      </header>

      {/* 2. ГЛАВНЫЙ ЭКРАН (HERO) */}
      <section className="pt-[160px] pb-16 px-4 flex flex-col items-center text-center max-w-[800px] mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF] border border-[#E5E5EA] rounded-full mb-6 shadow-sm">
          <Zap size={14} className="text-[#FF9500] fill-[#FF9500]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">SaaS платформа для бизнеса</span>
        </div>
        
        <h1 className="text-[42px] md:text-[64px] font-black text-[#000000] leading-[1.1] tracking-tight mb-6">
          Превращаем сайты в <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#000000] to-[#8E8E93]">
            диалог с клиентами
          </span>
        </h1>
        
        <p className="text-[16px] md:text-[18px] font-medium text-[#8E8E93] max-w-[540px] mb-10 leading-relaxed">
          Умный ИИ-виджет с каталогом, корзиной и Stories. Установите на свой сайт за 1 минуту и удвойте конверсию без участия менеджеров.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className="h-[56px] px-8 bg-[#000000] text-[#8BFDA8] rounded-[16px] font-bold text-[16px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
            Попробовать бесплатно <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
          <a href="#features" className="h-[56px] px-8 bg-[#FFFFFF] border border-[#E5E5EA] text-[#000000] rounded-[16px] font-bold text-[16px] flex items-center justify-center active:scale-95 transition-transform hover:bg-[#F9F9F9]">
            Узнать больше
          </a>
        </div>

        {/* Тестовый мокап виджета */}
        <div className="mt-16 w-full max-w-[340px] h-[80px] bg-[#FFFFFF] rounded-[40px] border border-[#E5E5EA] shadow-[0_20px_40px_rgba(0,0,0,0.08)] flex items-center justify-between p-2 pr-4 relative">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-[#8BFDA8] rounded-full flex items-center justify-center">
                 <Bot size={28} strokeWidth={1.5} className="text-[#000000]"/>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[15px] font-bold text-[#000000]">AI NUR Ассистент</span>
                <span className="text-[13px] text-[#8E8E93] font-medium">Печатает...</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-[#F2F2F7] rounded-full flex items-center justify-center">
               <span className="w-1.5 h-1.5 bg-[#8E8E93] rounded-full animate-pulse"></span>
            </div>
        </div>

      </section>

      {/* 3. ПРЕИМУЩЕСТВА (FEATURES) */}
      <section id="features" className="px-4 py-16 max-w-[900px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-[#FFFFFF] p-6 rounded-[24px] border border-[#E5E5EA] shadow-sm hover:border-[#8BFDA8] transition-colors group">
            <div className="w-12 h-12 bg-[#F2F2F7] group-hover:bg-[#8BFDA8]/20 rounded-[14px] flex items-center justify-center mb-5 transition-colors">
              <Bot size={24} strokeWidth={1.5} className="text-[#000000]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#000000] mb-2">ИИ Консультант</h3>
            <p className="text-[14px] font-medium text-[#8E8E93] leading-relaxed">
              Обучается на вашей базе знаний за секунды. Отвечает на вопросы 24/7 и продает ваши услуги.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-[24px] border border-[#E5E5EA] shadow-sm hover:border-[#8BFDA8] transition-colors group">
            <div className="w-12 h-12 bg-[#F2F2F7] group-hover:bg-[#8BFDA8]/20 rounded-[14px] flex items-center justify-center mb-5 transition-colors">
              <ShoppingCart size={24} strokeWidth={1.5} className="text-[#000000]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#000000] mb-2">Встроенный каталог</h3>
            <p className="text-[14px] font-medium text-[#8E8E93] leading-relaxed">
              Клиенты могут просматривать товары и оформлять заказы прямо в окне чата, не переходя на другие страницы.
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-[24px] border border-[#E5E5EA] shadow-sm hover:border-[#8BFDA8] transition-colors group">
            <div className="w-12 h-12 bg-[#F2F2F7] group-hover:bg-[#8BFDA8]/20 rounded-[14px] flex items-center justify-center mb-5 transition-colors">
              <PlaySquare size={24} strokeWidth={1.5} className="text-[#000000]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#000000] mb-2">Stories на сайте</h3>
            <p className="text-[14px] font-medium text-[#8E8E93] leading-relaxed">
              Привычный формат историй прогревает холодный трафик. Публикуйте акции, отзывы и новинки.
            </p>
          </div>

        </div>
      </section>

      {/* 4. CTA FOOTER */}
      <section className="px-4 pb-20 mt-auto w-full relative z-10">
        <div className="max-w-[900px] mx-auto bg-[#000000] rounded-[32px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8BFDA8] opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="flex flex-col gap-2 z-10 text-center md:text-left">
            <h2 className="text-[28px] md:text-[32px] font-black text-[#FFFFFF]">Готовы к росту продаж?</h2>
            <p className="text-[15px] text-[#8E8E93] font-medium max-w-[300px]">
              Создайте виджет прямо сейчас. Установка займет меньше минуты.
            </p>
          </div>
          
          <div className="z-10 w-full md:w-auto">
            <Link href="/register" className="h-[56px] w-full md:w-auto px-8 bg-[#8BFDA8] text-[#000000] rounded-[16px] font-bold text-[16px] flex items-center justify-center active:scale-95 transition-transform">
              Создать аккаунт
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}