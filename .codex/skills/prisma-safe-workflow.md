# Skill: prisma-safe-workflow

Use para qualquer tarefa futura envolvendo Prisma.

## Procedimento

1. Confirmar que o schema alvo e `sindicatos_br`.
2. Confirmar que `public` nao sera usado.
3. Confirmar que `sindicatos_br.sindicatos` nao sera alterada.
4. Revisar modelos antes de qualquer migration futura.
5. Nunca usar `prisma migrate reset`.
6. Nunca resolver migrations relacionadas a `public`.
7. Parametrizar SQL raw.
8. Documentar risco e rollback antes de aplicar mudancas.

Nesta fase, nao criar migrations.
