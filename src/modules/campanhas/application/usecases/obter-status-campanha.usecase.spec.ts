import { CampanhaEmailEntity } from "../../domain/entities/campanha-email.entity";
import { ObterStatusCampanhaUseCase } from "./obter-status-campanha.usecase";

describe("ObterStatusCampanhaUseCase", () => {
  it("retorna enviadosHoje e vagasRestantesHoje", async () => {
    const campanha = new CampanhaEmailEntity(
      "campanha-id",
      "CAMPANHA_001",
      "consciencia-problema-apresentando-monerum-s",
      "CAMPANHA 001 - Consciência do problema e apresentando Monerum-S",
      "proposta-sindicato-digital",
      "ativa",
      100,
    );
    const useCase = new ObterStatusCampanhaUseCase({
      obterPorCodigo: jest.fn(async () => campanha),
      obterResumo: jest.fn(async () => ({
        totalEnviados: 250,
        enviadosHoje: 37,
        vagasRestantesHoje: 63,
        totalFalhas: 3,
      })),
    } as never);

    const result = await useCase.execute("CAMPANHA_001");

    expect(result.campanha.codigo).toBe("CAMPANHA_001");
    expect(result.resumo.enviadosHoje).toBe(37);
    expect(result.resumo.vagasRestantesHoje).toBe(63);
  });
});
