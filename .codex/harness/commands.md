# Comandos

Comandos permitidos nesta etapa:

```bash
pnpm --version
node --version
ls
pwd
mkdir
cat
pnpm build
pnpm test
pnpm start:dev
pnpm prisma generate
```

Comandos proibidos nesta etapa:

```bash
pnpm install
pnpm prisma migrate dev
pnpm prisma migrate reset
pnpm prisma db push
pnpm prisma migrate resolve
pnpm start
```

Comandos futuros previstos:

```bash
pnpm script:preview-campanha
pnpm script:validar-leads
pnpm script:dry-run-campanha
pnpm script:executar-campanha
```

Endpoint de verificacao manual:

```txt
GET http://localhost:3000/api/v1/health
GET http://localhost:3000/api/v1/sindicatos?uf=MG&limit=10
GET http://localhost:3000/api/v1/campanhas/proposta-sindicato-digital/preview
POST http://localhost:3000/api/v1/campanhas/proposta-sindicato-digital/enviar?uf=MG&limit=1
```
