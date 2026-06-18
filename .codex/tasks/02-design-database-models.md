# Task 02: desenhar modelos de banco

Objetivo: mapear com seguranca a tabela existente `sindicatos_br.sindicatos` e desenhar modelos futuros para campanhas, destinatarios, eventos, templates e tentativas.

Regras:

- nao criar migration para `sindicatos_br.sindicatos`;
- manter leads como leitura;
- usar apenas `sindicatos_br`;
- mapear a tabela existente com `@@map("sindicatos")` e `@@schema("sindicatos_br")`;
- rodar apenas `pnpm prisma generate` para atualizar o client;
- revisar impacto antes de migrations futuras.

Status: mapeamento inicial de `Sindicato` executado sem migration; modelos de campanha ainda nao executados.
