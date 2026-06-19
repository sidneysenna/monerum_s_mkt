import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { ListarDestinatariosCampanhaQueryDto } from "../dto/listar-destinatarios-campanha-query.dto";
import {
  CAMPANHA_EMAIL_DESTINATARIOS_REPOSITORY,
  CampanhaEmailDestinatariosRepository,
} from "../../domain/repositories/campanha-email-destinatarios.repository";
import {
  CAMPANHAS_EMAIL_REPOSITORY,
  CampanhasEmailRepository,
} from "../../domain/repositories/campanhas-email.repository";

export interface DestinatarioCampanhaResponse {
  sindicatoId: number;
  emailMascarado: string;
  status: string;
  tentativas: number;
  enviadoEm: Date | null;
}

@Injectable()
export class ListarDestinatariosCampanhaUseCase {
  constructor(
    @Inject(CAMPANHAS_EMAIL_REPOSITORY)
    private readonly campanhasRepository: CampanhasEmailRepository,
    @Inject(CAMPANHA_EMAIL_DESTINATARIOS_REPOSITORY)
    private readonly destinatariosRepository: CampanhaEmailDestinatariosRepository,
  ) {}

  async execute(
    codigo: string,
    query: ListarDestinatariosCampanhaQueryDto,
  ): Promise<{ campanha: string; destinatarios: DestinatarioCampanhaResponse[] }> {
    const campanha = await this.campanhasRepository.obterPorCodigo(codigo);

    if (!campanha) {
      throw new NotFoundException(`Campanha nao encontrada: ${codigo}.`);
    }

    const destinatarios = await this.destinatariosRepository.listar({
      campanhaId: campanha.id,
      status: query.status,
      limit: query.limit ?? 100,
      offset: query.offset ?? 0,
    });

    return {
      campanha: campanha.codigo,
      destinatarios: destinatarios.map((destinatario) => ({
        sindicatoId: destinatario.sindicatoId,
        emailMascarado: this.maskEmail(destinatario.email),
        status: destinatario.status,
        tentativas: destinatario.tentativas,
        enviadoEm: destinatario.enviadoEm,
      })),
    };
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    const prefix = local.slice(0, 3).padEnd(Math.min(local.length, 3), "*");
    return `${prefix}***@${domain}`;
  }
}
