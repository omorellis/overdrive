import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Busca todas as pinagens cadastradas
export async function GET() {
  try {
    const pinagens = await prisma.pinagemPainel.findMany({
      orderBy: { moto: 'asc' }
    });
    // Converte a string JSON de volta para objeto antes de mandar para a tela
    const formatadas = pinagens.map(p => ({
      ...p,
      pinos: JSON.parse(p.pinos)
    }));
    return NextResponse.json(formatadas);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pinagens' }, { status: 500 });
  }
}

// Salva uma nova pinagem
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const novaPinagem = await prisma.pinagemPainel.create({
      data: {
        marca: data.marca,
        moto: data.moto,
        anoInicio: Number(data.anoInicio),
        anoFim: Number(data.anoFim),
        pinos: JSON.stringify(data.pinos), // Salva o array de pinos como String JSON
      }
    });
    return NextResponse.json(novaPinagem);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar pinagem' }, { status: 500 });
  }
}