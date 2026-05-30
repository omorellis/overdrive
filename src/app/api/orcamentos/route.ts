import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Busca orçamentos e já traz os dados do cliente junto (relacionamento)
    const orcamentos = await prisma.orcamento.findMany({
      include: { cliente: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orcamentos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar orçamentos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const novo = await prisma.orcamento.create({
      data: {
        clienteId: data.clienteId,
        tipo: data.tipo,
        total: data.total,
        itens: JSON.stringify(data.itens),
      }
    });
    return NextResponse.json(novo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar orçamento' }, { status: 500 });
  }
}