# Regras de seguranca

Nunca commitar:

```txt
MAILGUN_API_KEY
MAILGUN_DOMAIN
MAILGUN_API_BASE_URL
DATABASE_URL
.env
```

## Logs

- Nao registrar segredos.
- Mascara tokens, chaves e URLs sensiveis.
- Registrar apenas dados necessarios para auditoria.

## Execucao

- Envio real deve ser bloqueado por padrao.
- Ambiente local/dev nao deve enviar e-mails sem autorizacao explicita.
- Scripts devem validar configuracao antes de executar.
- Dry-run nao deve chamar Mailgun.
- Toda consulta de leads deve aplicar `grupo = 'Trabalhador'`.
- Toda consulta de destinatarios para campanha deve exigir `email IS NOT NULL` e `email <> ''`, alem de validacao minima de formato antes de enviar.
- Nunca enviar para a base inteira.
- Respeitar limite diario de 100 envios por campanha.
- Dry-run nao deve bloquear destinatario futuro.
