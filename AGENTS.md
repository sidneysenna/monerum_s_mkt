# AGENTS.md

Regras principais para agentes e assistentes neste repositorio:

1. A API e prefixada em `/api/v1`.
2. Nunca colocar `/api/v1` diretamente nos controllers.
3. Prefixo global deve ficar no `main.ts`.
4. Usar somente schema `sindicatos_br`.
5. Nao usar schema `public`.
6. Nao alterar `sindicatos_br.sindicatos`.
7. Nao criar migration para tabela existente.
8. Para mapear tabela existente, usar Prisma model com `@@map` e `@@schema`.
9. Rodar apenas `pnpm prisma generate` para atualizar Prisma Client.
10. Nao rodar migrate, db push, migrate reset ou migrate resolve.
11. Queries raw somente parametrizadas.
12. Nao implementar envio real de e-mail nesta etapa.
13. Mailgun futuro deve usar `fetch` nativo, nao `axios`.
14. Usar pnpm.
15. Manter arquitetura modular.

## Estado atual

Modo atual: API HTTP versionada em `/api/v1`, com `GET /api/v1/health` e leitura inicial `GET /api/v1/sindicatos`. Nao criar migrations, nao alterar a tabela existente e nao implementar envio real de e-mail.
