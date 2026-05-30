import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Atualiza uma pinagem existente (EDITAR)
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // Atualizado para o Next.js 16
) {
  try {
    const { id } = await params; // Aguarda o ID ser resolvido
    const data = await request.json();
    
    const atualizado = await prisma.pinagemPainel.update({
      where: { id: id },
      data: {
        marca: data.marca,
        moto: data.moto,
        anoInicio: Number(data.anoInicio),
        anoFim: Number(data.anoFim),
        pinos: JSON.stringify(data.pinos),
      }
    });
    
    return NextResponse.json(atualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar pinagem' }, { status: 500 });
  }
}

// Exclui uma pinagem (DELETAR)
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // Atualizado para o Next.js 16
) {
  try {
    const { id } = await params; // Aguarda o ID ser resolvido
    
    await prisma.pinagemPainel.delete({
      where: { id: id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar pinagem' }, { status: 500 });
  }
}