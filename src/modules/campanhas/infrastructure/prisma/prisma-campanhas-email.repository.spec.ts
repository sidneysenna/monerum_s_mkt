import { PrismaCampanhasEmailRepository } from "./prisma-campanhas-email.repository";

describe("PrismaCampanhasEmailRepository", () => {
  it("lista elegiveis aplicando grupo Trabalhador e excluindo enviados da campanha", async () => {
    const queryRaw = jest.fn().mockResolvedValue([]);
    const repository = new PrismaCampanhasEmailRepository({
      $queryRaw: queryRaw,
    } as never);

    await repository.listarElegiveis({
      campanhaCodigo: "CAMPANHA_001",
      uf: "MG",
      limit: 100,
      offset: 0,
    });

    const sql = queryRaw.mock.calls[0][0].strings.join(" ");

    expect(sql).toContain("s.grupo = 'Trabalhador'");
    expect(sql).toContain("FROM sindicatos_br.sindicatos s");
    expect(sql).not.toContain("public.");
    expect(sql).toContain("NOT EXISTS");
    expect(sql).toContain("ced.status = 'enviado'");
    expect(sql).toContain("ce.codigo =");
  });

  it("sindicato enviado para outra campanha nao e excluido da CAMPANHA_001", async () => {
    const queryRaw = jest.fn().mockResolvedValue([
      {
        id: 1,
        cnpj: null,
        denominacao: "Sindicato A",
        grau: null,
        ufSede: "MG",
        localidadeSede: "Belo Horizonte",
        email: "a@example.com",
        nomePresidente: "Maria",
        grupo: "Trabalhador",
      },
    ]);
    const repository = new PrismaCampanhasEmailRepository({
      $queryRaw: queryRaw,
    } as never);

    const result = await repository.listarElegiveis({
      campanhaCodigo: "CAMPANHA_001",
      limit: 100,
      offset: 0,
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(queryRaw.mock.calls[0][0].values).toContain("CAMPANHA_001");
  });
});
