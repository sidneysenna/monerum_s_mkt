# monerum_s_mkt

API HTTP planejada para apoiar uma futura ferramenta de envio de e-mail em massa para leads armazenados em PostgreSQL.

Esta etapa configura a entrada HTTP versionada em `/api/v1`, conexao Prisma e leitura inicial da tabela existente `sindicatos_br.sindicatos`. Ainda nao ha envio real, migrations ou fluxo funcional de campanha.

## Objetivo

Preparar uma API NestJS com TypeScript, Prisma, PostgreSQL, Mailgun e templates HTML/TXT para futuramente:

- consultar leads existentes em `sindicatos_br.sindicatos`;
- filtrar sindicatos por UF, grau, area geoeconomica, cadastro, classe, categoria e outros campos;
- executar campanhas por API e, quando necessario, scripts internos operacionais;
- registrar campanhas, destinatarios, status, erros, tentativas e auditoria;
- evitar reenvios indevidos;
- preparar filas, processamento assincrono e retentativas em fases futuras.

## API HTTP

Versao inicial da API:

```txt
/api/v1
```

Endpoints disponiveis:

```txt
GET /api/v1/health
GET /api/v1/sindicatos
```

Resposta esperada:

```json
{
  "status": "ok",
  "service": "monerum_s_mkt",
  "version": "v1",
  "timestamp": "<ISO_DATE>"
}
```

## Execucao local

```bash
pnpm install
pnpm prisma generate
pnpm start:dev
```

Teste manual:

```txt
http://localhost:3000/api/v1/health
http://localhost:3000/api/v1/sindicatos?uf=MG&limit=10
```

## Scripts operacionais

Scripts internos permanecem como possibilidade futura:

```bash
pnpm script:preview-campanha
pnpm script:validar-leads
pnpm script:dry-run-campanha
pnpm script:executar-campanha
```

Esses comandos existem como placeholders seguros em TypeScript. Eles nao consultam banco, nao enviam e-mail e nao executam campanhas nesta etapa.

## Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Mailgun
- Templates `.html` e `.txt`
- `fetch` nativo do Node.js para chamadas HTTP
- pnpm

## Estrutura de pastas

```txt
prisma/
scripts/
src/
  config/
  scripts/
  shared/
  modules/
    leads/
    campanhas/
    emails/
    health/
    sindicatos/
    templates/
.codex/
```

## Banco de dados

Schema exclusivo do projeto:

```txt
sindicatos_br
```

Tabela fonte de leads ja existente:

```txt
sindicatos_br.sindicatos
```

Regras absolutas:

- nao usar o schema `public`;
- nao criar, alterar, apagar, truncar, mover ou corrigir objetos em `public`;
- nao criar migration para `sindicatos_br.sindicatos`;
- nao recriar nem alterar a estrutura de `sindicatos_br.sindicatos`;
- tratar `sindicatos_br.sindicatos` como fonte existente e somente leitura.
- o model Prisma `Sindicato` usa `@@map("sindicatos")` e `@@schema("sindicatos_br")`.

## Arquitetura planejada

Estrutura futura sugerida:

```txt
src/
  main.ts
  app.module.ts
  config/
  scripts/
  shared/
  modules/
    leads/
    campanhas/
    emails/
    health/
    sindicatos/
    templates/
```

Os modulos devem separar dominio, aplicacao, infraestrutura e apresentacao. A entrada principal agora e API HTTP versionada em `/api/v1`, mantendo scripts como apoio operacional futuro.

## Variaveis de ambiente previstas

Veja tambem `.env.example`.

```txt
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://usuario:senha@localhost:5432/banco?schema=sindicatos_br

MAILGUN_API_KEY=
MAILGUN_DOMAIN=
MAILGUN_API_BASE_URL=https://api.mailgun.net/v3
MAILGUN_FROM_NAME=Monerum
MAILGUN_FROM_EMAIL=

EMAIL_SENDING_ENABLED=false
EMAIL_DRY_RUN=true
EMAIL_BATCH_SIZE=50
EMAIL_BATCH_INTERVAL_MS=1000
EMAIL_REQUIRE_CONFIRMATION=true
```

Nunca commitar `.env` real nem segredos.

## Mailgun

A integracao futura deve usar:

- endpoint `/messages`;
- Basic Auth com usuario `api` e senha `MAILGUN_API_KEY`;
- corpo `application/x-www-form-urlencoded`;
- campos `from`, `to`, `subject`, `text` e `html`;
- suporte futuro a regioes US/EU por variavel de ambiente;
- `fetch` nativo do Node.js;
- nenhum `axios`;
- nenhum SDK externo sem autorizacao.

Envio real nao esta implementado e devera ser bloqueado por padrao em ambiente local/dev.

## Fases futuras

1. Criar filtros mais completos de segmentacao de leads.
2. Modelar entidades futuras de campanhas sem tocar na tabela existente de sindicatos.
3. Desenhar cliente Mailgun com `fetch`, ainda sem envio real por padrao.
4. Criar motor de templates HTML/TXT.
5. Criar fluxo de campanha por API/scripts, preview e dry-run.
6. Criar testes e validacoes de seguranca.

## Aviso

Esta etapa e leitura inicial segura, documentacao e regras de seguranca. Nenhum e-mail sera enviado por este projeto nesta fase e nenhuma migration foi criada.
