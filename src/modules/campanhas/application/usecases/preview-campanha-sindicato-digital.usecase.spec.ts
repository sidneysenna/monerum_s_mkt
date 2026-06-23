import { EmailCssInlinerService } from "../../../templates/application/services/email-css-inliner.service";
import { HtmlToTextService } from "../../../templates/application/services/html-to-text.service";
import { TemplateRendererService } from "../../../emails/infrastructure/templates/template-renderer.service";
import { PreviewCampanhaSindicatoDigitalUseCase } from "./preview-campanha-sindicato-digital.usecase";

describe("PreviewCampanhaSindicatoDigitalUseCase", () => {
  const formerMonthlyValue = ["200", "00"].join(",");

  it("retorna HTML, TXT e placeholders renderizados da campanha", async () => {
    const useCase = new PreviewCampanhaSindicatoDigitalUseCase(
      new TemplateRendererService(
        new HtmlToTextService(),
        new EmailCssInlinerService(),
      ),
    );

    const result = await useCase.execute({
      denominacao: "SINDICATO TESTE",
      nomePresidente: "JOAO",
    });

    expect(result.campanha).toBe("proposta-sindicato-digital");
    expect(result.html).toContain("Presidente JOAO");
    expect(result.html).toContain(
      `font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    );
    expect(result.html).toContain("R$ 500,00");
    expect(result.html).not.toContain(formerMonthlyValue);
    expect(result.text).toContain("Presidente JOAO");
    expect(result.text).toContain("R$ 500,00");
    expect(result.text).not.toContain(formerMonthlyValue);
    expect(result.placeholders).toEqual({
      NOME_SINDICATO: "SINDICATO TESTE",
      NOME_PRESIDENTE: "JOAO",
      VALOR_MENSALIDADE: "500,00",
      VALOR_TAXA: "10",
      CONTATO_WHATSAPP: "5531984791973",
      VENDEDOR_NOME: "SIDNEY SENNA",
      VENDEDOR_CONTATO: "sidney.senna@supremaalgoritmos.com.br",
    });
  });
});
