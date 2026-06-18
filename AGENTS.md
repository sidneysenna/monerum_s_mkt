# AGENTS.md

Regras principais para agentes e assistentes neste repositorio:

1. Usar pnpm para comandos do projeto.
2. Usar NestJS com TypeScript.
3. O projeto sera executado inicialmente via script.
4. Nao criar controllers HTTP nesta etapa.
5. Nao usar schema `public`.
6. Usar somente schema `sindicatos_br`.
7. Nao implementar envio real nesta fase.
8. Nao usar axios para Mailgun.
9. Planejar Mailgun com `fetch` nativo.
10. Nao criar migrations para a tabela existente `sindicatos_br.sindicatos`.
11. Nao alterar a tabela existente de sindicatos.
12. Criar documentacao clara para futuras fases.
13. Separar dominio, aplicacao, infraestrutura e scripts.
14. Nao vazar segredos em logs.
15. Nao commitar `.env`.
16. Criar e respeitar arquivos de instrucao Codex na pasta `.codex`.

## Estado atual

Modo atual: arquitetura somente. Nao implementar funcionalidades, migrations, endpoints HTTP, envio real de e-mail ou scripts executaveis.

