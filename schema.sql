-- Cliente
CREATE TABLE "Cliente" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nome" text NOT NULL,
  "telefone" text,
  "whatsapp" text,
  "motos" text,
  "createdAt" timestamp NOT NULL DEFAULT NOW()
);

-- ServicoProduto
CREATE TABLE "ServicoProduto" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "tipo" text NOT NULL,
  "nome" text NOT NULL,
  "preco" float NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT NOW()
);

-- Orcamento
CREATE TABLE "Orcamento" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "clienteId" uuid NOT NULL REFERENCES "Cliente"("id") ON DELETE CASCADE,
  "tipo" text NOT NULL,
  "total" float NOT NULL,
  "itens" text NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT NOW()
);

-- PinagemPainel
CREATE TABLE "PinagemPainel" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "marca" text NOT NULL,
  "moto" text NOT NULL,
  "anoInicio" integer NOT NULL,
  "anoFim" integer NOT NULL,
  "direcao" text NOT NULL DEFAULT 'ltr',
  "pinos" text NOT NULL,
  "createdAt" timestamp NOT NULL DEFAULT NOW()
);

-- ProdutoEstoque
CREATE TABLE "ProdutoEstoque" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "codigo" text,
  "nome" text NOT NULL,
  "categoria" text NOT NULL,
  "quantidade" integer NOT NULL DEFAULT 0,
  "precoCusto" float,
  "precoVenda" float,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW()
);

-- OrdemServico
CREATE TABLE "OrdemServico" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "clienteId" uuid NOT NULL REFERENCES "Cliente"("id") ON DELETE CASCADE,
  "equipamento" text NOT NULL,
  "defeito" text NOT NULL,
  "status" text NOT NULL DEFAULT 'AGUARDANDO',
  "valorTotal" float,
  "observacoes" text,
  "createdAt" timestamp NOT NULL DEFAULT NOW(),
  "updatedAt" timestamp NOT NULL DEFAULT NOW()
);

-- Configuracao
CREATE TABLE "Configuracao" (
  "id" text PRIMARY KEY,
  "nomeOficina" text NOT NULL,
  "telefone" text NOT NULL,
  "instagram" text NOT NULL,
  "endereco" text NOT NULL,
  "cidadeEstado" text NOT NULL
);

-- Usuario
CREATE TABLE "Usuario" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "login" text NOT NULL UNIQUE,
  "senha" text NOT NULL
);
