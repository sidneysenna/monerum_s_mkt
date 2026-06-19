import { Inject, Injectable } from "@nestjs/common";

import { EmailAddress } from "../../../emails/domain/value-objects/email-address.vo";
import { EnviarEmailService } from "../../../emails/application/services/enviar-email.service";
import { TemplateRendererService } from "../../../emails/infrastructure/templates/template-renderer.service";
import { EnviarCampanhaQueryDto } from "../dto/enviar-campanha-query.dto";
import {
  SINDICATOS_REPOSITORY,
  SindicatosRepository,
} from "../../../sindicatos/domain/repositories/sindicatos.repository";
import { SindicatoEntity } from "../../../sindicatos/domain/entities/sindicato.entity";

const CAMPANHA_ID = "proposta-sindicato-digital";
const DEFAULT_LIMIT = 1;
const MAX_LIMIT = 10;
const REQUIRED_GROUP = "Trabalhador";
const REQUIRED_PLACEHOLDERS = [
  "NOME_SINDICATO",
  "NOME_PRESIDENTE",
  "VALOR_MENSALIDADE",
  "VALOR_TAXA",
  "CONTATO_WHATSAPP",
  "VENDEDOR_NOME",
  "VENDEDOR_CONTATO",
];
const FIXED_PLACEHOLDERS = {
  VALOR_MENSALIDADE: "200,00",
  VALOR_TAXA: "10",
  CONTATO_WHATSAPP: "5531984791973",
  VENDEDOR_NOME: "SIDNEY SENNA",
  VENDEDOR_CONTATO: "sidney.senna@supremaalgoritmos.com.br",
} as const;

interface DestinatarioDryRun {
  id: number;
  denominacao: string | null;
  ufSede: string | null;
  emailMascarado: string;
}

interface ResultadoEnvio {
  id: number;
  emailMascarado: string;
  status: "enviado" | "falha";
  erro?: string;
}

export type EnviarCampanhaSindicatoDigitalResponse =
  | {
      campanha: typeof CAMPANHA_ID;
      dryRun: true;
      envioRealExecutado: false;
      filtroObrigatorio: { grupo: typeof REQUIRED_GROUP };
      destinatariosEncontrados: number;
      destinatarios: DestinatarioDryRun[];
    }
  | {
      campanha: typeof CAMPANHA_ID;
      dryRun: false;
      envioRealExecutado: true;
      filtroObrigatorio: { grupo: typeof REQUIRED_GROUP };
      totalSelecionados: number;
      totalEnviados: number;
      totalFalhas: number;
      resultados: ResultadoEnvio[];
    };

@Injectable()
export class EnviarCampanhaSindicatoDigitalUseCase {
  constructor(
    @Inject(SINDICATOS_REPOSITORY)
    private readonly sindicatosRepository: SindicatosRepository,
    private readonly templateRenderer: TemplateRendererService,
    private readonly enviarEmailService: EnviarEmailService,
  ) {}

  async execute(
    query: EnviarCampanhaQueryDto,
  ): Promise<EnviarCampanhaSindicatoDigitalResponse> {
    const limit = this.normalizeLimit(query.limit);
    const dryRun = query.dryRun ?? true;
    const destinatarios = (
      await this.sindicatosRepository.listarComEmail({
        uf: query.uf,
        grau: query.grau,
        cadastro: query.cadastro,
        areaGeoeconomica: query.areaGeoeconomica,
        limit,
        offset: 0,
      })
    ).filter((destinatario) => EmailAddress.isValid(destinatario.email));

    const canSendReal = this.canSendReal(dryRun, query.confirmacao);

    if (!canSendReal) {
      return {
        campanha: CAMPANHA_ID,
        dryRun: true,
        envioRealExecutado: false,
        filtroObrigatorio: { grupo: REQUIRED_GROUP },
        destinatariosEncontrados: destinatarios.length,
        destinatarios: destinatarios.map((destinatario) =>
          this.toDryRunDestinatario(destinatario),
        ),
      };
    }

    const from = this.getFrom();
    const resultados: ResultadoEnvio[] = [];

    for (const destinatario of destinatarios) {
      try {
        const template = await this.templateRenderer.render(
          CAMPANHA_ID,
          this.buildPlaceholders(destinatario),
        );
        this.templateRenderer.validateNoUnresolvedPlaceholders(
          template,
          REQUIRED_PLACEHOLDERS,
        );

        await this.enviarEmailService.enviar({
          from,
          to: {
            email: destinatario.email,
            nome: destinatario.denominacao,
          },
          subject: template.subject,
          text: template.text,
          html: template.html,
        });

        resultados.push({
          id: destinatario.id,
          emailMascarado: this.maskEmail(destinatario.email),
          status: "enviado",
        });
      } catch (error) {
        resultados.push({
          id: destinatario.id,
          emailMascarado: this.maskEmail(destinatario.email),
          status: "falha",
          erro: this.sanitizeError(error),
        });
      }
    }

    return {
      campanha: CAMPANHA_ID,
      dryRun: false,
      envioRealExecutado: true,
      filtroObrigatorio: { grupo: REQUIRED_GROUP },
      totalSelecionados: destinatarios.length,
      totalEnviados: resultados.filter(
        (resultado) => resultado.status === "enviado",
      ).length,
      totalFalhas: resultados.filter(
        (resultado) => resultado.status === "falha",
      ).length,
      resultados,
    };
  }

  private normalizeLimit(limit?: number): number {
    if (limit === undefined || Number.isNaN(limit)) {
      return DEFAULT_LIMIT;
    }

    return Math.min(Math.max(limit, 1), MAX_LIMIT);
  }

  private canSendReal(dryRun: boolean, confirmacao?: string): boolean {
    return (
      process.env.EMAIL_SENDING_ENABLED === "true" &&
      process.env.EMAIL_DRY_RUN === "false" &&
      dryRun === false &&
      confirmacao === "ENVIAR"
    );
  }

  private getFrom(): string {
    const fromEmail = process.env.MAILGUN_FROM_EMAIL;
    const fromName = process.env.MAILGUN_FROM_NAME ?? "Monerum";

    if (!fromEmail) {
      throw new Error("Remetente Mailgun nao configurado.");
    }

    return `${fromName} <${fromEmail}>`;
  }

  private toDryRunDestinatario(
    destinatario: SindicatoEntity,
  ): DestinatarioDryRun {
    return {
      id: destinatario.id,
      denominacao: destinatario.denominacao,
      ufSede: destinatario.ufSede,
      emailMascarado: this.maskEmail(destinatario.email),
    };
  }

  private buildPlaceholders(
    destinatario: SindicatoEntity,
  ): Record<string, string> {
    return {
      NOME_SINDICATO: this.withDefault(
        destinatario.denominacao,
        "seu sindicato",
      ),
      NOME_PRESIDENTE: this.withDefault(
        destinatario.nomePresidente,
        "Presidente",
      ),
      ...FIXED_PLACEHOLDERS,
    };
  }

  private withDefault(
    value: string | null | undefined,
    fallback: string,
  ): string {
    return value?.trim() ? value.trim() : fallback;
  }

  private sanitizeError(error: unknown): string {
    if (!(error instanceof Error)) {
      return "Erro desconhecido.";
    }

    if (error.message.includes("placeholders obrigatorios")) {
      return error.message;
    }

    return "Falha ao processar destinatario.";
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    const prefix = local.slice(0, 3).padEnd(Math.min(local.length, 3), "*");
    return `${prefix}***@${domain}`;
  }
}
