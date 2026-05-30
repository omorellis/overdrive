import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const novoCliente = await prisma.cliente.create({
      data: {
        nome: data.nome,
        telefone: data.telefone,
        whatsapp: data.whatsapp,
        motos: data.motos,
      }
    });
    return NextResponse.json(novoCliente);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 });
  }
}