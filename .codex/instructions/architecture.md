# Arquitetura

A arquitetura planejada e modular, com separacao entre dominio, aplicacao, infraestrutura e scripts.

## Estrutura futura sugerida

```txt
src/
  main.ts
  app.module.ts
  config/
    env.validation.ts
    mailgun.config.ts
    database.config.ts
    scripts.config.ts
  scripts/
    executar-campanha.ts
    validar-leads.ts
    preview-campanha.ts
    dry-run-campanha.ts
  shared/
    domain/
    application/
    infrastructure/
    utils/
  modules/
    leads/
    campanhas/
    emails/
    templates/
```

## Camada de entrada

A entrada inicial deve ser por scripts e command runners. Nao criar controllers HTTP nesta etapa.

## Modulos planejados

- `leads`: consulta somente leitura da tabela existente `sindicatos_br.sindicatos`.
- `campanhas`: desenho de campanhas, destinatarios, eventos, status, erros e tentativas.
- `emails`: contrato `EmailProvider` e futura implementacao `MailgunEmailProvider`.
- `templates`: renderizacao de templates `.html` e `.txt`.

## Principios

- Manter regras de negocio em dominio/aplicacao.
- Isolar Prisma e Mailgun em infraestrutura.
- Evitar dependencia direta de provedores externos em casos de uso.
- Preparar para filas, retentativas e processamento assincrono sem implementar agora.
