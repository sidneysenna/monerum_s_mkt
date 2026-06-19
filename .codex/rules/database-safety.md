# Regras de seguranca de banco

- Usar exclusivamente `sindicatos_br`.
- Tratar `sindicatos_br.sindicatos` como tabela existente e somente leitura.
- Tabelas de controle de campanha devem ser criadas somente em `sindicatos_br`.
- Nao criar FK real para `sindicatos_br.sindicatos`.
- Toda consulta de sindicatos/leads deve aplicar `grupo = 'Trabalhador'`.
- Nao criar migration para `sindicatos_br.sindicatos`.
- Nao alterar a estrutura de `sindicatos_br.sindicatos`.
- Nao usar `prisma migrate reset`.
- Nao resolver migrations do schema `public`.
- Nao usar `db push` sem revisao explicita em fase futura.
- Permitir leitura diagnostica em `information_schema` e `pg_catalog` quando necessario.
- Revisar qualquer SQL raw antes de executar.
- Parametrizar dados externos em SQL raw.
