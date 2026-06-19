import { Inject, Injectable } from "@nestjs/common";

import { ListarSindicatosQueryDto } from "../dto/listar-sindicatos-query.dto";
import { ListarSindicatosResponseDto } from "../dto/sindicato-resumo-response.dto";
import {
  SINDICATOS_REPOSITORY,
  SindicatosRepository,
} from "../../domain/repositories/sindicatos.repository";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;
const DEFAULT_OFFSET = 0;

@Injectable()
export class ListarSindicatosUseCase {
  constructor(
    @Inject(SINDICATOS_REPOSITORY)
    private readonly sindicatosRepository: SindicatosRepository,
  ) {}

  async execute(
    query: ListarSindicatosQueryDto,
  ): Promise<ListarSindicatosResponseDto> {
    const limit = this.normalizeLimit(query.limit);
    const offset = this.normalizeOffset(query.offset);

    const items = await this.sindicatosRepository.listarComEmail({
      uf: query.uf,
      grau: query.grau,
      cadastro: query.cadastro,
      areaGeoeconomica: query.areaGeoeconomica,
      limit,
      offset,
    });

    return {
      items,
      pagination: {
        limit,
        offset,
        count: items.length,
      },
    };
  }

  private normalizeLimit(limit?: number): number {
    if (limit === undefined || Number.isNaN(limit)) {
      return DEFAULT_LIMIT;
    }

    return Math.min(Math.max(limit, 1), MAX_LIMIT);
  }

  private normalizeOffset(offset?: number): number {
    if (offset === undefined || Number.isNaN(offset)) {
      return DEFAULT_OFFSET;
    }

    return Math.max(offset, DEFAULT_OFFSET);
  }
}
