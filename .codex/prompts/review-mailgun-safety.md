# Prompt: revisar seguranca Mailgun

Revise a proposta ou alteracao com foco em Mailgun.

Verifique:

- uso de `fetch` nativo;
- ausencia de `axios`;
- bloqueio de envio real por padrao;
- validacao de `EMAIL_SENDING_ENABLED`, `EMAIL_DRY_RUN` e confirmacao;
- nenhum segredo em logs;
- suporte a texto e HTML.
