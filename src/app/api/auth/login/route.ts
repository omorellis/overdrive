import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { login, senha } = await request.json();
    console.log('Login attempt:', login);

    const { data: usuarios, error: fetchError } = await supabase
      .from('Usuario')
      .select('*')
      .limit(1);

    console.log('Usuarios found:', usuarios?.length, 'Error:', fetchError);

    if (!usuarios || usuarios.length === 0) {
      console.log('Creating default admin user');
      const { error: createError } = await supabase
        .from('Usuario')
        .insert([{ login: 'admin', senha: '123' }]);
      if (createError) {
        console.error('Create error:', createError);
        throw createError;
      }
    }

    const { data: usuario, error } = await supabase
      .from('Usuario')
      .select('*')
      .eq('login', login)
      .single();

    console.log('Found usuario:', usuario, 'Error:', error);

    if (!error && usuario && usuario.senha === senha) {
      return NextResponse.json({ success: true, login: usuario.login });
    }

    return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}