import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../../../shared/infrastructure/prisma/prisma.service";
import { CampanhaEmailDestinatarioEntity } from "../../domain/entities/campanha-email-destinatario.entity";
import {
  CampanhaEmailDestinatariosRepository,
  ListarDestinatariosCampanhaParams,
  RegistrarEnvioCampanhaParams,
} from "../../domain/repositories/campanha-email-destinatarios.repository";

@Injectable()
export class PrismaCampanhaEmailDestinatariosRepository
  implements CampanhaEmailDestinatariosRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async listar(
    params: ListarDestinatariosCampanhaParams,
  ): Promise<CampanhaEmailDestinatarioEntity[]> {
    const destinatarios =
      await this.prisma.campanhaEmailDestinatario.findMany({
        where: {
          campanhaId: params.campanhaId,
          status: params.status,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: params.limit,
        skip: params.offset,
      });

    return destinatarios.map(this.toEntity);
  }

  async registrarResultado(
    params: RegistrarEnvioCampanhaParams,
  ): Promise<CampanhaEmailDestinatarioEntity | null> {
    try {
      const destinatario =
        await this.prisma.campanhaEmailDestinatario.create({
          data: {
            campanhaId: params.campanhaId,
            sindicatoId: params.sindicatoId,
            email: params.email,
            emailNormalizado: params.email.trim().toLowerCase(),
            status: params.status,
            tentativas: 1,
            ultimoErro: params.erro,
            mailgunMessageId: params.mailgunMessageId,
            enviadoEm: params.status === "enviado" ? new Date() : null,
          },
        });

      return this.toEntity(destinatario);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return null;
      }

      throw error;
    }
  }

  private toEntity(destinatario: {
    id: string;
    campanhaId: string;
    sindicatoId: number;
    email: string;
    emailNormalizado: string;
    status: string;
    tentativas: number;
    ultimoErro: string | null;
    mailgunMessageId: string | null;
    enviadoEm: Date | null;
  }): CampanhaEmailDestinatarioEntity {
    return new CampanhaEmailDestinatarioEntity(
      destinatario.id,
      destinatario.campanhaId,
      destinatario.sindicatoId,
      destinatario.email,
      destinatario.emailNormalizado,
      destinatario.status,
      destinatario.tentativas,
      destinatario.enviadoEm,
      destinatario.ultimoErro,
      destinatario.mailgunMessageId,
    );
  }
}
