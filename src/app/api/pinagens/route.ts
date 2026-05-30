import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('PinagemPainel')
      .select('*')
      .order('moto', { ascending: true });
    if (error) throw error;
    const formatadas = data?.map(p => ({
      ...p,
      direcao: p.direcao ?? 'ltr',
      pinos: typeof p.pinos === 'string' ? JSON.parse(p.pinos) : p.pinos
    })) || [];
    return NextResponse.json(formatadas);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar pinagens' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { data: novaPinagem, error } = await supabase
      .from('PinagemPainel')
      .insert([{
        marca: data.marca,
        moto: data.moto,
        anoInicio: Number(data.anoInicio),
        anoFim: Number(data.anoFim),
        direcao: data.direcao ?? 'ltr',
        pinos: JSON.stringify(data.pinos),
      }])
      .select();
    if (error) throw error;
    return NextResponse.json(novaPinagem);
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar pinagem' }, { status: 500 });
  }
}