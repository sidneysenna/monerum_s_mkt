import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../../../shared/infrastructure/prisma/prisma.service";
import { SindicatoEntity } from "../../../sindicatos/domain/entities/sindicato.entity";
import { CampanhaEmailEntity } from "../../domain/entities/campanha-email.entity";
import {
  CampanhasEmailRepository,
  ListarElegiveisCampanhaParams,
  ResumoCampanhaEmail,
} from "../../domain/repositories/campanhas-email.repository";

const CAMPANHA_INICIAL = {
  codigo: "CAMPANHA_001",
  nome: "CAMPANHA 001 - Consciência do problema e apresentando Monerum-S",
  slug: "consciencia-problema-apresentando-monerum-s",
  templateId: "proposta-sindicato-digital",
  status: "ativa",
  limiteDiario: Number(process.env.EMAIL_DAILY_LIMIT) || 1000,
} as const;

interface SindicatoElegivelRow {
  id: number;
  cnpj: string | null;
  denominacao: string | null;
  grau: string | null;
  ufSede: string | null;
  localidadeSede: string | null;
  email: string;
  nomePresidente: string | null;
  grupo: string | null;
}

@Injectable()
export class PrismaCampanhasEmailRepository
  implements CampanhasEmailRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async obterPorCodigo(codigo: string): Promise<CampanhaEmailEntity | null> {
    const campanha = await this.prisma.campanhaEmail.findUnique({
      where: { codigo },
    });

    return campanha ? this.toEntity(campanha) : null;
  }

  async garantirCampanhaInicial(): Promise<CampanhaEmailEntity> {
    const campanha = await this.prisma.campanhaEmail.upsert({
      where: { codigo: CAMPANHA_INICIAL.codigo },
      create: CAMPANHA_INICIAL,
      update: {
        nome: CAMPANHA_INICIAL.nome,
        slug: CAMPANHA_INICIAL.slug,
        templateId: CAMPANHA_INICIAL.templateId,
        status: CAMPANHA_INICIAL.status,
        limiteDiario: CAMPANHA_INICIAL.limiteDiario,
      },
    });

    return this.toEntity(campanha);
  }

  async obterResumo(campanha: CampanhaEmailEntity): Promise<ResumoCampanhaEmail> {
    const [inicioHoje, fimHoje] = this.getTodayRange();
    const [totalEnviados, enviadosHoje, totalFalhas] = await Promise.all([
      this.prisma.campanhaEmailDestinatario.count({
        where: { campanhaId: campanha.id, status: "enviado" },
      }),
      this.prisma.campanhaEmailDestinatario.count({
        where: {
          campanhaId: campanha.id,
          status: "enviado",
          enviadoEm: {
            gte: inicioHoje,
            lt: fimHoje,
          },
        },
      }),
      this.prisma.campanhaEmailDestinatario.count({
        where: { campanhaId: campanha.id, status: "falhou" },
      }),
    ]);

    return {
      totalEnviados,
      enviadosHoje,
      vagasRestantesHoje: Math.max(campanha.limiteDiario - enviadosHoje, 0),
      totalFalhas,
    };
  }

  async listarElegiveis(
    params: ListarElegiveisCampanhaParams,
  ): Promise<SindicatoEntity[]> {
    const rows = await this.prisma.$queryRaw<SindicatoElegivelRow[]>(
      Prisma.sql`
        SELECT
          s.id,
          s.cnpj,
          s.denominacao,
          s.grau,
          s.uf_sede AS "ufSede",
          s.localidade_sede AS "localidadeSede",
          s.email,
          s.nome_presidente AS "nomePresidente",
          s.grupo
        FROM sindicatos_br.sindicatos s
        WHERE s.grupo = 'Trabalhador'
          AND s.email IS NOT NULL
          AND btrim(s.email) <> ''
          AND s.email LIKE '%@%'
          ${params.uf ? Prisma.sql`AND s.uf_sede = ${params.uf}` : Prisma.empty}
          ${params.grau ? Prisma.sql`AND s.grau = ${params.grau}` : Prisma.empty}
          ${params.cadastro ? Prisma.sql`AND s.cadastro = ${params.cadastro}` : Prisma.empty}
          ${
            params.areaGeoeconomica
              ? Prisma.sql`AND s.area_geoeconomica = ${params.areaGeoeconomica}`
              : Prisma.empty
          }
          AND NOT EXISTS (
            SELECT 1
            FROM sindicatos_br.campanha_email_destinatarios ced
            JOIN sindicatos_br.campanhas_email ce ON ce.id = ced.campanha_id
            WHERE ce.codigo = ${params.campanhaCodigo}
              AND ced.sindicato_id = s.id
              AND ced.status = 'enviado'
          )
        ORDER BY s.id ASC
        LIMIT ${params.limit}
        OFFSET ${params.offset}
      `,
    );

    return rows.map(
      (sindicato) =>
        new SindicatoEntity(
          sindicato.id,
          sindicato.cnpj,
          sindicato.denominacao,
          sindicato.grau,
          sindicato.ufSede,
          sindicato.localidadeSede,
          sindicato.email,
          sindicato.nomePresidente,
          sindicato.grupo,
        ),
    );
  }

  private getTodayRange(): [Date, Date] {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return [start, end];
  }

  private toEntity(campanha: {
    id: string;
    codigo: string;
    slug: string;
    nome: string;
    descricao: string | null;
    templateId: string;
    status: string;
    limiteDiario: number;
  }): CampanhaEmailEntity {
    return new CampanhaEmailEntity(
      campanha.id,
      campanha.codigo,
      campanha.slug,
      campanha.nome,
      campanha.templateId,
      campanha.status,
      campanha.limiteDiario,
      campanha.descricao,
    );
  }
}
