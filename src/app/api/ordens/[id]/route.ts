import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Atualiza a OS (Usado para mudar o status no Kanban)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const atualizada = await prisma.ordemServico.update({
      where: { id },
      data: {
        status: data.status,
        equipamento: data.equipamento,
        defeito: data.defeito,
        valorTotal: Number(data.valorTotal) || 0,
        observacoes: data.observacoes,
      }
    });
    return NextResponse.json(atualizada);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar ordem' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.ordemServico.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar ordem' }, { status: 500 });
  }
}