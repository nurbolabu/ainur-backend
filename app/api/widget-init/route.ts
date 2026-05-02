import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Универсальные заголовки для обхода блокировок браузера (CORS)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Метод OPTIONS нужен для браузеров (Preflight-запрос перед POST)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Подключаем базу данных Supabase
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Не передан ID проекта" }, { status: 400, headers: corsHeaders });
    }

    // 1. Получаем настройки компании (дизайн, контакты)
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('company_name, logo_url, theme_color, contacts_address, contacts_schedule, contacts_phones, social_links, widget_settings')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Проект не найден' }, { status: 404, headers: corsHeaders });
    }

    // 2. Получаем активные товары (Каталог)
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, description, price, image_url')
      .eq('project_id', projectId)
      .eq('is_active', true);

    // 3. Получаем контент для сторис (сортируем по порядку)
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('id, media_url, order_index')
      .eq('project_id', projectId)
      .order('order_index', { ascending: true });

    // 4. Формируем красивый JSON ответ для нашего виджета
    const responseData = {
      project,
      products: products || [],
      stories: stories || []
    };

    return NextResponse.json(responseData, { headers: corsHeaders });

  } catch (error) {
    console.error('Ошибка инициализации виджета:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500, headers: corsHeaders });
  }
}