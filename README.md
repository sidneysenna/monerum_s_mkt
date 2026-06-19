# monerum_s_mkt

API HTTP planejada para apoiar uma futura ferramenta de envio de e-mail em massa para leads armazenados em PostgreSQL.

Esta etapa configura a entrada HTTP versionada em `/api/v1`, conexao Prisma, leitura inicial da tabela existente `sindicatos_br.sindicatos` e envio controlado de campanha por Mailgun. Envio real fica bloqueado por padrao.

## Objetivo

Preparar uma API NestJS com TypeScript, Prisma, PostgreSQL, Mailgun e templates HTML/TXT para futuramente:

- consultar leads existentes em `sindicatos_br.sindicatos`;
- filtrar sindicatos por UF, grau, area geoeconomica, cadastro, classe, categoria e outros campos;
- executar campanhas por API e, quando necessario, scripts internos operacionais;
- montar e-mails com HTML renderizado por destinatario e TXT extraido do HTML ja renderizado;
- enviar por Mailgun com `fetch` nativo quando todas as travas forem atendidas;
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
GET /api/v1/campanhas/proposta-sindicato-digital/preview
POST /api/v1/campanhas/proposta-sindicato-digital/enviar
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
http://localhost:3000/api/v1/campanhas/proposta-sindicato-digital/preview
```

Dry-run de envio:

```bash
curl -X POST "http://localhost:3000/api/v1/campanhas/proposta-sindicato-digital/enviar?uf=MG&limit=1"
```

Envio real controlado, somente se configurado:

```bash
curl -X POST "http://localhost:3000/api/v1/campanhas/proposta-sindicato-digital/enviar?uf=MG&limit=1&dryRun=false&confirmacao=ENVIAR"
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
- toda consulta de sindicatos/leads deve aplicar `grupo = 'Trabalhador'`.

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
EMAIL_BATCH_SIZE=10
EMAIL_BATCH_INTERVAL_MS=1000
EMAIL_REQUIRE_CONFIRMATION=true
```

Nunca commitar `.env` real nem segredos.

## Mailgun

A integracao usa:

- endpoint `/messages`;
- Basic Auth com usuario `api` e senha `MAILGUN_API_KEY`;
- corpo `application/x-www-form-urlencoded`;
- campos `from`, `to`, `subject`, `text` e `html`;
- suporte futuro a regioes US/EU por variavel de ambiente;
- `fetch` nativo do Node.js;
- nenhum `axios`;
- nenhum SDK externo sem autorizacao.

Envio real fica bloqueado por padrao. Para enviar de verdade, todas as condicoes abaixo precisam ser verdadeiras:

- `EMAIL_SENDING_ENABLED=true`
- `EMAIL_DRY_RUN=false`
- request com `dryRun=false`
- request com `confirmacao=ENVIAR`
- limite maximo de `10` destinatarios nesta etapa

Sem todas essas condicoes, o endpoint retorna apenas dry-run e nao chama Mailgun.

## Campanha inicial

Campanha:

```txt
proposta-sindicato-digital
```

Template:

```txt
src/modules/emails/infrastructure/templates/campanhas/proposta-sindicato-digital/
  template.html
  template.txt
  metadata.json
```

O `template.html` desta campanha deve permanecer igual ao anexo original, com uma excecao autorizada: a logo foi trocada de Base64 para URL externa para evitar HTML grande e corte em clientes de e-mail como Gmail. Nao reformatar, minificar, corrigir, remover CSS ou alterar o layout.

Logo usada no HTML:

```txt
http://monerum.com.br/asets/logo-suprema.png
```

Placeholders obrigatorios:

```txt
NOME_SINDICATO = denominacao
NOME_PRESIDENTE = nomePresidente
VALOR_MENSALIDADE = 200,00
VALOR_TAXA = 10
CONTATO_WHATSAPP = 5531984791973
VENDEDOR_NOME = SIDNEY SENNA
VENDEDOR_CONTATO = sidney.senna@supremaalgoritmos.com.br
```

Para cada destinatario, a API renderiza o HTML individualmente e gera o TXT a partir do HTML ja renderizado. Se qualquer placeholder obrigatorio sobrar no HTML ou TXT, o envio daquele destinatario e bloqueado.

## Fases futuras

1. Criar persistencia de campanhas e destinatarios no schema `sindicatos_br`.
2. Registrar status de envio, logs de erro, controle de duplicidade, retentativas e opt-out.
3. Criar filtros mais completos de segmentacao de leads.
4. Preparar filas e processamento assincrono.

## Aviso

Esta etapa permite envio controlado, mas dry-run e o comportamento padrao. Nenhuma migration foi criada e a tabela existente nao foi alterada.
