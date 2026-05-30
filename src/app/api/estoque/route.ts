import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const estoque = await prisma.produtoEstoque.findMany({
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(estoque);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar estoque' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const novo = await prisma.produtoEstoque.create({
      data: {
        nome: data.nome,
        codigo: data.codigo,
        categoria: data.categoria,
        quantidade: Number(data.quantidade),
        precoCusto: Number(data.precoCusto) || 0,
        precoVenda: Number(data.precoVenda) || 0,
      }
    });
    return NextResponse.json(novo);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}