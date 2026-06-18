# Regras Mailgun

- Usar `fetch` nativo do Node.js.
- Nao usar `axios`.
- Nao usar SDK externo sem autorizacao.
- Endpoint previsto: `/messages`.
- Auth: Basic Auth com usuario `api` e senha `MAILGUN_API_KEY`.
- Body: `application/x-www-form-urlencoded`.
- Campos previstos: `from`, `to`, `subject`, `text`, `html`.
- Suportar regiao via `MAILGUN_API_BASE_URL`.
- Nao expor `MAILGUN_API_KEY` em logs ou erros.
- Registrar id/status retornado pelo provedor em fase futura.
- Nao enviar e-mail real nesta etapa.
