import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Разрешаем запросы с любых сайтов (CORS)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Обработчик предварительных запросов браузера
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, name, phone, cartItems, total } = body;

    if (!projectId || !name || !phone) {
      return NextResponse.json({ error: 'Заполните все поля' }, { status: 400, headers: corsHeaders });
    }

    // 1. Сохраняем заявку в базу
    const { error } = await supabase
      .from('leads')
      .insert([
        {
          project_id: projectId,
          name: name,
          phone: phone,
          cart_items: cartItems || null, 
          total: total || null
        }
      ]);

    if (error) {
      console.error('Ошибка Supabase:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders });
    }

    // ==========================================
    // 2. ЛОГИКА ОТПРАВКИ УВЕДОМЛЕНИЙ (TELEGRAM И EMAIL)
    // ==========================================
    
    // Достаем настройки проекта, чтобы узнать, куда отправлять уведомления
    const { data: project } = await supabase
      .from('projects')
      .select('widget_settings')
      .eq('id', projectId)
      .single();

    if (project && project.widget_settings) {
      let settings = project.widget_settings;
      if (typeof settings === 'string') {
        try { settings = JSON.parse(settings); } catch(e) { settings = {}; }
      }

      const telegramChatId = settings.notify_telegram;
      const notifyEmail = settings.notify_email;

      // Формируем красивый текст сообщения
      const isOrder = cartItems && cartItems.length > 0;
      let messageText = isOrder ? `🛒 НОВЫЙ ЗАКАЗ!\n\n` : `🔥 НОВАЯ ЗАЯВКА!\n\n`;
      messageText += `👤 Имя: ${name}\n📞 Телефон: ${phone}\n`;
      
      if (isOrder) {
        messageText += `\n📦 Товары:\n`;
        cartItems.forEach((item: any) => {
          messageText += `- ${item.name} (x${item.qty}) = ${item.price * item.qty} ₸\n`;
        });
        messageText += `\n💰 Сумма: ${total} ₸`;
      }

      // --- ОТПРАВКА В TELEGRAM ---
      if (telegramChatId && process.env.TELEGRAM_BOT_TOKEN) {
        try {
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: messageText
            })
          });
        } catch (tgError) {
          console.error('Ошибка отправки в Telegram:', tgError);
        }
      }

      // --- ОТПРАВКА НА EMAIL (Через Resend) ---
      if (notifyEmail && process.env.RESEND_API_KEY) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
              from: 'AI NUR <onboarding@resend.dev>', // Системный адрес Resend
              to: [notifyEmail],
              subject: isOrder ? '🛒 Новый заказ из виджета!' : '🔥 Новая заявка из виджета!',
              text: messageText,
            })
          });
        } catch (emailError) {
          console.error('Ошибка отправки Email:', emailError);
        }
      }
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
    
  } catch (error: any) {
    console.error('Ошибка сервера:', error.message);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500, headers: corsHeaders });
  }
}