import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Total de Clientes
    const clientesTotal = await prisma.cliente.count();

    // 2. Faturamento (Soma de todos os Orçamentos/Notas geradas)
    const orcamentos = await prisma.orcamento.findMany();
    const faturamentoTotal = orcamentos.reduce((acc, curr) => acc + curr.total, 0);

    // 3. Status das Ordens de Serviço (Ativas vs Entregues)
    const osAtivas = await prisma.ordemServico.count({
      where: { status: { not: 'ENTREGUE' } }
    });
    const osEntregues = await prisma.ordemServico.count({
      where: { status: 'ENTREGUE' }
    });

    // 4. Alerta de Estoque Baixo (Peças com 5 ou menos unidades)
    const estoqueBaixo = await prisma.produtoEstoque.count({
      where: { quantidade: { lte: 5 } }
    });

    // 5. Últimas movimentações de OS na bancada (Para a tabela recente)
    const ultimasOS = await prisma.ordemServico.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { cliente: true }
    });

    return NextResponse.json({
      clientesTotal,
      faturamentoTotal,
      osAtivas,
      osEntregues,
      estoqueBaixo,
      ultimasOS
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados do dashboard' }, { status: 500 });
  }
}