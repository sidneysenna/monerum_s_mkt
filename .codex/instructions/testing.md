# Testes

Estrategia futura de testes:

- testes unitarios para filtros, validadores e regras de campanha;
- testes de integracao para repositorios Prisma usando schema `sindicatos_br`;
- testes de contrato para `EmailProvider`;
- testes do client Mailgun com `fetch` mockado;
- testes de renderizacao de templates HTML/TXT;
- testes de scripts em modo preview e dry-run;
- testes de seguranca garantindo bloqueio de envio real sem confirmacao;
- testes para impedir uso do schema `public`.

Nesta etapa nao rodar `pnpm test` e nao criar implementacao funcional.
