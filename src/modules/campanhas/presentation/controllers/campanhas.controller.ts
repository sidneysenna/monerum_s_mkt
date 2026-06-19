import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { EnviarCampanhaQueryDto } from "../../application/dto/enviar-campanha-query.dto";
import { ListarDestinatariosCampanhaQueryDto } from "../../application/dto/listar-destinatarios-campanha-query.dto";
import { ListarElegiveisCampanhaQueryDto } from "../../application/dto/listar-elegiveis-campanha-query.dto";
import { PreviewCampanhaQueryDto } from "../../application/dto/preview-campanha-query.dto";
import {
  EnviarCampanhaSindicatoDigitalResponse,
  EnviarCampanhaSindicatoDigitalUseCase,
} from "../../application/usecases/enviar-campanha-sindicato-digital.usecase";
import {
  DestinatarioCampanhaResponse,
  ListarDestinatariosCampanhaUseCase,
} from "../../application/usecases/listar-destinatarios-campanha.usecase";
import {
  ElegivelCampanhaResponse,
  ListarElegiveisCampanhaUseCase,
} from "../../application/usecases/listar-elegiveis-campanha.usecase";
import { ObterStatusCampanhaUseCase } from "../../application/usecases/obter-status-campanha.usecase";
import {
  PreviewCampanhaSindicatoDigitalResponse,
  PreviewCampanhaSindicatoDigitalUseCase,
} from "../../application/usecases/preview-campanha-sindicato-digital.usecase";
import { CampanhaStatusResponseDto } from "../../application/dto/campanha-status-response.dto";

@Controller("campanhas")
export class CampanhasController {
  constructor(
    private readonly previewCampanhaUseCase: PreviewCampanhaSindicatoDigitalUseCase,
    private readonly enviarCampanhaUseCase: EnviarCampanhaSindicatoDigitalUseCase,
    private readonly obterStatusCampanhaUseCase: ObterStatusCampanhaUseCase,
    private readonly listarDestinatariosCampanhaUseCase: ListarDestinatariosCampanhaUseCase,
    private readonly listarElegiveisCampanhaUseCase: ListarElegiveisCampanhaUseCase,
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

  @Post(":codigo/enviar")
  enviarPorCodigo(
    @Param("codigo") codigo: string,
    @Query() query: EnviarCampanhaQueryDto,
  ): Promise<EnviarCampanhaSindicatoDigitalResponse> {
    if (codigo !== "CAMPANHA_001") {
      throw new NotFoundException(`Campanha nao encontrada: ${codigo}.`);
    }

    return this.enviarCampanhaUseCase.execute(query);
  }

  @Get(":codigo/status")
  status(
    @Param("codigo") codigo: string,
  ): Promise<CampanhaStatusResponseDto> {
    return this.obterStatusCampanhaUseCase.execute(codigo);
  }

  @Get(":codigo/destinatarios")
  destinatarios(
    @Param("codigo") codigo: string,
    @Query() query: ListarDestinatariosCampanhaQueryDto,
  ): Promise<{ campanha: string; destinatarios: DestinatarioCampanhaResponse[] }> {
    return this.listarDestinatariosCampanhaUseCase.execute(codigo, query);
  }

  @Get(":codigo/elegiveis")
  elegiveis(
    @Param("codigo") codigo: string,
    @Query() query: ListarElegiveisCampanhaQueryDto,
  ): Promise<{
    campanha: string;
    filtroObrigatorio: { grupo: "Trabalhador" };
    elegiveis: ElegivelCampanhaResponse[];
  }> {
    return this.listarElegiveisCampanhaUseCase.execute(codigo, query);
  }
}
