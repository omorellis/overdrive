import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();

    const { data: atualizada, error } = await supabase
      .from('OrdemServico')
      .update({
        status: data.status,
        equipamento: data.equipamento,
        defeito: data.defeito,
        valorTotal: Number(data.valorTotal) || 0,
        observacoes: data.observacoes,
      })
      .eq('id', id)
      .select();
    if (error) throw error;
    return NextResponse.json(atualizada);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar ordem' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('OrdemServico')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar ordem' }, { status: 500 });
  }
}