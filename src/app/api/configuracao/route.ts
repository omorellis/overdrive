import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    let { data: config, error } = await supabase
      .from('Configuracao')
      .select('*')
      .eq('id', 'sistema-config')
      .single();

    if (error || !config) {
      const { data: novaConfig, error: createError } = await supabase
        .from('Configuracao')
        .insert([{
          id: 'sistema-config',
          nomeOficina: 'OVERDRIVE CUSTOM',
          telefone: '(24) 99999-9999',
          instagram: '@overdrive.custom',
          endereco: 'Rua da Oficina, 123 - Centro',
          cidadeEstado: 'Três Rios - RJ'
        }])
        .select()
        .single();
      if (createError) throw createError;
      config = novaConfig;
    }

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { data: atualizado, error } = await supabase
      .from('Configuracao')
      .update({
        nomeOficina: data.nomeOficina,
        telefone: data.telefone,
        instagram: data.instagram,
        endereco: data.endereco,
        cidadeEstado: data.cidadeEstado,
      })
      .eq('id', 'sistema-config')
      .select();
    if (error) throw error;
    return NextResponse.json(atualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar configurações' }, { status: 500 });
  }
}