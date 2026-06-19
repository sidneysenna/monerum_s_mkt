import { Controller, Get, Post, Query } from "@nestjs/common";

import { EnviarCampanhaQueryDto } from "../../application/dto/enviar-campanha-query.dto";
import { PreviewCampanhaQueryDto } from "../../application/dto/preview-campanha-query.dto";
import {
  EnviarCampanhaSindicatoDigitalResponse,
  EnviarCampanhaSindicatoDigitalUseCase,
} from "../../application/usecases/enviar-campanha-sindicato-digital.usecase";
import {
  PreviewCampanhaSindicatoDigitalResponse,
  PreviewCampanhaSindicatoDigitalUseCase,
} from "../../application/usecases/preview-campanha-sindicato-digital.usecase";

@Controller("campanhas")
export class CampanhasController {
  constructor(
    private readonly previewCampanhaUseCase: PreviewCampanhaSindicatoDigitalUseCase,
    private readonly enviarCampanhaUseCase: EnviarCampanhaSindicatoDigitalUseCase,
  ) {}

  @Get("proposta-sindicato-digital/preview")
  preview(
    @Query() query: PreviewCampanhaQueryDto,
  ): Promise<PreviewCampanhaSindicatoDigitalResponse> {
    return this.previewCampanhaUseCase.execute(query);
  }

  @Post("proposta-sindicato-digital/enviar")
  enviar(
    @Query() query: EnviarCampanhaQueryDto,
  ): Promise<EnviarCampanhaSindicatoDigitalResponse> {
    return this.enviarCampanhaUseCase.execute(query);
  }
}
