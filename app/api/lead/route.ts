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

    return NextResponse.json({ success: true }, { headers: corsHeaders });
    
  } catch (error: any) {
    console.error('Ошибка сервера:', error.message);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500, headers: corsHeaders });
  }
}