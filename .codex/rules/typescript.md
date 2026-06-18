# Regras TypeScript

- Usar TypeScript estrito quando o projeto for criado.
- Preferir tipos explicitos em contratos de dominio, DTOs e interfaces publicas.
- Evitar `any`; justificar quando inevitavel.
- Separar dominio, aplicacao e infraestrutura.
- Nao acoplar casos de uso diretamente a Mailgun ou Prisma.
- Validar variaveis de ambiente em um ponto central.
- Logs nao devem incluir segredos.
