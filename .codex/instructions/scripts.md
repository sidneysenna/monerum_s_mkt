# Scripts

O projeto sera operado inicialmente por scripts internos, acionados via pnpm em fases futuras.

## Scripts planejados

```txt
preview-campanha
validar-leads
dry-run-campanha
executar-campanha
```

## Regras

- Validar ambiente antes de executar.
- Exigir filtros explicitos para evitar envio acidental para toda a base.
- Exibir resumo antes da execucao.
- Ter modo preview.
- Ter modo dry-run.
- Exigir `EMAIL_SENDING_ENABLED=true` para envio real.
- Exigir `EMAIL_DRY_RUN=false` para envio real.
- Exigir confirmacao explicita quando `EMAIL_REQUIRE_CONFIRMATION=true`.
- Bloquear envio real em ambiente local/dev salvo autorizacao explicita.
- Limitar tamanho de lote.
- Aplicar pausa entre lotes.
- Registrar logs sem expor segredos.
- Evitar duplicidade de destinatarios.

Nenhum script executavel deve ser criado nesta etapa.
