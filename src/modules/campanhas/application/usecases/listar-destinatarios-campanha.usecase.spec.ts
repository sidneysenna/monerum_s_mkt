import { CampanhaEmailDestinatarioEntity } from "../../domain/entities/campanha-email-destinatario.entity";
import { CampanhaEmailEntity } from "../../domain/entities/campanha-email.entity";
import { ListarDestinatariosCampanhaUseCase } from "./listar-destinatarios-campanha.usecase";

describe("ListarDestinatariosCampanhaUseCase", () => {
  it("retorna email mascarado por padrao", async () => {
    const campanha = new CampanhaEmailEntity(
      "campanha-id",
      "CAMPANHA_001",
      "consciencia-problema-apresentando-monerum-s",
      "Campanha",
      "proposta-sindicato-digital",
      "ativa",
      100,
    );
    const useCase = new ListarDestinatariosCampanhaUseCase(
      { obterPorCodigo: jest.fn(async () => campanha) } as never,
      {
        listar: jest.fn(async () => [
          new CampanhaEmailDestinatarioEntity(
            "dest-id",
            "campanha-id",
            123,
            "contato@example.com",
            "contato@example.com",
            "enviado",
            1,
            new Date("2026-06-19T10:00:00.000Z"),
          ),
        ]),
      } as never,
    );

    const result = await useCase.execute("CAMPANHA_001", {});

    expect(result.destinatarios[0].emailMascarado).toBe("con***@example.com");
    expect(JSON.stringify(result)).not.toContain("contato@example.com");
  });
});
