# Mailgun

A integracao futura com Mailgun deve usar `fetch` nativo do Node.js.

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

## Regras de seguranca

- Nao enviar e-mail real por padrao.
- Bloquear envio real em ambiente local/dev sem confirmacao explicita.
- Exigir campanha criada antes de envio.
- Nao enviar para registro sem e-mail valido.
- Nao enviar duplicado na mesma campanha.
- Prever opt-out/descadastro em fase futura.

Nao implementar client Mailgun nesta etapa.
