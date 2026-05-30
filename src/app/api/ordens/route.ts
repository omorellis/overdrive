import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('OrdemServico')
      .select('*, Cliente(*)')
      .order('updatedAt', { ascending: false });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ordens' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { data: nova, error } = await supabase
      .from('OrdemServico')
      .insert([{
        clienteId: data.clienteId,
        equipamento: data.equipamento,
        defeito: data.defeito,
        status: "AGUARDANDO",
        observacoes: data.observacoes,
        valorTotal: Number(data.valorTotal) || 0,
      }])
      .select();
    if (error) throw error;
    return NextResponse.json(nova);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar ordem' }, { status: 500 });
  }
}