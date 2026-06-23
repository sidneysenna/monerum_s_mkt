# Mailgun

A integracao com Mailgun deve usar `fetch` nativo do Node.js.

## Regras tecnicas

- Nao usar `axios`.
- Nao usar SDK externo sem autorizacao.
- Usar endpoint `/messages`.
- Usar Basic Auth com usuario `api` e senha `MAILGUN_API_KEY`.
- Usar corpo `application/x-www-form-urlencoded`.
- Suportar `from`, `to`, `subject`, `text` e `html`.
- Suportar regiao US/EU por variavel de ambiente, como `MAILGUN_API_BASE_URL`.
- Registrar resposta do Mailgun sem expor segredos.
- Tratar erro de forma segura.
- Endpoint de envio controlado: `POST /api/v1/campanhas/proposta-sindicato-digital/enviar`.

## Regras de seguranca

- Nao enviar e-mail real por padrao.
- Bloquear envio real sem `EMAIL_SENDING_ENABLED=true`, `EMAIL_DRY_RUN=false`, `dryRun=false` e `confirmacao=ENVIAR`.
- Validar `limit` contra `EMAIL_MAX_REQUEST_LIMIT`.
- Toda busca de destinatarios deve aplicar `grupo = 'Trabalhador'`.
- Todo envio real deve ser associado a uma campanha.
- Nao reenviar a mesma campanha para sindicato ja registrado com status `enviado`.
- Dry-run nao deve gravar status `enviado`.
- Respeitar limite diario de 1000 envios por campanha.
- Aplicar delay entre envios reais e pausa entre lotes.
- Tratar 429 com retry/backoff e respeitar `Retry-After`.
- Exigir campanha criada antes de envio.
- Nao enviar para registro sem e-mail valido.
- Renderizar HTML e TXT por destinatario.
- Bloquear envio do destinatario se sobrar placeholder obrigatorio no HTML ou TXT renderizado.
- Nao enviar duplicado na mesma campanha.
- Prever opt-out/descadastro em fase futura.

Nao usar `axios` ou SDK externo.
