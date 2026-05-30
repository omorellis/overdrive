import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { count: clientesTotal } = await supabase
      .from('Cliente')
      .select('*', { count: 'exact', head: true });

    const { data: orcamentos } = await supabase
      .from('Orcamento')
      .select('total');
    const faturamentoTotal = orcamentos?.reduce((acc: number, curr: any) => acc + (curr.total || 0), 0) || 0;

    const { count: osAtivas } = await supabase
      .from('OrdemServico')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'ENTREGUE');

    const { count: osEntregues } = await supabase
      .from('OrdemServico')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ENTREGUE');

    const { count: estoqueBaixo } = await supabase
      .from('ProdutoEstoque')
      .select('*', { count: 'exact', head: true })
      .lte('quantidade', 5);

    const { data: ultimasOS, error: osError } = await supabase
      .from('OrdemServico')
      .select('*, Cliente(*)')
      .order('updatedAt', { ascending: false })
      .limit(5);

    if (osError) throw osError;

    return NextResponse.json({
      clientesTotal,
      faturamentoTotal,
      osAtivas,
      osEntregues,
      estoqueBaixo,
      ultimasOS: ultimasOS || []
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados do dashboard' }, { status: 500 });
  }
}