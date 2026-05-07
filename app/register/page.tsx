'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) { setError('Укажите название компании'); return; }
    if (!email.trim()) { setError('Введите Email'); return; }
    if (password.length < 6) { setError('Пароль должен быть минимум 6 символов'); return; }

    setIsLoading(true); setError(''); setSuccessMsg('');

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` }
      });

      if (authError) throw authError;

      if (authData.user) {
        if (!authData.session) {
          setSuccessMsg('Аккаунт создан! Пожалуйста, подтвердите почту (проверьте Спам), чтобы завершить настройку.');
          return;
        }

        const { error: dbError } = await supabase.from('projects').insert([{ 
            user_id: authData.user.id, 
            company_name: companyName,
            system_prompt: "Ты — ИИ-ассистент компании " + companyName + ". Твоя задача — помогать клиентам и продавать услуги."
        }]);
          
        if (dbError) throw new Error('Ошибка БД: ' + dbError.message);
        router.push('/admin');
      }

    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при связи с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] p-4 font-sans selection:bg-[#8BFDA8] selection:text-black relative z-10">
      <div className="w-full max-w-[420px] bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F0F0F0] p-8 md:p-10 relative z-20 animate-in slide-in-from-right-4 duration-300">
        
        <div className="flex flex-col items-center mb-8">
          <div className="mb-8">
            <svg className="h-[18px] w-auto" viewBox="0 0 99 14" fill="none"><path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="black"/><path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="black"/><path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="black"/><path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/></svg>
          </div>

          {/* НАСТОЯЩИЙ ПЕРЕКЛЮЧАТЕЛЬ ССЫЛОК */}
          <div className="w-full bg-[#F2F2F7] rounded-full p-1 flex relative mb-4">
            <div className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm translate-x-full"></div>
            <Link href="/login" className="w-1/2 py-2 text-[14px] font-semibold z-10 text-[#8E8E93] hover:text-black transition-colors flex items-center justify-center">Войти</Link>
            <div className="w-1/2 py-2 text-[14px] font-semibold z-10 text-black flex items-center justify-center cursor-default">Создать</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-wide ml-1">Название компании</label>
            <input 
              type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
              className="w-full h-[52px] bg-white border border-[#E5E5EA] focus:border-[#8BFDA8] focus:ring-4 focus:ring-[#8BFDA8]/10 rounded-[14px] px-4 text-[16px] text-black outline-none transition-all"
              placeholder="Мой бизнес"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-wide ml-1">Email</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] bg-white border border-[#E5E5EA] focus:border-[#8BFDA8] focus:ring-4 focus:ring-[#8BFDA8]/10 rounded-[14px] px-4 text-[16px] text-black outline-none transition-all"
              placeholder="name@mail.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-wide ml-1">Пароль</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[52px] bg-white border border-[#E5E5EA] focus:border-[#8BFDA8] focus:ring-4 focus:ring-[#8BFDA8]/10 rounded-[14px] px-4 text-[16px] text-black outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-[#FF3B30] text-[13px] font-medium bg-[#FF3B30]/10 border border-[#FF3B30]/20 p-3 rounded-[12px] flex gap-2 items-center"><AlertCircle size={16}/> {error}</div>}
          {successMsg && <div className="text-[#34C759] text-[13px] font-medium bg-[#34C759]/10 border border-[#34C759]/20 p-3 rounded-[12px] flex items-start gap-2"><CheckCircle2 size={16} className="shrink-0 mt-0.5" /><span>{successMsg}</span></div>}

          <button 
            type="submit" disabled={isLoading}
            className="w-full h-[52px] bg-black text-[#8BFDA8] rounded-[14px] font-bold text-[16px] mt-4 flex items-center justify-center disabled:opacity-50 active:scale-[0.98] transition-all hover:opacity-90"
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : 'Создать аккаунт'}
          </button>
        </form>

      </div>
    </div>
  );
}