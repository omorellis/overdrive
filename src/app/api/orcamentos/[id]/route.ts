import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { data: atualizado, error } = await supabase
      .from('Orcamento')
      .update({
        clienteId: data.clienteId,
        tipo: data.tipo,
        total: data.total,
        itens: JSON.stringify(data.itens),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(atualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar orçamento' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('Orcamento')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar orçamento' }, { status: 500 });
  }
}