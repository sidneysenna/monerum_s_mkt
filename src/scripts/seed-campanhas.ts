import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const campanha = await prisma.campanhaEmail.upsert({
    where: { codigo: "CAMPANHA_001" },
    create: {
      codigo: "CAMPANHA_001",
      nome: "CAMPANHA 001 - Consciência do problema e apresentando Monerum-S",
      slug: "consciencia-problema-apresentando-monerum-s",
      templateId: "proposta-sindicato-digital",
      status: "ativa",
      limiteDiario: Number(process.env.EMAIL_DAILY_LIMIT) || 1000,
    },
    update: {
      nome: "CAMPANHA 001 - Consciência do problema e apresentando Monerum-S",
      slug: "consciencia-problema-apresentando-monerum-s",
      templateId: "proposta-sindicato-digital",
      status: "ativa",
      limiteDiario: Number(process.env.EMAIL_DAILY_LIMIT) || 1000,
    },
  });

  console.log(`Campanha seedada: ${campanha.codigo}`);
}

main()
  .catch((error) => {
    console.error("Falha ao seedar campanhas.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
