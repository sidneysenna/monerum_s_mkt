# Projeto

`monerum_s_mkt` e uma API HTTP NestJS versionada para uma futura ferramenta de campanhas de e-mail em massa usando leads de sindicatos armazenados em PostgreSQL.

Nesta etapa a entrada principal e HTTP com prefixo global `/api/v1`.

Endpoints implementados:

- `GET /api/v1/health`
- `GET /api/v1/sindicatos`

## Escopo futuro

- Ler sindicatos de `sindicatos_br.sindicatos` com filtros iniciais seguros.
- Filtrar por UF, grau, area geoeconomica, cadastro, grupo, classe, categoria, cidade e presenca de e-mail valido.
- Montar campanhas por templates HTML/TXT.
- Enviar e-mails via Mailgun usando `fetch` nativo.
- Registrar campanha, destinatario, status, eventos, erros e tentativas.
- Evitar duplicidade e reenvio indevido.
- Operar por scripts internos com preview, dry-run e confirmacao explicita.
- Expor endpoints HTTP versionados para fluxos futuros.

## Fora do escopo atual

- Implementacao funcional.
- Envio real de e-mail.
- Migrations.
- Endpoints de campanha ou envio.
- Alteracoes na tabela existente de sindicatos.
