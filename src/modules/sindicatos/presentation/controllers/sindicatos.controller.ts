import { Controller, Get, Query } from "@nestjs/common";

import { ListarSindicatosQueryDto } from "../../application/dto/listar-sindicatos-query.dto";
import { ListarSindicatosResponseDto } from "../../application/dto/sindicato-resumo-response.dto";
import { ListarSindicatosUseCase } from "../../application/usecases/listar-sindicatos.usecase";

@Controller("sindicatos")
export class SindicatosController {
  constructor(
    private readonly listarSindicatosUseCase: ListarSindicatosUseCase,
  ) {}

  @Get()
  listar(
    @Query() query: ListarSindicatosQueryDto,
  ): Promise<ListarSindicatosResponseDto> {
    return this.listarSindicatosUseCase.execute(query);
  }
}
