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
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: Request) {
  try {
    const { projectId, message, conversationId } = await req.json();

    if (!projectId) {
      return NextResponse.json({ reply: "Нет ID проекта" }, { headers: corsHeaders });
    }

    const { data: project, error: dbError } = await supabase
      .from('projects')
      .select('company_name, system_prompt, knowledge_base')
      .eq('id', projectId)
      .single();

    if (dbError || !project) {
      return NextResponse.json({ error: 'Проект не найден' }, { status: 404, headers: corsHeaders });
    }

    const systemPrompt = `
      Ты профессиональный ИИ-ассистент компании "${project.company_name}".
      ${project.system_prompt || ''}
      
      База знаний: ${project.knowledge_base || 'Нет данных'}
      
      ВАЖНОЕ ПРАВИЛО: Отвечай ТОЛЬКО на основе Базы знаний. Если клиент спрашивает цену, услуги или любую информацию, которой НЕТ в базе знаний, КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО придумывать цифры или факты. 
      В этом случае ты ОБЯЗАН ответить: "К сожалению, у меня сейчас нет этой информации. Пожалуйста, оставьте ваш номер WhatsApp, и наш менеджер свяжется с вами!"
      
      Отвечай кратко, не более 2-3 предложений. На русском языке.
    `;

    // Запрашиваем ответ у Llama 3.1
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.1-8b-instant', 
      temperature: 0.1, // Строгий режим, без фантазий
      max_tokens: 256,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Извините, не смог сгенерировать ответ.";

    if (conversationId) {
      await supabase.from('messages').insert([
        { conversation_id: conversationId, role: 'user', content: message },
        { conversation_id: conversationId, role: 'assistant', content: reply }
      ]);
    }

    return NextResponse.json({ reply }, { headers: corsHeaders });

  } catch (error) {
    console.error('Критическая ошибка:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500, headers: corsHeaders });
  }
}