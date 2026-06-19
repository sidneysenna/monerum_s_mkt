import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import {
  ListarSindicatosParams,
  SindicatosRepository,
} from "../../domain/repositories/sindicatos.repository";
import { SindicatoEntity } from "../../domain/entities/sindicato.entity";
import { SindicatoMapper } from "../mappers/sindicato.mapper";
import { PrismaService } from "../../../../shared/infrastructure/prisma/prisma.service";

@Injectable()
export class PrismaSindicatosRepository implements SindicatosRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarComEmail(
    params: ListarSindicatosParams,
  ): Promise<SindicatoEntity[]> {
    const where: Prisma.SindicatoWhereInput = {
      AND: [
        { grupo: "Trabalhador" },
        { email: { not: null } },
        { email: { not: "" } },
        { email: { contains: "@" } },
      ],
      ufSede: params.uf,
      grau: params.grau,
      cadastro: params.cadastro,
      areaGeoeconomica: params.areaGeoeconomica,
    };

    const sindicatos = await this.prisma.sindicato.findMany({
      where,
      orderBy: {
        id: "asc",
      },
      take: params.limit,
      skip: params.offset,
      select: {
        id: true,
        cnpj: true,
        denominacao: true,
        grau: true,
        ufSede: true,
        localidadeSede: true,
        email: true,
        nomePresidente: true,
        grupo: true,
      },
    });

    return sindicatos.map(SindicatoMapper.toEntity);
  }
}
