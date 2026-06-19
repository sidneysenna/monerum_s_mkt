import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { EmailAddress } from "../../../emails/domain/value-objects/email-address.vo";
import { ListarElegiveisCampanhaQueryDto } from "../dto/listar-elegiveis-campanha-query.dto";
import {
  CAMPANHAS_EMAIL_REPOSITORY,
  CampanhasEmailRepository,
} from "../../domain/repositories/campanhas-email.repository";

export interface ElegivelCampanhaResponse {
  id: number;
  denominacao: string | null;
  nomePresidente: string | null;
  ufSede: string | null;
  localidadeSede: string | null;
  emailMascarado: string;
  grupo: string | null;
}

@Injectable()
export class ListarElegiveisCampanhaUseCase {
  constructor(
    @Inject(CAMPANHAS_EMAIL_REPOSITORY)
    private readonly campanhasRepository: CampanhasEmailRepository,
  ) {}

  async execute(
    codigo: string,
    query: ListarElegiveisCampanhaQueryDto,
  ): Promise<{
    campanha: string;
    filtroObrigatorio: { grupo: "Trabalhador" };
    elegiveis: ElegivelCampanhaResponse[];
  }> {
    const campanha = await this.campanhasRepository.obterPorCodigo(codigo);

    if (!campanha) {
      throw new NotFoundException(`Campanha nao encontrada: ${codigo}.`);
    }

    const elegiveis = (
      await this.campanhasRepository.listarElegiveis({
        campanhaCodigo: campanha.codigo,
        uf: query.uf,
        grau: query.grau,
        cadastro: query.cadastro,
        areaGeoeconomica: query.areaGeoeconomica,
        limit: query.limit ?? 100,
        offset: query.offset ?? 0,
      })
    ).filter((sindicato) => EmailAddress.isValid(sindicato.email));

    return {
      campanha: campanha.codigo,
      filtroObrigatorio: { grupo: "Trabalhador" },
      elegiveis: elegiveis.map((sindicato) => ({
        id: sindicato.id,
        denominacao: sindicato.denominacao,
        nomePresidente: sindicato.nomePresidente,
        ufSede: sindicato.ufSede,
        localidadeSede: sindicato.localidadeSede,
        emailMascarado: this.maskEmail(sindicato.email),
        grupo: sindicato.grupo,
      })),
    };
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    const prefix = local.slice(0, 3).padEnd(Math.min(local.length, 3), "*");
    return `${prefix}***@${domain}`;
  }
}
