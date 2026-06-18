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
