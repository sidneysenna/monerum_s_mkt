# Checklist

Antes de qualquer implementacao futura:

- [ ] Ler `AGENTS.md`.
- [ ] Confirmar fase atual do projeto.
- [ ] Confirmar que a API usa prefixo global `/api/v1`.
- [ ] Confirmar que apenas endpoints solicitados foram criados.
- [ ] Confirmar que `Sindicato` usa `@@map("sindicatos")` e `@@schema("sindicatos_br")`.
- [ ] Confirmar que apenas `pnpm prisma generate` foi usado para Prisma.
- [ ] Confirmar que a tarefa nao usa `public`.
- [ ] Confirmar que `sindicatos_br.sindicatos` nao sera alterada.
- [ ] Confirmar que nao havera envio real sem autorizacao.
- [ ] Confirmar que segredos nao serao logados.
- [ ] Confirmar que scripts terao preview ou dry-run.
- [ ] Confirmar estrategia de testes.
