import { PrismaSindicatosRepository } from "./prisma-sindicatos.repository";

describe("PrismaSindicatosRepository", () => {
  it("aplica filtro obrigatorio grupo = 'Trabalhador'", async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const repository = new PrismaSindicatosRepository({
      sindicato: {
        findMany,
      },
    } as never);

    await repository.listarComEmail({ limit: 10, offset: 0 });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            { grupo: "Trabalhador" },
            { email: { not: null } },
            { email: { not: "" } },
          ]),
        }),
        select: expect.objectContaining({
          id: true,
          denominacao: true,
          nomePresidente: true,
          email: true,
          ufSede: true,
          localidadeSede: true,
          grupo: true,
        }),
      }),
    );
  });
});
