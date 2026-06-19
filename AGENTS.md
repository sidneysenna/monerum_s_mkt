# AGENTS.md

Regras principais para agentes e assistentes neste repositorio:

1. A API e prefixada em `/api/v1`.
2. Nunca colocar `/api/v1` diretamente nos controllers.
3. Prefixo global deve ficar no `main.ts`.
4. Usar somente schema `sindicatos_br`.
5. Nao usar schema `public`.
6. Nao alterar `sindicatos_br.sindicatos`.
7. Nao criar migration para tabela existente.
8. Para mapear tabela existente, usar Prisma model com `@@map` e `@@schema`.
9. Rodar apenas `pnpm prisma generate` para atualizar Prisma Client.
10. Nao rodar migrate, db push, migrate reset ou migrate resolve.
11. Queries raw somente parametrizadas.
12. Toda consulta de sindicatos/leads deve aplicar `grupo = 'Trabalhador'`.
13. Nao enviar e-mail real sem flags explicitas.
14. Mailgun deve usar `fetch` nativo, nao `axios`.
15. Nao enviar para a base inteira.
16. Todo envio deve suportar dry-run.
17. Todo template deve ter HTML e TXT.
18. Na campanha `proposta-sindicato-digital`, TXT deve ser extraido do HTML ja renderizado.
19. Nao commitar `.env`.
20. Nao vazar segredos em logs.
21. Usar pnpm.
22. Manter arquitetura modular.
23. Nao incorporar imagens grandes em Base64 nos templates de e-mail. Preferir URL publica quando possivel.
24. Em templates de e-mail, nao depender apenas de CSS em `<style>`. Estilos criticos devem ser aplicados inline antes do envio.

## Estado atual

Modo atual: API HTTP versionada em `/api/v1`, com leitura de sindicatos filtrada por `grupo = 'Trabalhador'`, preview de campanha e envio controlado Mailgun. Dry-run e padrao; envio real exige flags explicitas. Nao criar migrations e nao alterar a tabela existente.

## Campanha proposta-sindicato-digital

O HTML em `src/modules/emails/infrastructure/templates/campanhas/proposta-sindicato-digital/template.html` deve permanecer igual ao anexo original, exceto pela troca autorizada da logo Base64 por `http://monerum.com.br/asets/logo-suprema.png`. Nao reformatar, minificar, corrigir, remover CSS ou alterar layout.

O HTML final de preview/envio deve ter CSS inline nos elementos criticos para preservar a aparencia em clientes de e-mail.

Chaves obrigatorias:

```txt
NOME_SINDICATO
NOME_PRESIDENTE
VALOR_MENSALIDADE
VALOR_TAXA
CONTATO_WHATSAPP
VENDEDOR_NOME
VENDEDOR_CONTATO
```

`NOME_SINDICATO` vem de `denominacao`; `NOME_PRESIDENTE` vem de `nomePresidente`. Os demais valores sao fixos conforme README.
