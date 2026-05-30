import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { login, senha } = await request.json();
    
    // Cria o usuário padrão master se o banco estiver totalmente vazio
    let contaExiste = await prisma.usuario.findFirst();
    if (!contaExiste) {
      await prisma.usuario.create({
        data: { login: 'admin', senha: '123' } // Conta padrão inicial
      });
    }

    const usuario = await prisma.usuario.findUnique({ where: { login } });
    
    if (usuario && usuario.senha === senha) {
      return NextResponse.json({ success: true, login: usuario.login });
    }
    
    return NextResponse.json({ error: 'Usuário ou senha incorretos' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}