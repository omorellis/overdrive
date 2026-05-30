import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Atualiza um cliente (EDITAR)
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const atualizado = await prisma.cliente.update({
      where: { id: id },
      data: {
        nome: data.nome,
        telefone: data.telefone,
        whatsapp: data.whatsapp,
        motos: data.motos,
      }
    });
    
    return NextResponse.json(atualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}

// Exclui um cliente (DELETAR)
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.cliente.delete({
      where: { id: id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar cliente' }, { status: 500 });
  }
}