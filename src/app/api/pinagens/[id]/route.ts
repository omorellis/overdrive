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
      .from('PinagemPainel')
      .update({
        marca: data.marca,
        moto: data.moto,
        anoInicio: Number(data.anoInicio),
        anoFim: Number(data.anoFim),
        direcao: data.direcao ?? 'ltr',
        pinos: JSON.stringify(data.pinos),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return NextResponse.json(atualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar pinagem' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('PinagemPainel')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar pinagem' }, { status: 500 });
  }
}