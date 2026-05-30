import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Orcamento')
      .select('*, Cliente(*)')
      .order('createdAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar orçamentos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { data: novo, error } = await supabase
      .from('Orcamento')
      .insert([{
        clienteId: data.clienteId,
        tipo: data.tipo,
        total: data.total,
        itens: JSON.stringify(data.itens),
      }])
      .select();
    if (error) throw error;
    return NextResponse.json(novo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar orçamento' }, { status: 500 });
  }
}