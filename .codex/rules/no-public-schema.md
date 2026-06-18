# Regra: schema public proibido

O schema `public` e proibido para este projeto.

Nao criar, alterar, apagar, truncar, mover, sincronizar, corrigir ou resolver objetos em `public`.

Proibido:

```sql
DROP SCHEMA public;
DROP TABLE public.*;
TRUNCATE public.*;
ALTER TABLE public.*;
CREATE TABLE public.*;
CREATE EXTENSION no schema public;
```

Tambem e proibido assumir que objetos em `public` pertencem ao projeto.

O unico schema de aplicacao permitido e `sindicatos_br`.

O model Prisma `Sindicato` deve usar `@@schema("sindicatos_br")`. Nunca trocar para `public`.
