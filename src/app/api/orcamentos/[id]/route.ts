import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Atualiza um orçamento existente (Para não duplicar no histórico)
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const atualizado = await prisma.orcamento.update({
      where: { id: id },
      data: {
        clienteId: data.clienteId,
        tipo: data.tipo,
        total: data.total,
        itens: JSON.stringify(data.itens),
      }
    });
    
    return NextResponse.json(atualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar orçamento' }, { status: 500 });
  }
}

// Exclui um orçamento
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.orcamento.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar orçamento' }, { status: 500 });
  }
}