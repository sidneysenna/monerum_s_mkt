import { Inject, Injectable } from "@nestjs/common";

import { EmailRetryService } from "../../../emails/application/services/email-retry.service";
import { EnviarEmailService } from "../../../emails/application/services/enviar-email.service";
import { EmailAddress } from "../../../emails/domain/value-objects/email-address.vo";
import { TemplateRendererService } from "../../../emails/infrastructure/templates/template-renderer.service";
import { SindicatoEntity } from "../../../sindicatos/domain/entities/sindicato.entity";
import {
  CAMPANHA_EMAIL_DESTINATARIOS_REPOSITORY,
  CampanhaEmailDestinatariosRepository,
} from "../../domain/repositories/campanha-email-destinatarios.repository";
import {
  CAMPANHAS_EMAIL_REPOSITORY,
  CampanhasEmailRepository,
} from "../../domain/repositories/campanhas-email.repository";
import { EnviarCampanhaQueryDto } from "../dto/enviar-campanha-query.dto";

const CAMPANHA_CODIGO = "CAMPANHA_001";
const TEMPLATE_ID = "proposta-sindicato-digital";
const DEFAULT_LIMIT = 1;
const DEFAULT_MAX_REQUEST_LIMIT = 1000;
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_BATCH_INTERVAL_MS = 60000;
const DEFAULT_SEND_INTERVAL_MS = 7000;
const RESULTS_PREVIEW_LIMIT = 20;
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
  VALOR_MENSALIDADE: "500,00",
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
  status: "enviado" | "falha" | "ja_enviado";
  erro?: string;
}

interface CampanhaEnvioMeta {
  campanha: {
    codigo: typeof CAMPANHA_CODIGO;
    nome: string;
    limiteDiario: number;
  };
  template: typeof TEMPLATE_ID;
  filtroObrigatorio: { grupo: typeof REQUIRED_GROUP };
  limiteSolicitado: number;
  limiteEfetivo: number;
  enviadosHojeAntes: number;
  vagasRestantesAntes: number;
  throttle: {
    batchSize: number;
    batchIntervalMs: number;
    sendIntervalMs: number;
    retryMaxAttempts: number;
  };
}

export type EnviarCampanhaSindicatoDigitalResponse =
  | (CampanhaEnvioMeta & {
      dryRun: true;
      envioRealExecutado: false;
      placeholders: typeof FIXED_PLACEHOLDERS;
      destinatariosElegiveis: number;
      destinatariosPreview: DestinatarioDryRun[];
      observacao: string;
      motivo?: "limite_diario_atingido";
    })
  | (CampanhaEnvioMeta & {
      dryRun: false;
      envioRealExecutado: true;
      totalSelecionados: number;
      totalEnviados: number;
      totalFalhas: number;
      totalRateLimit: number;
      resultadosPreview: ResultadoEnvio[];
      resultados: ResultadoEnvio[];
    });

@Injectable()
export class EnviarCampanhaSindicatoDigitalUseCase {
  constructor(
    @Inject(CAMPANHAS_EMAIL_REPOSITORY)
    private readonly campanhasRepository: CampanhasEmailRepository,
    @Inject(CAMPANHA_EMAIL_DESTINATARIOS_REPOSITORY)
    private readonly destinatariosRepository: CampanhaEmailDestinatariosRepository,
    private readonly templateRenderer: TemplateRendererService,
    private readonly enviarEmailService: EnviarEmailService,
    private readonly emailRetryService: EmailRetryService,
  ) {}

  async execute(
    query: EnviarCampanhaQueryDto,
  ): Promise<EnviarCampanhaSindicatoDigitalResponse> {
    const campanha = await this.campanhasRepository.garantirCampanhaInicial();
    const resumo = await this.campanhasRepository.obterResumo(campanha);
    const vagasRestantes = resumo.vagasRestantesHoje;
    const limiteSolicitado = this.normalizeRequestedLimit(query.limit);
    const limit = this.normalizeEffectiveLimit(
      limiteSolicitado,
      vagasRestantes,
    );
    const throttle = this.getThrottleConfig();

    if (vagasRestantes <= 0) {
      return {
        ...this.buildMeta(
          campanha.nome,
          campanha.limiteDiario,
          limiteSolicitado,
          0,
          resumo.enviadosHoje,
          0,
          throttle,
        ),
        dryRun: true,
        envioRealExecutado: false,
        placeholders: FIXED_PLACEHOLDERS,
        destinatariosElegiveis: 0,
        destinatariosPreview: [],
        observacao: "Dry-run nao chama Mailgun e nao grava envio.",
        motivo: "limite_diario_atingido",
      };
    }

    const dryRun = query.dryRun ?? true;
    const destinatarios = (
      await this.campanhasRepository.listarElegiveis({
        campanhaCodigo: campanha.codigo,
        uf: query.uf,
        grau: query.grau,
        cadastro: query.cadastro,
        areaGeoeconomica: query.areaGeoeconomica,
        limit,
        offset: 0,
      })
    ).filter((destinatario) => EmailAddress.isValid(destinatario.email));

    const canSendReal = this.canSendReal(
      dryRun,
      query.confirmacao,
      campanha.status,
    );

    if (!canSendReal) {
      return {
        ...this.buildMeta(
          campanha.nome,
          campanha.limiteDiario,
          limiteSolicitado,
          limit,
          resumo.enviadosHoje,
          vagasRestantes,
          throttle,
        ),
        dryRun: true,
        envioRealExecutado: false,
        placeholders: FIXED_PLACEHOLDERS,
        destinatariosElegiveis: destinatarios.length,
        destinatariosPreview: destinatarios
          .slice(0, RESULTS_PREVIEW_LIMIT)
          .map((destinatario) => this.toDryRunDestinatario(destinatario)),
        observacao: "Dry-run nao chama Mailgun e nao grava envio.",
      };
    }

    const from = this.getFrom();
    const resultados: ResultadoEnvio[] = [];
    const batches = this.chunk(destinatarios, throttle.batchSize);
    let shouldStop = false;

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
      const batch = batches[batchIndex];

      for (let index = 0; index < batch.length; index += 1) {
        const destinatario = batch[index];

        try {
          const template = await this.templateRenderer.render(
            TEMPLATE_ID,
            this.buildPlaceholders(destinatario),
          );
          this.templateRenderer.validateNoUnresolvedPlaceholders(
            template,
            REQUIRED_PLACEHOLDERS,
          );

          const retryResult = await this.emailRetryService.execute(() =>
            this.enviarEmailService.enviar({
              from,
              to: {
                email: destinatario.email,
                nome: destinatario.denominacao,
              },
              subject: template.subject,
              text: template.text,
              html: template.html,
            }),
          );

          if (!retryResult.ok) {
            await this.registrarFalha(
              campanha.id,
              destinatario,
              retryResult.sanitizedError,
              resultados,
            );
            shouldStop = retryResult.rateLimit && throttle.stopOnRateLimit;
          } else {
            const registro =
              await this.destinatariosRepository.registrarResultado({
                campanhaId: campanha.id,
                sindicatoId: destinatario.id,
                email: destinatario.email,
                status: "enviado",
                mailgunMessageId: retryResult.value.providerMessageId,
              });

            resultados.push({
              id: destinatario.id,
              emailMascarado: this.maskEmail(destinatario.email),
              status: registro ? "enviado" : "ja_enviado",
              erro: registro ? undefined : "Destinatario ja enviado.",
            });
          }
        } catch (error) {
          await this.registrarFalha(
            campanha.id,
            destinatario,
            this.sanitizeError(error),
            resultados,
          );
        }

        if (shouldStop) {
          break;
        }

        const hasNextInBatch = index < batch.length - 1;
        const hasNextBatch = batchIndex < batches.length - 1;
        if (hasNextInBatch || hasNextBatch) {
          await this.sleep(throttle.sendIntervalMs);
        }
      }

      if (shouldStop) {
        break;
      }

      if (batchIndex < batches.length - 1) {
        await this.sleep(throttle.batchIntervalMs);
      }
    }

    const includeResults = query.includeResults === true;
    const totalRateLimit = resultados.filter(
      (resultado) => resultado.erro === "rate_limit_429",
    ).length;

    return {
      ...this.buildMeta(
        campanha.nome,
        campanha.limiteDiario,
        limiteSolicitado,
        limit,
        resumo.enviadosHoje,
        vagasRestantes,
        throttle,
      ),
      dryRun: false,
      envioRealExecutado: true,
      totalSelecionados: destinatarios.length,
      totalEnviados: resultados.filter(
        (resultado) => resultado.status === "enviado",
      ).length,
      totalFalhas: resultados.filter(
        (resultado) => resultado.status === "falha",
      ).length,
      totalRateLimit,
      resultadosPreview: resultados.slice(0, RESULTS_PREVIEW_LIMIT),
      resultados: includeResults ? resultados : [],
    };
  }

  private buildMeta(
    nome: string,
    limiteDiario: number,
    limiteSolicitado: number,
    limiteEfetivo: number,
    enviadosHoje: number,
    vagasRestantesAntes: number,
    throttle: ReturnType<
      EnviarCampanhaSindicatoDigitalUseCase["getThrottleConfig"]
    >,
  ): CampanhaEnvioMeta {
    return {
      campanha: {
        codigo: CAMPANHA_CODIGO,
        nome,
        limiteDiario,
      },
      template: TEMPLATE_ID,
      filtroObrigatorio: { grupo: REQUIRED_GROUP },
      limiteSolicitado,
      limiteEfetivo,
      enviadosHojeAntes: enviadosHoje,
      vagasRestantesAntes,
      throttle: {
        batchSize: throttle.batchSize,
        batchIntervalMs: throttle.batchIntervalMs,
        sendIntervalMs: throttle.sendIntervalMs,
        retryMaxAttempts: throttle.retryMaxAttempts,
      },
    };
  }

  private normalizeRequestedLimit(limit?: number): number {
    if (limit === undefined || Number.isNaN(limit)) {
      return DEFAULT_LIMIT;
    }

    return Math.max(Math.floor(limit), 1);
  }

  private normalizeEffectiveLimit(
    requestedLimit: number,
    vagasRestantes: number,
  ): number {
    return Math.min(
      requestedLimit,
      vagasRestantes,
      this.readInt("EMAIL_MAX_REQUEST_LIMIT", DEFAULT_MAX_REQUEST_LIMIT),
    );
  }

  private canSendReal(
    dryRun: boolean,
    confirmacao: string | undefined,
    campanhaStatus: string,
  ): boolean {
    return (
      process.env.EMAIL_SENDING_ENABLED === "true" &&
      process.env.EMAIL_DRY_RUN === "false" &&
      dryRun === false &&
      confirmacao === "ENVIAR" &&
      campanhaStatus === "ativa"
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

  private async registrarFalha(
    campanhaId: string,
    destinatario: SindicatoEntity,
    erro: string,
    resultados: ResultadoEnvio[],
  ): Promise<void> {
    await this.destinatariosRepository.registrarResultado({
      campanhaId,
      sindicatoId: destinatario.id,
      email: destinatario.email,
      status: "falhou",
      erro,
    });

    resultados.push({
      id: destinatario.id,
      emailMascarado: this.maskEmail(destinatario.email),
      status: "falha",
      erro,
    });
  }

  private getThrottleConfig(): {
    batchSize: number;
    batchIntervalMs: number;
    sendIntervalMs: number;
    retryMaxAttempts: number;
    stopOnRateLimit: boolean;
  } {
    return {
      batchSize: this.readInt("EMAIL_BATCH_SIZE", DEFAULT_BATCH_SIZE),
      batchIntervalMs: this.readInt(
        "EMAIL_BATCH_INTERVAL_MS",
        DEFAULT_BATCH_INTERVAL_MS,
      ),
      sendIntervalMs: this.readInt(
        "EMAIL_SEND_INTERVAL_MS",
        DEFAULT_SEND_INTERVAL_MS,
      ),
      retryMaxAttempts: this.readInt("EMAIL_RETRY_MAX_ATTEMPTS", 5),
      stopOnRateLimit: process.env.EMAIL_STOP_ON_RATE_LIMIT === "true",
    };
  }

  private chunk<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size));
    }

    return chunks;
  }

  private readInt(envName: string, fallback: number): number {
    const value = Number(process.env[envName]);
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    const prefix = local.slice(0, 3).padEnd(Math.min(local.length, 3), "*");
    return `${prefix}***@${domain}`;
  }
}
