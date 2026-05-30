import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Lista todas as OS trazendo os dados do Cliente junto
export async function GET() {
  try {
    const ordens = await prisma.ordemServico.findMany({
      include: { cliente: true },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(ordens);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ordens' }, { status: 500 });
  }
}

// Cria uma nova OS
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nova = await prisma.ordemServico.create({
      data: {
        clienteId: data.clienteId,
        equipamento: data.equipamento,
        defeito: data.defeito,
        status: "AGUARDANDO", // Toda OS começa aqui
        observacoes: data.observacoes,
        valorTotal: Number(data.valorTotal) || 0,
      }
    });
    return NextResponse.json(nova);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar ordem' }, { status: 500 });
  }
}