# Regras Mailgun

- Usar `fetch` nativo do Node.js.
- Nao usar `axios`.
- Nao usar SDK externo sem autorizacao.
- Todo envio real deve registrar campanha e destinatario.
- Nao chamar Mailgun em dry-run.
- Nao reenviar campanha para sindicato ja enviado.
- Endpoint previsto: `/messages`.
- Auth: Basic Auth com usuario `api` e senha `MAILGUN_API_KEY`.
- Body: `application/x-www-form-urlencoded`.
- Campos previstos: `from`, `to`, `subject`, `text`, `html`.
- Suportar regiao via `MAILGUN_API_BASE_URL`.
- Nao expor `MAILGUN_API_KEY` em logs ou erros.
- Envio real exige `EMAIL_SENDING_ENABLED=true`, `EMAIL_DRY_RUN=false`, `dryRun=false` e `confirmacao=ENVIAR`.
- Dry-run e padrao e nao pode chamar Mailgun.
- `limit` deve respeitar `EMAIL_MAX_REQUEST_LIMIT`.
- Envio real deve aplicar throttle entre destinatarios e pausa entre lotes.
- 429 deve ter retry/backoff e respeitar `Retry-After`.
- Toda selecao de destinatarios deve aplicar `grupo = 'Trabalhador'`.
