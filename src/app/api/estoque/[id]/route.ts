import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { data: atualizado, error } = await supabase
      .from('ProdutoEstoque')
      .update({
        nome: data.nome,
        codigo: data.codigo,
        categoria: data.categoria,
        quantidade: Number(data.quantidade),
        precoCusto: Number(data.precoCusto) || 0,
        precoVenda: Number(data.precoVenda) || 0,
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return NextResponse.json(atualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('ProdutoEstoque')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 });
  }
}