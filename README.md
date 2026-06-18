# monerum_s_mkt

Ferramenta planejada para envio de e-mail em massa para leads armazenados em PostgreSQL.

Esta etapa cria apenas a base documental e as regras de arquitetura. Nao ha implementacao funcional, envio real, migrations, endpoints HTTP ou scripts executaveis.

## Objetivo

Preparar um projeto NestJS com TypeScript, Prisma, PostgreSQL, Mailgun e templates HTML/TXT para futuramente:

- consultar leads existentes em `sindicatos_br.sindicatos`;
- filtrar sindicatos por UF, grau, area geoeconomica, cadastro, classe, categoria e outros campos;
- executar campanhas por scripts internos do projeto;
- registrar campanhas, destinatarios, status, erros, tentativas e auditoria;
- evitar reenvios indevidos;
- preparar filas, processamento assincrono e retentativas em fases futuras.

## Execucao por script

A interface operacional inicial sera por scripts internos, por exemplo:

```bash
pnpm script:preview-campanha
pnpm script:validar-leads
pnpm script:dry-run-campanha
pnpm script:executar-campanha
```

Esses comandos sao previstos para fases futuras. Nenhum deles foi implementado nesta etapa.

## Stack

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Mailgun
- Templates `.html` e `.txt`
- `fetch` nativo do Node.js para chamadas HTTP
- pnpm

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
    templates/
```

Os modulos devem separar dominio, aplicacao e infraestrutura. A camada de apresentacao inicial deve ser composta por scripts e command runners, nao por controllers HTTP.

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

1. Criar fundacao NestJS com Prisma configurado para `sindicatos_br`.
2. Modelar entidades futuras de campanhas sem tocar na tabela existente de sindicatos.
3. Desenhar cliente Mailgun com `fetch`, ainda sem envio real por padrao.
4. Criar motor de templates HTML/TXT.
5. Criar fluxo de campanha por scripts, preview e dry-run.
6. Criar testes e validacoes de seguranca.

## Aviso

Esta etapa e somente arquitetura, documentacao e regras de seguranca. Nenhum e-mail sera enviado por este projeto nesta fase.
