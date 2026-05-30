import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Atualiza o cliente (Editar)
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const atualizado = await prisma.cliente.update({
      where: { id },
      data: {
        nome: data.nome,
        whatsapp: data.whatsapp,
        telefone: data.telefone,
        motos: data.motos,
      }
    });
    return NextResponse.json(atualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}

// Exclui o cliente
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.cliente.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar cliente' }, { status: 500 });
  }
}