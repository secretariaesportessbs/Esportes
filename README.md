# Fézinha Futsal Inverno — São Bento do Sapucaí

Fézinha online do Campeonato de Futsal de Inverno de São Bento do Sapucaí. Participantes se cadastram, enviam palpites para cada jogo e acompanham o ranking em tempo real. Toda a persistência é feita em uma planilha do Google Sheets.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Google Sheets como banco de dados (via Service Account)
- Zod para validação
- Server Actions para escrita, Server Components para leitura
- Deploy: Vercel

## Estrutura

```
app/                 páginas (App Router) e componentes de UI
  admin/             painel administrativo (protegido por middleware)
  components/        componentes compartilhados
actions/             Server Actions ("use server")
services/            regras de negócio, por cima da camada de dados
lib/
  googleSheets.ts    cliente genérico (getData/insertData/updateData/deleteData)
  initializeSpreadsheet.ts   garante abas/colunas obrigatórias
  auth.ts            sessão simples do admin (cookie httpOnly)
  participanteSession.ts     cookie de identificação do participante
  validation.ts       schemas Zod
  sheetsSchema.ts     nomes das abas e colunas obrigatórias
types/               tipos TypeScript compartilhados
```

## 1. Configurando a Service Account do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e crie (ou selecione) um projeto.
2. Ative a **Google Sheets API** em "APIs e serviços" → "Biblioteca".
3. Vá em "APIs e serviços" → "Credenciais" → "Criar credenciais" → **Conta de serviço**.
4. Após criar, abra a conta de serviço → aba "Chaves" → "Adicionar chave" → "Criar nova chave" → formato **JSON**. O arquivo baixado contém `project_id`, `client_email` e `private_key`.

## 2. Compartilhando a planilha

1. Crie uma planilha em branco no Google Sheets.
2. Copie o **ID da planilha** (trecho da URL entre `/d/` e `/edit`).
3. Clique em "Compartilhar" e adicione o `client_email` da service account (algo como `nome@projeto.iam.gserviceaccount.com`) com permissão de **Editor**.

A aplicação cria automaticamente as abas e colunas necessárias na primeira execução (`initializeSpreadsheet`) — não é preciso criar nada manualmente na planilha.

## 3. Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

```
NEXT_PUBLIC_APP_NAME="Fézinha Futsal Inverno"
GOOGLE_PROJECT_ID=seu-projeto
GOOGLE_CLIENT_EMAIL=nome@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMII...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=id-da-planilha
ADMIN_PASSWORD=escolha-uma-senha-forte
```

> `GOOGLE_PRIVATE_KEY`: cole o valor exatamente como veio no JSON da service account (com `\n` literais). O código já converte `\n` em quebras de linha reais.

## 4. Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`. O painel administrativo fica em `/admin/login` (senha = `ADMIN_PASSWORD`).

## 5. Deploy na Vercel

1. Suba o projeto para um repositório Git e importe na [Vercel](https://vercel.com/new).
2. Em "Environment Variables", adicione as mesmas variáveis do `.env` (inclusive `GOOGLE_PRIVATE_KEY` com os `\n` literais).
3. Deploy. Nenhuma configuração adicional é necessária — o Next.js App Router e as Server Actions rodam nativamente na Vercel.

## Regras de pontuação

- Acertar o vencedor (ou o empate): **+3 pontos**
- Acertar o placar exato: **+5 pontos** adicionais
- Máximo por jogo: **8 pontos**

A pontuação é recalculada automaticamente sempre que um resultado oficial é inserido, e pode ser recalculada manualmente em **Admin → Recalcular pontuação**.

## Regras de palpite

- Palpites não podem ser criados nem alterados depois do horário de início do jogo (validado no servidor, comparando data/hora do jogo com o horário atual).

## Possíveis expansões futuras

- Login com Google
- Múltiplos campeonatos simultâneos
- Upload de escudos dos times
- Notificações via WhatsApp
- Dashboard estatístico avançado
