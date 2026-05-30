import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const atualizado = await prisma.produtoEstoque.update({
      where: { id },
      data: {
        nome: data.nome,
        codigo: data.codigo,
        categoria: data.categoria,
        quantidade: Number(data.quantidade),
        precoCusto: Number(data.precoCusto) || 0,
        precoVenda: Number(data.precoVenda) || 0,
      }
    });
    return NextResponse.json(atualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.produtoEstoque.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 });
  }
}