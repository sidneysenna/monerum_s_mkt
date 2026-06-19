import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { EmailCssInlinerService } from "../../../templates/application/services/email-css-inliner.service";
import { HtmlToTextService } from "../../../templates/application/services/html-to-text.service";
import { TemplateRendererService } from "./template-renderer.service";

describe("TemplateRendererService", () => {
  const formerMonthlyValue = ["200", "00"].join(",");
  const templatePath = join(
    process.cwd(),
    "src",
    "modules",
    "emails",
    "infrastructure",
    "templates",
    "campanhas",
    "proposta-sindicato-digital",
    "template.html",
  );

  it("usa logo externa e nao contem imagem Base64 no template", async () => {
    const template = await readFile(templatePath, "utf8");

    expect(template).not.toContain("data:image/png;base64");
    expect(template).toContain(
      "http://monerum.com.br/asets/logo-suprema.png",
    );
    expect(template.length).toBeLessThan(30_000);
  });

  it("renderiza chaves obrigatorias e extrai TXT do HTML renderizado", async () => {
    const service = new TemplateRendererService(
      new HtmlToTextService(),
      new EmailCssInlinerService(),
    );

    const result = await service.render("proposta-sindicato-digital", {
      NOME_SINDICATO: "SINDICATO TESTE",
      NOME_PRESIDENTE: "JOAO",
      VALOR_MENSALIDADE: "500,00",
      VALOR_TAXA: "10",
      CONTATO_WHATSAPP: "5531984791973",
      VENDEDOR_NOME: "SIDNEY SENNA",
      VENDEDOR_CONTATO: "sidney.senna@supremaalgoritmos.com.br",
    });

    expect(result.subject).toContain("modernizar o atendimento digital");
    expect(result.html).toContain('table role="presentation"');
    expect(result.html).toContain('width="600"');
    expect(result.html).toContain(
      `font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    );
    expect(result.html).toContain(
      `background-color:#001f3f; padding:30px; text-align:center;`,
    );
    expect(result.html).toContain(
      `background-color:#007bff; color:#ffffff; text-decoration:none;`,
    );
    expect(result.html).toContain(
      `background-color:#f4f7f9; padding:30px; text-align:center; font-size:14px;`,
    );
    expect(result.html).not.toContain("data:image/png;base64");
    expect(result.html).toContain(
      "http://monerum.com.br/asets/logo-suprema.png",
    );
    expect(result.html).toContain("<strong>SINDICATO TESTE</strong>");
    expect(result.html).toContain("Presidente JOAO");
    expect(result.html).toContain("R$ 500,00");
    expect(result.html).not.toContain(formerMonthlyValue);
    expect(result.html).toContain("10%");
    expect(result.html).toContain("https://wa.me/5531984791973");
    expect(result.html).toContain("<strong>SIDNEY SENNA</strong>");
    expect(result.html).toContain(
      "Contato: sidney.senna@supremaalgoritmos.com.br",
    );
    expect(result.text).toContain("SINDICATO TESTE");
    expect(result.text).toContain("Presidente JOAO");
    expect(result.text).toContain("R$ 500,00");
    expect(result.text).not.toContain(formerMonthlyValue);
    expect(result.text).not.toContain("{{NOME_SINDICATO}}");
  });
});
