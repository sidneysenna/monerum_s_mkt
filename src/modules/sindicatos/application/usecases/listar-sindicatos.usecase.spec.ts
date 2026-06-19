import { SindicatoEntity } from "../../domain/entities/sindicato.entity";
import {
  ListarSindicatosParams,
  SindicatosRepository,
} from "../../domain/repositories/sindicatos.repository";
import { ListarSindicatosUseCase } from "./listar-sindicatos.usecase";

class FakeSindicatosRepository implements SindicatosRepository {
  params?: ListarSindicatosParams;

  async listarComEmail(
    params: ListarSindicatosParams,
  ): Promise<SindicatoEntity[]> {
    this.params = params;
    return [];
  }
}

describe("ListarSindicatosUseCase", () => {
  it("aplica paginacao padrao", async () => {
    const repository = new FakeSindicatosRepository();
    const useCase = new ListarSindicatosUseCase(repository);

    const result = await useCase.execute({});

    expect(repository.params?.limit).toBe(20);
    expect(repository.params?.offset).toBe(0);
    expect(result.pagination).toEqual({ limit: 20, offset: 0, count: 0 });
  });

  it("limita limit a no maximo 100", async () => {
    const repository = new FakeSindicatosRepository();
    const useCase = new ListarSindicatosUseCase(repository);

    const result = await useCase.execute({ limit: 150, offset: 5 });

    expect(repository.params?.limit).toBe(100);
    expect(repository.params?.offset).toBe(5);
    expect(result.pagination.limit).toBe(100);
  });
});
