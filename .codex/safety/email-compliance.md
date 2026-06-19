# Conformidade de e-mail

Regras futuras para campanhas:

- nao enviar e-mail sem campanha criada;
- nao enviar para leads sem e-mail valido;
- aplicar sempre `grupo = 'Trabalhador'`;
- nao enviar duplicado na mesma campanha;
- prever opt-out/descadastro;
- registrar status por destinatario;
- registrar erros e tentativas;
- limitar retentativas;
- suportar dry-run;
- dry-run nao deve chamar Mailgun;
- renderizar conteudo por destinatario;
- bloquear destinatario quando sobrar placeholder obrigatorio;
- evitar imagens grandes em Base64 no HTML para reduzir risco de corte em clientes de e-mail;
- limitar lote;
- aplicar pausa entre lotes;
- manter auditoria.

Envio real fica bloqueado por padrao e exige `EMAIL_SENDING_ENABLED=true`, `EMAIL_DRY_RUN=false`, `dryRun=false` e `confirmacao=ENVIAR`.
