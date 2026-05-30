import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data, error } = await supabase.from('Cliente').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isOficina = body.motos?.includes('Oficina') || false;

    const { data, error } = await supabase.from('Cliente').insert([{
      nome: body.nome,
      telefone: body.telefone,
      whatsapp: body.whatsapp,
      motos: body.motos,
      isOficina
    }]).select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Catch error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}