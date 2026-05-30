import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const { novaSenha } = await request.json();
    const usuario = await prisma.usuario.findFirst();
    
    if (!usuario) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { senha: novaSenha }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao mudar senha' }, { status: 500 });
  }
}