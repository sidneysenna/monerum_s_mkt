# Projeto

`monerum_s_mkt` e uma base tecnica para uma futura ferramenta de campanhas de e-mail em massa usando leads de sindicatos armazenados em PostgreSQL.

Nesta etapa o objetivo e documentar arquitetura, regras de seguranca, fluxos esperados e padroes para implementacao futura. Nao criar funcionalidades executaveis.

## Escopo futuro

- Selecionar leads de `sindicatos_br.sindicatos`.
- Filtrar por UF, grau, area geoeconomica, cadastro, grupo, classe, categoria, cidade e presenca de e-mail valido.
- Montar campanhas por templates HTML/TXT.
- Enviar e-mails via Mailgun usando `fetch` nativo.
- Registrar campanha, destinatario, status, eventos, erros e tentativas.
- Evitar duplicidade e reenvio indevido.
- Operar por scripts internos com preview, dry-run e confirmacao explicita.

## Fora do escopo atual

- Implementacao funcional.
- Envio real de e-mail.
- Migrations.
- Endpoints HTTP.
- Controllers NestJS.
- Alteracoes na tabela existente de sindicatos.
