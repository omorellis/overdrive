import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('ProdutoEstoque')
      .select('*')
      .order('nome', { ascending: true });
    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar estoque' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { data: novo, error } = await supabase
      .from('ProdutoEstoque')
      .insert([{
        nome: data.nome,
        codigo: data.codigo,
        categoria: data.categoria,
        quantidade: Number(data.quantidade),
        precoCusto: Number(data.precoCusto) || 0,
        precoVenda: Number(data.precoVenda) || 0,
      }])
      .select();
    if (error) throw error;
    return NextResponse.json(novo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}