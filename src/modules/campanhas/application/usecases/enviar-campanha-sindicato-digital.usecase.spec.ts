import { SindicatoEntity } from "../../../sindicatos/domain/entities/sindicato.entity";
import { CampanhaEmailEntity } from "../../domain/entities/campanha-email.entity";
import { EnviarCampanhaSindicatoDigitalUseCase } from "./enviar-campanha-sindicato-digital.usecase";

class FakeCampanhasRepository {
  campanha = new CampanhaEmailEntity(
    "campanha-id",
    "CAMPANHA_001",
    "consciencia-problema-apresentando-monerum-s",
    "CAMPANHA 001 - Consciência do problema e apresentando Monerum-S",
    "proposta-sindicato-digital",
    "ativa",
    1000,
  );
  resumo = {
    totalEnviados: 0,
    enviadosHoje: 0,
    vagasRestantesHoje: 1000,
    totalFalhas: 0,
  };
  params?: unknown;
  sindicatos = [
    new SindicatoEntity(
      123,
      "00.000.000/0000-00",
      "Sindicato exemplo",
      "Sindicato",
      "MG",
      "Belo Horizonte",
      "contato@example.com",
      "Nome",
      "Trabalhador",
    ),
  ];

  async garantirCampanhaInicial(): Promise<CampanhaEmailEntity> {
    return this.campanha;
  }

  async obterResumo(): Promise<typeof this.resumo> {
    return this.resumo;
  }

  async listarElegiveis(params: unknown): Promise<SindicatoEntity[]> {
    this.params = params;
    return this.sindicatos;
  }
}

describe("EnviarCampanhaSindicatoDigitalUseCase", () => {
  const originalEnv = process.env;
  const retrySuccess = {
    execute: jest.fn(async (operation: () => Promise<unknown>) => ({
      ok: true,
      value: await operation(),
      attempts: 1,
      rateLimit: false,
    })),
  };

  afterEach(() => {
    process.env = originalEnv;
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("bloqueia envio real por padrao e nao chama Mailgun nem grava enviado", async () => {
    process.env = { ...originalEnv };
    const campanhasRepository = new FakeCampanhasRepository();
    const destinatariosRepository = {
      registrarResultado: jest.fn(),
    };
    const enviarEmailService = {
      enviar: jest.fn(),
    };
    const templateRenderer = {
      render: jest.fn(),
      validateNoUnresolvedPlaceholders: jest.fn(),
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      destinatariosRepository as never,
      templateRenderer as never,
      enviarEmailService as never,
      retrySuccess as never,
    );

    const result = await useCase.execute({});

    expect(result.campanha.codigo).toBe("CAMPANHA_001");
    expect(result.dryRun).toBe(true);
    expect(result.envioRealExecutado).toBe(false);
    if (result.dryRun === true) {
      expect(result.placeholders).toEqual({
        VALOR_MENSALIDADE: "500,00",
        VALOR_TAXA: "10",
        CONTATO_WHATSAPP: "5531984791973",
        VENDEDOR_NOME: "SIDNEY SENNA",
        VENDEDOR_CONTATO: "sidney.senna@supremaalgoritmos.com.br",
      });
    }
    expect(enviarEmailService.enviar).not.toHaveBeenCalled();
    expect(templateRenderer.render).not.toHaveBeenCalled();
    expect(destinatariosRepository.registrarResultado).not.toHaveBeenCalled();
  });

  it("respeita limite diario de 1000 e limita a vagas restantes", async () => {
    const campanhasRepository = new FakeCampanhasRepository();
    campanhasRepository.resumo = {
      totalEnviados: 250,
      enviadosHoje: 37,
      vagasRestantesHoje: 63,
      totalFalhas: 0,
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      { registrarResultado: jest.fn() } as never,
      {} as never,
      { enviar: jest.fn() } as never,
      retrySuccess as never,
    );

    await useCase.execute({ limit: 1000 });

    expect(campanhasRepository.params).toEqual(
      expect.objectContaining({
        campanhaCodigo: "CAMPANHA_001",
        limit: 63,
      }),
    );
  });

  it("nao seleciona destinatarios quando limite diario foi atingido", async () => {
    const campanhasRepository = new FakeCampanhasRepository();
    campanhasRepository.resumo = {
      totalEnviados: 1000,
      enviadosHoje: 1000,
      vagasRestantesHoje: 0,
      totalFalhas: 0,
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      { registrarResultado: jest.fn() } as never,
      {} as never,
      { enviar: jest.fn() } as never,
      retrySuccess as never,
    );

    const result = await useCase.execute({ limit: 1000 });

    expect(result.dryRun).toBe(true);
    if (result.dryRun) {
      expect(result.motivo).toBe("limite_diario_atingido");
      expect(result.destinatariosElegiveis).toBe(0);
    }
    expect(campanhasRepository.params).toBeUndefined();
  });

  it("renderiza cada destinatario separadamente e grava status enviado", async () => {
    process.env = {
      ...originalEnv,
      EMAIL_SENDING_ENABLED: "true",
      EMAIL_DRY_RUN: "false",
      MAILGUN_FROM_EMAIL: "nao-responder@example.com",
      EMAIL_SEND_INTERVAL_MS: "1",
    };
    const campanhasRepository = new FakeCampanhasRepository();
    campanhasRepository.sindicatos = [
      new SindicatoEntity(
        1,
        null,
        "Sindicato A",
        null,
        "MG",
        "Belo Horizonte",
        "a@example.com",
        "Maria",
        "Trabalhador",
      ),
      new SindicatoEntity(
        2,
        null,
        "Sindicato B",
        null,
        "SP",
        "Sao Paulo",
        "b@example.com",
        "Jose",
        "Trabalhador",
      ),
    ];
    const templateRenderer = {
      render: jest.fn(async (_campanhaId, placeholders) => ({
        subject: "Assunto",
        html: `<p>${placeholders.NOME_SINDICATO}</p>`,
        text: placeholders.NOME_PRESIDENTE,
      })),
      validateNoUnresolvedPlaceholders: jest.fn(),
    };
    const enviarEmailService = {
      enviar: jest.fn(async () => ({ providerMessageId: "mg-id" })),
    };
    const destinatariosRepository = {
      registrarResultado: jest.fn(async () => ({ id: "registro-id" })),
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      destinatariosRepository as never,
      templateRenderer as never,
      enviarEmailService as never,
      retrySuccess as never,
    );

    await useCase.execute({ dryRun: false, confirmacao: "ENVIAR", limit: 2 });

    expect(templateRenderer.render).toHaveBeenCalledTimes(2);
    expect(templateRenderer.render).toHaveBeenNthCalledWith(
      1,
      "proposta-sindicato-digital",
      expect.objectContaining({
        NOME_SINDICATO: "Sindicato A",
        NOME_PRESIDENTE: "Maria",
        VALOR_MENSALIDADE: "500,00",
        VALOR_TAXA: "10",
      }),
    );
    expect(destinatariosRepository.registrarResultado).toHaveBeenCalledWith(
      expect.objectContaining({
        campanhaId: "campanha-id",
        sindicatoId: 1,
        status: "enviado",
        mailgunMessageId: "mg-id",
      }),
    );
    expect(enviarEmailService.enviar).toHaveBeenCalledTimes(2);
  });

  it("grava falha quando Mailgun falha", async () => {
    process.env = {
      ...originalEnv,
      EMAIL_SENDING_ENABLED: "true",
      EMAIL_DRY_RUN: "false",
      MAILGUN_FROM_EMAIL: "nao-responder@example.com",
      EMAIL_SEND_INTERVAL_MS: "1",
    };
    const campanhasRepository = new FakeCampanhasRepository();
    const destinatariosRepository = {
      registrarResultado: jest.fn(async () => ({ id: "registro-id" })),
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      destinatariosRepository as never,
      {
        render: jest.fn(async () => ({
          subject: "Assunto",
          html: "<p>ok</p>",
          text: "ok",
        })),
        validateNoUnresolvedPlaceholders: jest.fn(),
      } as never,
      { enviar: jest.fn() } as never,
      {
        execute: jest.fn(async () => ({
          ok: false,
          error: new Error("Mailgun indisponivel"),
          attempts: 1,
          rateLimit: false,
          sanitizedError: "falha_envio_email",
        })),
      } as never,
    );

    const result = await useCase.execute({
      dryRun: false,
      confirmacao: "ENVIAR",
    });

    expect(destinatariosRepository.registrarResultado).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "falhou",
      }),
    );
    expect(result.dryRun).toBe(false);
    if (result.dryRun === false) {
      expect(result.totalFalhas).toBe(1);
    }
  });

  it("aceita limit 1000 e limita por EMAIL_MAX_REQUEST_LIMIT quando configurado", async () => {
    process.env = {
      ...originalEnv,
      EMAIL_MAX_REQUEST_LIMIT: "50",
    };
    const campanhasRepository = new FakeCampanhasRepository();
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      { registrarResultado: jest.fn() } as never,
      {} as never,
      { enviar: jest.fn() } as never,
      retrySuccess as never,
    );

    const result = await useCase.execute({ limit: 1000 });

    expect(campanhasRepository.params).toEqual(
      expect.objectContaining({ limit: 50 }),
    );
    expect(result.limiteSolicitado).toBe(1000);
    expect(result.limiteEfetivo).toBe(50);
  });

  it("dry-run nao aplica delay e nao chama Mailgun", async () => {
    jest.useFakeTimers();
    process.env = {
      ...originalEnv,
      EMAIL_SEND_INTERVAL_MS: "7000",
      EMAIL_BATCH_INTERVAL_MS: "60000",
    };
    const campanhasRepository = new FakeCampanhasRepository();
    campanhasRepository.sindicatos = [
      campanhasRepository.sindicatos[0],
      new SindicatoEntity(
        456,
        null,
        "Sindicato B",
        null,
        "SP",
        "Sao Paulo",
        "b@example.com",
        "Jose",
        "Trabalhador",
      ),
    ];
    const enviarEmailService = { enviar: jest.fn() };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      { registrarResultado: jest.fn() } as never,
      {
        render: jest.fn(),
        validateNoUnresolvedPlaceholders: jest.fn(),
      } as never,
      enviarEmailService as never,
      retrySuccess as never,
    );

    await useCase.execute({ limit: 2 });

    expect(jest.getTimerCount()).toBe(0);
    expect(enviarEmailService.enviar).not.toHaveBeenCalled();
  });

  it("envio real aplica delay entre destinatarios e pausa entre lotes", async () => {
    jest.useFakeTimers();
    process.env = {
      ...originalEnv,
      EMAIL_SENDING_ENABLED: "true",
      EMAIL_DRY_RUN: "false",
      MAILGUN_FROM_EMAIL: "nao-responder@example.com",
      EMAIL_SEND_INTERVAL_MS: "100",
      EMAIL_BATCH_SIZE: "2",
      EMAIL_BATCH_INTERVAL_MS: "500",
    };
    const campanhasRepository = new FakeCampanhasRepository();
    campanhasRepository.sindicatos = [1, 2, 3].map(
      (id) =>
        new SindicatoEntity(
          id,
          null,
          `Sindicato ${id}`,
          null,
          "MG",
          "Belo Horizonte",
          `${id}@example.com`,
          "Nome",
          "Trabalhador",
        ),
    );
    const enviarEmailService = {
      enviar: jest.fn(async () => ({ providerMessageId: "mg-id" })),
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      {
        registrarResultado: jest.fn(async () => ({ id: "registro-id" })),
      } as never,
      {
        render: jest.fn(async () => ({
          subject: "Assunto",
          html: "<p>ok</p>",
          text: "ok",
        })),
        validateNoUnresolvedPlaceholders: jest.fn(),
      } as never,
      enviarEmailService as never,
      retrySuccess as never,
    );

    const promise = useCase.execute({
      dryRun: false,
      confirmacao: "ENVIAR",
      limit: 3,
    });

    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(100);
    await jest.advanceTimersByTimeAsync(500);
    const result = await promise;

    expect(enviarEmailService.enviar).toHaveBeenCalledTimes(3);
    expect(result.dryRun).toBe(false);
    if (result.dryRun === false) {
      expect(result.totalEnviados).toBe(3);
    }
  });

  it("continua campanha apos falha individual", async () => {
    process.env = {
      ...originalEnv,
      EMAIL_SENDING_ENABLED: "true",
      EMAIL_DRY_RUN: "false",
      MAILGUN_FROM_EMAIL: "nao-responder@example.com",
      EMAIL_SEND_INTERVAL_MS: "1",
    };
    const campanhasRepository = new FakeCampanhasRepository();
    campanhasRepository.sindicatos = [1, 2].map(
      (id) =>
        new SindicatoEntity(
          id,
          null,
          `Sindicato ${id}`,
          null,
          "MG",
          "Belo Horizonte",
          `${id}@example.com`,
          "Nome",
          "Trabalhador",
        ),
    );
    const retry = {
      execute: jest
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          attempts: 5,
          rateLimit: true,
          sanitizedError: "rate_limit_429",
        })
        .mockImplementationOnce(async (operation: () => Promise<unknown>) => ({
          ok: true,
          value: await operation(),
          attempts: 1,
          rateLimit: false,
        })),
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      campanhasRepository as never,
      {
        registrarResultado: jest.fn(async () => ({ id: "registro-id" })),
      } as never,
      {
        render: jest.fn(async () => ({
          subject: "Assunto",
          html: "<p>ok</p>",
          text: "ok",
        })),
        validateNoUnresolvedPlaceholders: jest.fn(),
      } as never,
      {
        enviar: jest.fn(async () => ({ providerMessageId: "mg-id" })),
      } as never,
      retry as never,
    );

    const result = await useCase.execute({
      dryRun: false,
      confirmacao: "ENVIAR",
      limit: 2,
    });

    expect(result.dryRun).toBe(false);
    if (result.dryRun === false) {
      expect(result.totalFalhas).toBe(1);
      expect(result.totalEnviados).toBe(1);
      expect(result.totalRateLimit).toBe(1);
    }
  });

  it("marca ja_enviado quando repository retorna duplicidade", async () => {
    process.env = {
      ...originalEnv,
      EMAIL_SENDING_ENABLED: "true",
      EMAIL_DRY_RUN: "false",
      MAILGUN_FROM_EMAIL: "nao-responder@example.com",
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      new FakeCampanhasRepository() as never,
      { registrarResultado: jest.fn(async () => null) } as never,
      {
        render: jest.fn(async () => ({
          subject: "Assunto",
          html: "<p>ok</p>",
          text: "ok",
        })),
        validateNoUnresolvedPlaceholders: jest.fn(),
      } as never,
      {
        enviar: jest.fn(async () => ({ providerMessageId: "mg-id" })),
      } as never,
      retrySuccess as never,
    );

    const result = await useCase.execute({
      dryRun: false,
      confirmacao: "ENVIAR",
      includeResults: true,
    });

    expect(result.dryRun).toBe(false);
    if (result.dryRun === false) {
      expect(result.resultados[0].status).toBe("ja_enviado");
    }
  });
});
