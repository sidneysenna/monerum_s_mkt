# Banco de dados

O projeto usa exclusivamente o schema:

```txt
sindicatos_br
```

E proibido usar o schema:

```txt
public
```

## Tabela existente de leads

Fonte de dados existente:

```txt
sindicatos_br.sindicatos
```

Esta tabela ja existe e deve ser tratada como somente leitura pelo modulo `sindicatos`. Nao criar migration para ela, nao recriar e nao alterar sua estrutura.

Regra permanente de segmentacao:

```txt
grupo = 'Trabalhador'
```

Toda consulta de sindicatos/leads deve aplicar esse filtro, inclusive listagens gerais e selecao de destinatarios de campanha.

## Mapeamento Prisma

O model Prisma `Sindicato` mapeia a tabela existente:

```prisma
@@map("sindicatos")
@@schema("sindicatos_br")
```

O comando permitido para atualizar o client e:

```bash
pnpm prisma generate
```

Nao executar migrations, `db push`, `migrate reset` ou `migrate resolve`.

## Estrutura de referencia

Campos principais: `id`, `cnpj`, `cadastro`, `grau`, `denominacao`, `area_geoeconomica`, `grupo`, `classe`, `categoria`, `localidade_sede`, `uf_sede`, `email`, `telefone1`, `nome_presidente` e demais campos existentes.

Indice primario: `sindicatos_pkey` em `id`.

Indices existentes: `area_geoeconomica`, `cadastro`, `cnpj`, `grau` e `uf_sede`.

## Consultas

Consultas futuras devem:

- parametrizar filtros;
- evitar concatenacao direta de strings com dados externos;
- permitir SQL raw apenas quando necessario, parametrizado e seguro;
- nunca alterar `sindicatos_br.sindicatos`;
- nunca tocar no schema `public`.
- sempre aplicar `grupo = 'Trabalhador'`.

Leitura diagnostica em `information_schema` e `pg_catalog` e permitida quando necessaria.
