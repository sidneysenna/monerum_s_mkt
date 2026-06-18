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

Esta tabela ja existe e deve ser tratada como somente leitura pelo modulo de leads. Nao criar migration para ela, nao recriar e nao alterar sua estrutura.

## Estrutura de referencia

Campos principais: `id`, `cnpj`, `cadastro`, `grau`, `denominacao`, `area_geoeconomica`, `grupo`, `classe`, `categoria`, `localidade_sede`, `uf_sede`, `email`, `telefone1`, `nome_presidente` e demais campos existentes.

Indice primario: `sindicatos_pkey` em `id`.

Indices existentes: `area_geoeconomica`, `cadastro`, `cnpj`, `grau` e `uf_sede`.

## Consultas

Consultas futuras devem:

- parametrizar filtros;
- evitar concatenacao direta de strings com dados externos;
- permitir SQL raw apenas quando necessario e seguro;
- nunca alterar `sindicatos_br.sindicatos`;
- nunca tocar no schema `public`.

Leitura diagnostica em `information_schema` e `pg_catalog` e permitida quando necessaria.
