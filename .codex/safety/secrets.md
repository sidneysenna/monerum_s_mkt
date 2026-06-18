# Segredos

Nunca commitar valores reais de:

```txt
MAILGUN_API_KEY
MAILGUN_DOMAIN
MAILGUN_API_BASE_URL
DATABASE_URL
```

Regras:

- manter apenas `.env.example`;
- nunca criar `.env` real nesta etapa;
- mascarar segredos em logs;
- nao incluir credenciais em mensagens de erro;
- nao expor conexoes completas em auditorias.
