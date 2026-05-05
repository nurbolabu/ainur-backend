import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST() {
  // Пока просто отвечаем "ок", чтобы виджет не выдавал ошибки в консоль
  return NextResponse.json({ success: true }, { headers: corsHeaders });
}