import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { CampanhaStatusResponseDto } from "../dto/campanha-status-response.dto";
import {
  CAMPANHAS_EMAIL_REPOSITORY,
  CampanhasEmailRepository,
} from "../../domain/repositories/campanhas-email.repository";

@Injectable()
export class ObterStatusCampanhaUseCase {
  constructor(
    @Inject(CAMPANHAS_EMAIL_REPOSITORY)
    private readonly campanhasRepository: CampanhasEmailRepository,
  ) {}

  async execute(codigo: string): Promise<CampanhaStatusResponseDto> {
    const campanha =
      codigo === "CAMPANHA_001"
        ? await this.campanhasRepository.garantirCampanhaInicial()
        : await this.campanhasRepository.obterPorCodigo(codigo);

    if (!campanha) {
      throw new NotFoundException(`Campanha nao encontrada: ${codigo}.`);
    }

    const resumo = await this.campanhasRepository.obterResumo(campanha);

    return {
      campanha: {
        codigo: campanha.codigo,
        nome: campanha.nome,
        status: campanha.status,
        limiteDiario: campanha.limiteDiario,
      },
      resumo,
    };
  }
}
