import { SindicatoEntity } from "../../../sindicatos/domain/entities/sindicato.entity";
import {
  ListarSindicatosParams,
  SindicatosRepository,
} from "../../../sindicatos/domain/repositories/sindicatos.repository";
import { EnviarCampanhaSindicatoDigitalUseCase } from "./enviar-campanha-sindicato-digital.usecase";

class FakeSindicatosRepository implements SindicatosRepository {
  params?: ListarSindicatosParams;
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

  async listarComEmail(
    params: ListarSindicatosParams,
  ): Promise<SindicatoEntity[]> {
    this.params = params;
    return this.sindicatos;
  }
}

describe("EnviarCampanhaSindicatoDigitalUseCase", () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
  });

  it("bloqueia envio real por padrao e nao chama Mailgun", async () => {
    process.env = { ...originalEnv };
    const repository = new FakeSindicatosRepository();
    const enviarEmailService = {
      enviar: jest.fn(),
    };
    const templateRenderer = {
      render: jest.fn(),
      validateNoUnresolvedPlaceholders: jest.fn(),
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      repository,
      templateRenderer as never,
      enviarEmailService as never,
    );

    const result = await useCase.execute({});

    expect(result.dryRun).toBe(true);
    expect(result.envioRealExecutado).toBe(false);
    expect(enviarEmailService.enviar).not.toHaveBeenCalled();
    expect(templateRenderer.render).not.toHaveBeenCalled();
  });

  it("limita limit a no maximo 10 no envio controlado", async () => {
    const repository = new FakeSindicatosRepository();
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      repository,
      {} as never,
      { enviar: jest.fn() } as never,
    );

    await useCase.execute({ limit: 50 });

    expect(repository.params?.limit).toBe(10);
  });

  it("renderiza cada destinatario separadamente antes do envio real", async () => {
    process.env = {
      ...originalEnv,
      EMAIL_SENDING_ENABLED: "true",
      EMAIL_DRY_RUN: "false",
      MAILGUN_FROM_EMAIL: "nao-responder@example.com",
    };
    const repository = new FakeSindicatosRepository();
    repository.sindicatos = [
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
      enviar: jest.fn(),
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      repository,
      templateRenderer as never,
      enviarEmailService as never,
    );

    await useCase.execute({ dryRun: false, confirmacao: "ENVIAR", limit: 2 });

    expect(templateRenderer.render).toHaveBeenCalledTimes(2);
    expect(templateRenderer.render).toHaveBeenNthCalledWith(
      1,
      "proposta-sindicato-digital",
      expect.objectContaining({
        NOME_SINDICATO: "Sindicato A",
        NOME_PRESIDENTE: "Maria",
        VALOR_MENSALIDADE: "200,00",
        VALOR_TAXA: "10",
        CONTATO_WHATSAPP: "5531984791973",
        VENDEDOR_NOME: "SIDNEY SENNA",
        VENDEDOR_CONTATO: "sidney.senna@supremaalgoritmos.com.br",
      }),
    );
    expect(templateRenderer.render).toHaveBeenNthCalledWith(
      2,
      "proposta-sindicato-digital",
      expect.objectContaining({
        NOME_SINDICATO: "Sindicato B",
        NOME_PRESIDENTE: "Jose",
      }),
    );
    expect(enviarEmailService.enviar).toHaveBeenCalledTimes(2);
  });

  it("nao envia destinatario quando sobra placeholder obrigatorio", async () => {
    process.env = {
      ...originalEnv,
      EMAIL_SENDING_ENABLED: "true",
      EMAIL_DRY_RUN: "false",
      MAILGUN_FROM_EMAIL: "nao-responder@example.com",
    };
    const repository = new FakeSindicatosRepository();
    const templateRenderer = {
      render: jest.fn(async () => ({
        subject: "Assunto",
        html: "{{NOME_SINDICATO}}",
        text: "{{NOME_SINDICATO}}",
      })),
      validateNoUnresolvedPlaceholders: jest.fn(() => {
        throw new Error(
          "Template renderizado contem placeholders obrigatorios nao preenchidos: NOME_SINDICATO.",
        );
      }),
    };
    const enviarEmailService = {
      enviar: jest.fn(),
    };
    const useCase = new EnviarCampanhaSindicatoDigitalUseCase(
      repository,
      templateRenderer as never,
      enviarEmailService as never,
    );

    const result = await useCase.execute({
      dryRun: false,
      confirmacao: "ENVIAR",
    });

    expect(enviarEmailService.enviar).not.toHaveBeenCalled();
    expect(result.dryRun).toBe(false);
    if (result.dryRun === false) {
      expect(result.totalFalhas).toBe(1);
    }
  });
});
