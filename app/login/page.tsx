'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        // ВХОД
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw new Error('Неверный email или пароль');
        router.push('/admin');
      } else {
        // РЕГИСТРАЦИЯ
        if (!companyName) throw new Error('Укажите название компании');
        const { data, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw new Error(authError.message);
        
        // Сразу создаем проект для нового пользователя
        if (data.user) {
          const { error: dbError } = await supabase.from('projects').insert([
            { user_id: data.user.id, company_name: companyName }
          ]);
          if (dbError) throw new Error('Ошибка при создании проекта');
          router.push('/admin');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] flex items-center justify-center p-4 font-sans text-[#000000] selection:bg-[#8BFDA8]">
      <div className="w-full max-w-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Логотип / Заголовок */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#FFFFFF] rounded-[18px] shadow-sm flex items-center justify-center mb-4">
            <span className="font-bold text-[24px] tracking-tight">AI</span>
          </div>
          <h1 className="text-[28px] font-bold tracking-tight">AI NUR Platform</h1>
          <p className="text-[15px] text-[#8E8E93] mt-1">Умные виджеты для вашего бизнеса</p>
        </div>

        {/* Форма (Модуль iOS) */}
        <div className="bg-[#FFFFFF] rounded-[24px] overflow-hidden">
          
          {/* iOS Segmented Control */}
          <div className="p-4 pb-0">
            <div className="flex bg-[#F2F2F7] p-[3px] rounded-[10px]">
              <button 
                type="button"
                onClick={() => { setIsLogin(true); setError(''); }} 
                className={`flex-1 py-1.5 text-[14px] font-medium rounded-[7px] transition-all ${isLogin ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_3px_8px_rgba(0,0,0,0.12)]' : 'text-[#8E8E93]'}`}
              >
                Вход
              </button>
              <button 
                type="button"
                onClick={() => { setIsLogin(false); setError(''); }} 
                className={`flex-1 py-1.5 text-[14px] font-medium rounded-[7px] transition-all ${!isLogin ? 'bg-[#FFFFFF] text-[#000000] shadow-[0_3px_8px_rgba(0,0,0,0.12)]' : 'text-[#8E8E93]'}`}
              >
                Регистрация
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 pt-6 flex flex-col gap-4">
            
            {!isLogin && (
              <div>
                <label className="text-[13px] text-[#8E8E93] font-medium ml-4 mb-1 block uppercase">Название компании</label>
                <input 
                  type="text" 
                  required 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-[14px] h-[50px] px-4 text-[17px] outline-none focus:bg-[#FFFFFF] focus:border-[#8BFDA8] transition-colors"
                  placeholder="Например: AI Studio"
                />
              </div>
            )}

            <div>
              <label className="text-[13px] text-[#8E8E93] font-medium ml-4 mb-1 block uppercase">Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-[14px] h-[50px] px-4 text-[17px] outline-none focus:bg-[#FFFFFF] focus:border-[#8BFDA8] transition-colors"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="text-[13px] text-[#8E8E93] font-medium ml-4 mb-1 block uppercase">Пароль</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F5F5F7] border border-[#E5E5EA] rounded-[14px] h-[50px] px-4 text-[17px] outline-none focus:bg-[#FFFFFF] focus:border-[#8BFDA8] transition-colors"
                placeholder="Минимум 6 символов"
              />
            </div>

            {error && (
              <div className="text-[#FF3B30] text-[14px] text-center mt-2 font-medium">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#8BFDA8] text-[#000000] font-semibold text-[17px] rounded-[14px] h-[50px] mt-4 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Войти' : 'Создать аккаунт')}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}