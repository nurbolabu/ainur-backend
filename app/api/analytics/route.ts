import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Подключаемся к базе данных
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // 1. Получаем данные, которые отправил виджет
    const body = await req.json();
    const { projectId, event, data } = body;

    // 2. Проверяем, что есть базовые данные
    if (!projectId || !event) {
      return NextResponse.json(
        { error: 'Отсутствует projectId или event' }, 
        { status: 400 }
      );
    }

    // 3. Сохраняем в таблицу analytics_events
    const { error } = await supabase
      .from('analytics_events')
      .insert([
        {
          project_id: projectId,
          event_type: event,
          metadata: data || {} // Сюда упадет название соцсети, если это social_click
        }
      ]);

    if (error) {
      console.error('Ошибка записи в Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Отвечаем виджету, что всё прошло успешно
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Ошибка API аналитики:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Разрешаем CORS, чтобы виджеты могли слать запросы с любых доменов клиентов
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}