'use client';

import Link from 'next/link';
import { ArrowRight, Zap, MessageSquare, Box, PlaySquare, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#8BFDA8] selection:text-black">
      
      {/* СЕТКА НА ФОНЕ (Серые линии) */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* HEADER */}
      <header className="relative z-10 border-b border-zinc-900 backdrop-blur-md bg-black/50 sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* ЛОГОТИП AI NUR */}
          <div className="flex items-center">
             <svg className="h-[18px] w-auto" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="white"/>
                <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="white"/>
                <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="white"/>
                <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
             </svg>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Преимущества</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Как это работает</a>
            <Link href="/login" className="bg-[#1A1A1A] border border-zinc-800 text-white px-5 py-2 rounded-full hover:border-[#8BFDA8] hover:text-[#8BFDA8] transition-all active:scale-95">
              Вход
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-24 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#8BFDA8]/30 bg-[#8BFDA8]/10 text-[#8BFDA8] text-xs font-bold uppercase tracking-widest mb-8">
            <Zap size={14} fill="currentColor" className="animate-pulse" /> Установка за 60 секунд
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            Превратите посетителей <br />
            <span className="text-[#8BFDA8] drop-shadow-[0_0_20px_rgba(139,253,168,0.3)]">в лояльных клиентов</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI NUR — это умный ИИ-ассистент, встроенный в ваш сайт. 
            Он знает ваши цены, показывает Stories и собирает заявки 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link href="/login" className="w-full sm:w-auto h-16 px-10 bg-[#8BFDA8] text-black rounded-[18px] font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(139,253,168,0.4)] transition-all active:scale-95">
              Настроить бесплатно <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="relative z-10 py-24 border-t border-zinc-900 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Карточка 1 */}
            <div className="p-8 rounded-[32px] bg-black border border-zinc-800 hover:border-[#8BFDA8]/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <MessageSquare size={120} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:bg-[#8BFDA8] group-hover:text-black transition-colors relative z-10">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Умный Чат</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10 text-sm">
                ИИ обучается на вашей базе знаний и отвечает на вопросы клиентов мгновенно. Продает, консультирует и собирает контакты.
              </p>
            </div>

            {/* Карточка 2 */}
            <div className="p-8 rounded-[32px] bg-black border border-zinc-800 hover:border-[#8BFDA8]/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <PlaySquare size={120} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:bg-[#8BFDA8] group-hover:text-black transition-colors relative z-10">
                <PlaySquare size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Stories на сайте</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10 text-sm">
                Рассказывайте об акциях и новостях в привычном формате историй прямо в виджете. Захватывает внимание с первой секунды.
              </p>
            </div>

            {/* Карточка 3 */}
            <div className="p-8 rounded-[32px] bg-black border border-zinc-800 hover:border-[#8BFDA8]/50 transition-colors group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Box size={120} />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center mb-6 group-hover:bg-[#8BFDA8] group-hover:text-black transition-colors relative z-10">
                <Box size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Каталог внутри</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10 text-sm">
                Клиенты могут просматривать ваши услуги и товары, не покидая чат. Удобная корзина и оформление заявки в 2 клика.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WHY US SECTION (Линии и акценты) */}
      <section id="how-it-works" className="relative z-10 py-32 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Ваш бизнес заслуживает <br/><span className="text-[#8BFDA8]">современных</span> инструментов
            </h2>
            <ul className="space-y-8 mt-10">
              {[
                { title: "Строго по вашим правилам", desc: "ИИ использует только цены и данные из вашего каталога. Никаких придуманных фактов." },
                { title: "Контроль менеджера", desc: "В любой момент вы можете перехватить диалог в админ-панели и ответить клиенту лично." },
                { title: "Интеграция за 1 минуту", desc: "Добавьте одну строку кода на сайт — и виджет уже работает и приносит лиды." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-5">
                  <div className="mt-1 bg-[#8BFDA8]/10 p-2 rounded-xl border border-[#8BFDA8]/20 flex-shrink-0">
                    <CheckCircle2 size={20} className="text-[#8BFDA8]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 w-full flex justify-center">
            {/* Декоративный блок с зелеными неоновыми линиями */}
            <div className="relative w-full max-w-[400px] aspect-square rounded-[40px] border border-zinc-800 bg-zinc-900/30 overflow-hidden flex items-center justify-center shadow-2xl">
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8BFDA8] to-transparent opacity-50 -rotate-45"></div>
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8BFDA8] to-transparent opacity-50 rotate-45"></div>
               <div className="absolute w-32 h-32 bg-[#8BFDA8] rounded-full blur-[100px] opacity-20"></div>
               <div className="z-10 text-center bg-black/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl">
                  <h4 className="text-[#8BFDA8] font-bold text-lg mb-2">Прозрачная работа</h4>
                  <p className="text-xs text-zinc-400">Управляйте каталогом, сторис <br/>и чатами в едином окне</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-32 border-t border-zinc-900 bg-gradient-to-b from-transparent to-[#8BFDA8]/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Начните собирать заявки <br /> уже сегодня</h2>
          <p className="text-lg text-zinc-400 mb-12">
            Создайте платформу бесплатно и протестируйте весь функционал.
          </p>
          <Link href="/login" className="inline-flex h-16 px-12 bg-[#8BFDA8] text-black rounded-[20px] font-black text-xl items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-[0_0_40px_rgba(139,253,168,0.3)]">
            Попробовать бесплатно
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