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
```

Comandos proibidos nesta etapa:

```bash
pnpm install
pnpm prisma migrate dev
pnpm prisma migrate reset
pnpm prisma db push
pnpm start
pnpm test
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
GET http://localhost:3000/v1/health
```
