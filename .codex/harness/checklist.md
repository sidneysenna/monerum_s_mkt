# Checklist

Antes de qualquer implementacao futura:

- [ ] Ler `AGENTS.md`.
- [ ] Confirmar fase atual do projeto.
- [ ] Confirmar que a API usa prefixo global `/api/v1`.
- [ ] Confirmar que apenas endpoints solicitados foram criados.
- [ ] Confirmar que `Sindicato` usa `@@map("sindicatos")` e `@@schema("sindicatos_br")`.
- [ ] Confirmar que toda consulta de sindicatos/leads aplica `grupo = 'Trabalhador'`.
- [ ] Confirmar que dry-run nao chama Mailgun.
- [ ] Confirmar que envio real exige flags explicitas.
- [ ] Confirmar que apenas `pnpm prisma generate` foi usado para Prisma.
- [ ] Confirmar que a tarefa nao usa `public`.
- [ ] Confirmar que `sindicatos_br.sindicatos` nao sera alterada.
- [ ] Confirmar que nao havera envio real sem autorizacao.
- [ ] Confirmar que segredos nao serao logados.
- [ ] Confirmar que scripts terao preview ou dry-run.
- [ ] Confirmar estrategia de testes.
- Confirmar que envios reais estao associados a uma campanha.
- Confirmar que elegiveis aplicam `grupo = 'Trabalhador'`.
- Confirmar que dry-run nao grava status `enviado`.
- Confirmar que o limite diario de 1000 por campanha e respeitado.
