# Prisma

Infraestrutura compartilhada para acesso ao Prisma Client.

Regras:

- nao executar migrations no boot;
- nao executar DDL no boot;
- usar somente o schema `sindicatos_br`;
- nao usar o schema `public`;
- manter `sindicatos_br.sindicatos` como leitura nesta etapa.
