# Regras Prisma

- Configurar Prisma para usar `sindicatos_br`.
- Nao usar schema `public`.
- Mapear `sindicatos_br.sindicatos` como tabela existente.
- Usar `@@map("sindicatos")` e `@@schema("sindicatos_br")` para a tabela existente.
- Nao gerar migration para a tabela existente de sindicatos.
- Nesta etapa, rodar apenas `pnpm prisma generate` quando o client precisar ser atualizado.
- Nao rodar `prisma migrate dev`, `prisma migrate reset`, `prisma db push` ou `prisma migrate resolve`.
- Repositorios de leads devem ser somente leitura para `sindicatos_br.sindicatos`.
- SQL raw deve ser parametrizado.
- Evitar concatenacao direta de dados externos em queries.
- Revisar migrations futuras antes de aplicar.
