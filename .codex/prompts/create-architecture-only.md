# Prompt: criar arquitetura somente

Crie ou atualize apenas documentacao e estrutura de arquitetura.

Nao criar implementacao funcional, migrations, endpoints HTTP, scripts executaveis ou envio real de e-mail.

Respeite:

- schema unico `sindicatos_br`;
- proibicao absoluta do schema `public`;
- tabela existente `sindicatos_br.sindicatos` como somente leitura;
- Mailgun futuro com `fetch` nativo;
- execucao inicial por scripts.
