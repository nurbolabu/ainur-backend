'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Mode = 'login' | 'register' | 'forgot' | 'update';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Ловим момент, когда пользователь перешел по ссылке из письма для сброса пароля
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('update');
        setPassword('');
        setError('');
        setSuccessMsg('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'register') {
        if (!companyName) throw new Error('Пожалуйста, укажите название компании');
        if (password.length < 6) throw new Error('Пароль должен быть минимум 6 символов');

        // Регистрируем (без подтверждения email, как мы настроили в Supabase)
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
        if (authError) throw new Error(authError.message);

        if (authData.user) {
          // Вшиваем промпт "Супер-продавца"
          const defaultPrompt = "Ты — лучший в мире ИИ-менеджер по продажам. Твоя цель: доброжелательно помогать клиентам, экспертно отвечать на вопросы о товарах и услугах, и мягко подводить пользователя к покупке или оставлению заявки. Ты всегда вежлив, используешь позитивные формулировки и короткие понятные предложения.";
          
          const { data: newProject, error: dbError } = await supabase
            .from('projects')
            .insert([{ 
                user_id: authData.user.id, 
                company_name: companyName,
                system_prompt: defaultPrompt 
            }])
            .select('id')
            .single();
            
          if (dbError) throw new Error('Ошибка при создании проекта');
          
          if (newProject) {
            localStorage.setItem('ainur_admin_project_id', newProject.id);
          }
          router.push('/admin');
        }

      } else if (mode === 'login') {
        const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw new Error('Неверный email или пароль');

        if (data.user) {
          // Ищем проект пользователя
          const { data: project } = await supabase
            .from('projects')
            .select('id')
            .eq('user_id', data.user.id)
            .single();

          if (project) {
            localStorage.setItem('ainur_admin_project_id', project.id);
          }
          router.push('/admin');
        }

      } else if (mode === 'forgot') {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`, // Отправляем обратно на эту же страницу
        });
        if (resetError) throw new Error(resetError.message);
        setSuccessMsg('Ссылка для восстановления отправлена на вашу почту. Проверьте входящие (и папку Спам).');

      } else if (mode === 'update') {
        if (password.length < 6) throw new Error('Новый пароль должен быть минимум 6 символов');
        const { error: updateError } = await supabase.auth.updateUser({ password: password });
        if (updateError) throw new Error(updateError.message);
        
        setSuccessMsg('Пароль успешно изменен!');
        setTimeout(() => {
          router.push('/admin');
        }, 1500);
      }

    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F2F2F7] p-4 font-sans">
      <div className="w-full max-w-[400px] bg-[#FFFFFF] rounded-[24px] shadow-sm border border-[#E5E5EA] p-8 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Шапка формы */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#000000] rounded-[16px] flex items-center justify-center mb-4">
             <span className="text-[#8BFDA8] font-black text-[20px] tracking-wider">AI NUR</span>
          </div>
          <h1 className="text-[24px] font-bold text-[#000000] text-center">
            {mode === 'login' && 'Вход в аккаунт'}
            {mode === 'register' && 'Создать платформу'}
            {mode === 'forgot' && 'Восстановление'}
            {mode === 'update' && 'Новый пароль'}
          </h1>
          <p className="text-[15px] text-[#8E8E93] text-center mt-2">
            {mode === 'login' && 'Управляйте своим ИИ виджетом'}
            {mode === 'register' && 'Займет меньше минуты'}
            {mode === 'forgot' && 'Введите email, и мы пришлем ссылку'}
            {mode === 'update' && 'Придумайте надежный пароль'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Поле Название компании (только регистрация) */}
          {mode === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#8E8E93] uppercase ml-1">Название компании</label>
              <input 
                type="text" 
                required 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full h-[50px] bg-[#F2F2F7] border border-transparent focus:border-[#8BFDA8] rounded-[14px] px-4 text-[16px] text-[#000000] outline-none transition-colors"
                placeholder="Мой бизнес"
              />
            </div>
          )}

          {/* Поле Email (для входа, регистрации и сброса) */}
          {mode !== 'update' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#8E8E93] uppercase ml-1">Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[50px] bg-[#F2F2F7] border border-transparent focus:border-[#8BFDA8] rounded-[14px] px-4 text-[16px] text-[#000000] outline-none transition-colors"
                placeholder="name@mail.com"
              />
            </div>
          )}

          {/* Поле Пароль (для входа, регистрации и установки нового) */}
          {mode !== 'forgot' && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between ml-1">
                 <label className="text-[13px] font-semibold text-[#8E8E93] uppercase">
                    {mode === 'update' ? 'Новый пароль' : 'Пароль'}
                 </label>
                 {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
                      className="text-[13px] font-medium text-[#007AFF] hover:opacity-80 transition-opacity"
                    >
                      Забыли пароль?
                    </button>
                 )}
              </div>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[50px] bg-[#F2F2F7] border border-transparent focus:border-[#8BFDA8] rounded-[14px] px-4 text-[16px] text-[#000000] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Вывод ошибок и успехов */}
          {error && <div className="text-[#FF3B30] text-[14px] font-medium bg-[#FF3B30]/10 p-3 rounded-[12px]">{error}</div>}
          {successMsg && (
            <div className="text-[#34C759] text-[14px] font-medium bg-[#34C759]/10 p-3 rounded-[12px] flex items-start gap-2">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Главная кнопка действия */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-[50px] bg-[#000000] text-[#FFFFFF] rounded-[14px] font-semibold text-[16px] mt-2 flex items-center justify-center disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            {isLoading ? <Loader2 size={22} className="animate-spin" /> : (
              <>
                {mode === 'login' && 'Войти'}
                {mode === 'register' && 'Зарегистрироваться'}
                {mode === 'forgot' && 'Отправить ссылку'}
                {mode === 'update' && 'Сохранить пароль'}
              </>
            )}
          </button>
        </form>

        {/* Переключатели режимов внизу */}
        <div className="mt-6 text-center flex flex-col gap-3">
          {mode === 'login' && (
            <p className="text-[15px] text-[#8E8E93]">
              Нет аккаунта?{' '}
              <button onClick={() => { setMode('register'); setError(''); }} className="text-[#000000] font-semibold hover:underline">
                Создать
              </button>
            </p>
          )}
          
          {mode === 'register' && (
            <p className="text-[15px] text-[#8E8E93]">
              Уже есть аккаунт?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-[#000000] font-semibold hover:underline">
                Войти
              </button>
            </p>
          )}

          {mode === 'forgot' && (
            <button 
              onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }} 
              className="flex items-center justify-center gap-2 text-[15px] font-medium text-[#8E8E93] hover:text-[#000000] transition-colors mx-auto"
            >
              <ArrowLeft size={16} /> Назад ко входу
            </button>
          )}
        </div>

      </div>
    </div>
  );
}