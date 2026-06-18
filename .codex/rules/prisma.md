# Regras Prisma

- Configurar Prisma para usar `sindicatos_br`.
- Nao usar schema `public`.
- Mapear `sindicatos_br.sindicatos` como tabela existente.
- Nao gerar migration para a tabela existente de sindicatos.
- Repositorios de leads devem ser somente leitura para `sindicatos_br.sindicatos`.
- SQL raw deve ser parametrizado.
- Evitar concatenacao direta de dados externos em queries.
- Revisar migrations futuras antes de aplicar.
