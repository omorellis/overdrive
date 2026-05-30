import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(request: Request) {
  try {
    const { novaSenha } = await request.json();
    const { data: usuarios, error: fetchError } = await supabase
      .from('Usuario')
      .select('*')
      .limit(1);

    if (fetchError || !usuarios || usuarios.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const usuario = usuarios[0];
    const { error } = await supabase
      .from('Usuario')
      .update({ senha: novaSenha })
      .eq('id', usuario.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao mudar senha' }, { status: 500 });
  }
}