import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Заголовки CORS для приема запросов с сайтов клиентов
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Подключаем Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, conversationId, name, phone, cartItems, total } = body;

    // 1. Базовая валидация (обязательные поля)
    if (!projectId || !name || !phone) {
      return NextResponse.json({ error: "Не заполнены обязательные поля (Имя, Телефон или ID проекта)" }, { status: 400, headers: corsHeaders });
    }

    // 2. Определяем тип заявки (Заказ из корзины или просто Лид)
    const isOrder = cartItems && Array.isArray(cartItems) && cartItems.length > 0;
    const leadType = isOrder ? 'order' : 'lead';

    // 3. Формируем данные для сохранения
    const leadData = {
      project_id: projectId,
      client_name: name,
      client_phone: phone,
      type: leadType,
      order_data: isOrder ? cartItems : null,
      total_sum: isOrder ? total : 0,
      status: 'New',
      conversation_id: conversationId || null, // Привязываем заявку к истории чата
    };

    // 4. Записываем в таблицу leads
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('Ошибка сохранения в Supabase:', error);
      return NextResponse.json({ error: 'Ошибка базы данных при сохранении заявки' }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true, lead: data }, { headers: corsHeaders });

  } catch (error) {
    console.error('Критическая ошибка в /api/lead:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500, headers: corsHeaders });
  }
}