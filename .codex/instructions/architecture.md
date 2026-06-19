# Arquitetura

A arquitetura planejada e modular, com separacao entre dominio, aplicacao, infraestrutura, apresentacao e scripts operacionais futuros.

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
    health/
    leads/
    campanhas/
    emails/
    templates/
```

## Camada de entrada

A entrada principal agora e API HTTP versionada com prefixo global `/api/v1`.

Endpoints iniciais:

```txt
GET /api/v1/health
GET /api/v1/sindicatos
```

Nao criar endpoints de campanha, envio ou leads nesta etapa.

## Modulos planejados

- `health`: health check basico da API.
- `sindicatos`: leitura inicial da tabela existente `sindicatos_br.sindicatos`.
- `leads`: consulta somente leitura da tabela existente `sindicatos_br.sindicatos`.
- `campanhas`: controle de campanhas, limite diario, elegiveis e destinatarios enviados.
- `campanhas`: desenho de campanhas, destinatarios, eventos, status, erros e tentativas.
- `emails`: contrato `EmailProvider` e futura implementacao `MailgunEmailProvider`.
- `templates`: renderizacao de templates `.html` e `.txt`.

## Principios

- Manter regras de negocio em dominio/aplicacao.
- Isolar Prisma e Mailgun em infraestrutura.
- Evitar dependencia direta de provedores externos em casos de uso.
- Preparar para filas, retentativas e processamento assincrono sem implementar agora.
