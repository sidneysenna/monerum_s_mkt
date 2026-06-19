# Sindicatos

Modulo de leitura da tabela existente `sindicatos_br.sindicatos`.

Endpoint:

```txt
GET /api/v1/sindicatos
```

Regras:

- leitura somente;
- aplicar sempre `grupo = 'Trabalhador'`;
- retornar apenas campos resumidos;
- filtrar apenas registros com e-mail nao nulo e nao vazio;
- nao criar migration;
- nao alterar a tabela existente;
- nao usar o schema `public`.
