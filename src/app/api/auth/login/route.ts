import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { login, senha } = await request.json();

    let { data: usuarios, error: countError } = await supabase
      .from('Usuario')
      .select('*', { count: 'exact', head: true });

    if (!usuarios || usuarios.length === 0) {
      const { error: createError } = await supabase
        .from('Usuario')
        .insert([{ login: 'admin', senha: '123' }]);
      if (createError) throw createError;
    }

    const { data: usuario, error } = await supabase
      .from('Usuario')
      .select('*')
      .eq('login', login)
      .single();

    if (!error && usuario && usuario.senha === senha) {
      return NextResponse.json({ success: true, login: usuario.login });
    }

    return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}