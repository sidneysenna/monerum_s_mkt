# Prisma

Configuracao inicial segura para PostgreSQL.

## Regras

- Usar somente o schema `sindicatos_br`.
- Nao usar o schema `public`.
- Nao criar migration nesta etapa.
- Nao rodar `prisma migrate dev`, `prisma migrate reset`, `prisma db push` ou `prisma migrate resolve`.
- Nao mapear `sindicatos_br.sindicatos` sem revisao explicita.
- Nao alterar a tabela existente `sindicatos_br.sindicatos`.

O datasource usa `DATABASE_URL`, que deve conter `?schema=sindicatos_br`.
