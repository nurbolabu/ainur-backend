import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Подключаемся к базе данных
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // Получаем данные от виджета
    const body = await req.json();
    const { projectId, name, phone, cartItems, total } = body;

    // Проверяем, что клиент заполнил обязательные поля
    if (!projectId || !name || !phone) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    // Записываем заявку в таблицу leads
    const { error } = await supabase
      .from('leads')
      .insert([
        {
          project_id: projectId,
          name: name,
          phone: phone,
          // Если это просто заявка, а не корзина, эти поля будут null
          cart_items: cartItems || null, 
          total: total || null
        }
      ]);

    if (error) {
      console.error('Ошибка Supabase:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Ошибка сервера:', error.message);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}