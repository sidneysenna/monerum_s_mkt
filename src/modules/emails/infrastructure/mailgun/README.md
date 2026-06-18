# Mailgun

Implementacao futura do provider Mailgun.

Regras:

- usar `fetch` nativo do Node.js;
- nao usar `axios`;
- nao usar SDK externo sem autorizacao;
- usar Basic Auth com usuario `api` e senha `MAILGUN_API_KEY`;
- enviar corpo `application/x-www-form-urlencoded`;
- suportar `from`, `to`, `subject`, `text` e `html`;
- bloquear envio real por padrao;
- nao expor segredos em logs.

Nenhum client Mailgun foi implementado nesta etapa.
