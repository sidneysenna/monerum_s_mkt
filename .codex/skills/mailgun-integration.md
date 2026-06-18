# Skill: mailgun-integration

Use para desenhar a integracao Mailgun futura.

## Procedimento

1. Definir contrato `EmailProvider`.
2. Manter Mailgun isolado em infraestrutura.
3. Usar `fetch` nativo.
4. Nao usar `axios`.
5. Montar `application/x-www-form-urlencoded`.
6. Usar Basic Auth com usuario `api`.
7. Validar `EMAIL_SENDING_ENABLED`, `EMAIL_DRY_RUN` e confirmacao.
8. Mascarar segredos em logs.
9. Tratar erros sem expor credenciais.
10. Prever testes com `fetch` mockado.
