# AGENTS.md

Regras principais para agentes e assistentes neste repositorio:

1. O projeto e uma API HTTP NestJS versionada em `/v1`.
2. O primeiro endpoint e `GET /v1/health`.
3. Nao usar schema `public`.
4. Usar somente schema `sindicatos_br`.
5. Nao alterar `sindicatos_br.sindicatos`.
6. Nao criar migration sem solicitacao explicita.
7. Nao implementar envio real de e-mail sem solicitacao explicita.
8. Mailgun futuro deve usar `fetch` nativo, nao `axios`.
9. Usar pnpm.
10. Manter arquitetura modular.
11. Nao commitar `.env`.
12. Nao vazar segredos em logs.
13. Toda query raw deve ser parametrizada.
14. Toda campanha futura deve suportar dry-run.
15. Envio real deve exigir confirmacao e flags explicitas.

## Estado atual

Modo atual: API HTTP inicial versionada. Apenas `GET /v1/health` esta disponivel; nao implementar campanhas, leitura de leads, migrations ou envio real de e-mail sem solicitacao explicita.
