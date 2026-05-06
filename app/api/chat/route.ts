import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Groq from 'groq-sdk';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Подключаем БД и нейросеть Groq
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: Request) {
  try {
    // ДОБАВЛЕНО: Извлекаем products из запроса виджета
    const { projectId, message, conversationId, aiDisabled, products } = await req.json();

    if (!projectId) {
      return NextResponse.json({ reply: "Нет ID проекта" }, { headers: corsHeaders });
    }

    // ==========================================
    // ЛОГИКА ПЕРЕХВАТА МЕНЕДЖЕРОМ
    // ==========================================
    if (aiDisabled) {
      // Если менеджер в чате, просто сохраняем сообщение клиента и молчим
      if (conversationId) {
        await supabase.from('messages').insert([
          { project_id: projectId, conversation_id: conversationId, role: 'user', content: message }
        ]);
      }
      return NextResponse.json({ reply: "" }, { headers: corsHeaders });
    }

    // 1. Получаем настройки проекта (базу знаний)
    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('company_name, system_prompt, knowledge_base')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      return NextResponse.json({ error: 'Проект не найден' }, { status: 404, headers: corsHeaders });
    }

    // ==========================================
    // ИСТОРИЯ ЧАТА (ПАМЯТЬ ИИ)
    // ==========================================
    let historyForAI: any[] = [];
    if (conversationId) {
      const { data: history } = await supabase
        .from('messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10); // Берем последние 10 сообщений
        
      if (history) {
        historyForAI = history.map(m => ({
          // Groq понимает только роли system, user, assistant. 
          // Если писал менеджер ('manager'), мы передаем это ИИ как ответ 'assistant', чтобы он знал контекст.
          role: m.role === 'user' ? 'user' : 'assistant', 
          content: m.content
        }));
      }
    }

    // ==========================================
    // ДОБАВЛЕНО: ФОРМИРУЕМ КАТАЛОГ ДЛЯ ИИ
    // ==========================================
    let catalogContext = "";
    if (products && Array.isArray(products) && products.length > 0) {
      catalogContext = "АКТУАЛЬНЫЙ КАТАЛОГ ТОВАРОВ И ЦЕН (используй ТОЛЬКО эти данные):\n";
      products.forEach((p: any) => {
        catalogContext += `- ${p.name}: ${p.price} ₸. ${p.description ? 'Описание: ' + p.description : ''}\n`;
      });
    } else {
      catalogContext = "В данный момент каталог товаров пуст.";
    }

    // 2. Формируем строгий системный промпт
    const systemPrompt = `
      Ты профессиональный ИИ-ассистент компании "${project.company_name}".
      ${project.system_prompt || ''}
      
      База знаний компании: ${project.knowledge_base || 'Нет данных'}

      ${catalogContext}
      
      ВАЖНОЕ ПРАВИЛО: Отвечай ТОЛЬКО на основе Базы знаний и Каталога товаров. Если клиент спрашивает цену, услуги или любую информацию, которой НЕТ в каталоге или базе знаний, КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО придумывать цифры, факты или товары. 
      В этом случае ты ОБЯЗАН ответить: "К сожалению, у меня сейчас нет этой информации. Пожалуйста, оставьте вашу заявку в меню или свяжитесь с нами, и наш менеджер проконсультирует вас!"
      
      Отвечай дружелюбно, кратко, не более 2-3 предложений. На русском языке.
    `;

    // 3. Склеиваем всё вместе: Промпт + История + Текущий вопрос
    const messagesToGroq = [
      { role: 'system', content: systemPrompt },
      ...historyForAI,
      { role: 'user', content: message }
    ];

    // 4. Запрашиваем ответ у Llama 3.1
    const chatCompletion = await groq.chat.completions.create({
      messages: messagesToGroq,
      model: 'llama-3.1-8b-instant', 
      temperature: 0.1, // Строгий режим, без фантазий
      max_tokens: 256,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Извините, не смог сгенерировать ответ.";

    // 5. Сохраняем вопрос пользователя и ответ ИИ в базу
    if (conversationId) {
      await supabase.from('messages').insert([
        { project_id: projectId, conversation_id: conversationId, role: 'user', content: message },
        { project_id: projectId, conversation_id: conversationId, role: 'assistant', content: reply }
      ]);
    }

    return NextResponse.json({ reply }, { headers: corsHeaders });

  } catch (error) {
    console.error('Критическая ошибка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500, headers: corsHeaders });
  }
}