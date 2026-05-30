import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Busca as configurações (se não existirem, cria a linha inicial padrão)
export async function GET() {
  try {
    let config = await prisma.configuracao.findUnique({ where: { id: 'sistema-config' } });
    if (!config) {
      config = await prisma.configuracao.create({
        data: {
          id: 'sistema-config',
          nomeOficina: 'OVERDRIVE CUSTOM',
          telefone: '(24) 99999-9999',
          instagram: '@overdrive.custom',
          endereco: 'Rua da Oficina, 123 - Centro',
          cidadeEstado: 'Três Rios - RJ'
        }
      });
    }
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar configurações' }, { status: 500 });
  }
}

// Atualiza os dados da oficina
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const atualizado = await prisma.configuracao.update({
      where: { id: 'sistema-config' },
      data: {
        nomeOficina: data.nomeOficina,
        telefone: data.telefone,
        instagram: data.instagram,
        endereco: data.endereco,
        cidadeEstado: data.cidadeEstado,
      }
    });
    return NextResponse.json(atualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar configurações' }, { status: 500 });
  }
}