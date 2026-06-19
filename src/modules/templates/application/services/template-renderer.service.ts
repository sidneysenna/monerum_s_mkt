import { Injectable } from "@nestjs/common";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { HtmlToTextService } from "./html-to-text.service";

interface TemplateMetadata {
  id: string;
  nome: string;
  assunto: string;
  versao: number;
}

export interface RenderedTemplate {
  html: string;
  text: string;
  subject: string;
}

@Injectable()
export class TemplateRendererService {
  constructor(private readonly htmlToTextService: HtmlToTextService) {}

  async render(
    campanhaId: string,
    variaveis: Record<string, string> = {},
  ): Promise<RenderedTemplate> {
    const basePath = join(
      process.cwd(),
      "src",
      "modules",
      "emails",
      "infrastructure",
      "templates",
      "campanhas",
      campanhaId,
    );

    const [html, metadataRaw] = await Promise.all([
      readFile(join(basePath, "template.html"), "utf8"),
      readFile(join(basePath, "metadata.json"), "utf8"),
    ]).catch(() => {
      throw new Error(`Template nao encontrado: ${campanhaId}.`);
    });

    const metadata = JSON.parse(metadataRaw) as TemplateMetadata;
    const renderedHtml = this.replaceVariables(html, variaveis);

    //console.log('html:',renderedHtml);

    return {
      html: renderedHtml,
      text: this.htmlToTextService.convert(renderedHtml),
      subject: this.replaceVariables(metadata.assunto, variaveis),
    };
  }

  validateNoUnresolvedPlaceholders(
    rendered: Pick<RenderedTemplate, "html" | "text">,
    requiredKeys: string[],
  ): void {
    const unresolved = requiredKeys.filter(
      (key) => rendered.html.includes(key) || rendered.text.includes(key),
    );

    if (unresolved.length > 0) {
      throw new Error(
        `Template renderizado contem placeholders obrigatorios nao preenchidos: ${unresolved.join(
          ", ",
        )}.`,
      );
    }
  }

  private replaceVariables(
    content: string,
    variaveis: Record<string, string>,
  ): string {
    return Object.entries(variaveis).reduce((current, [key, value]) => {
      const escaped = this.escapeValue(value);
      return this.replaceExistingPlaceholderFormats(current, key, escaped);
    }, content);
  }

  private replaceExistingPlaceholderFormats(
    content: string,
    key: string,
    value: string,
  ): string {
    return [`{{${key}}}`, `[${key}]`, key].reduce(
      (current, placeholder) =>
        current.includes(placeholder)
          ? current.replaceAll(placeholder, value)
          : current,
      content,
    );
  }

  private escapeValue(value: string): string {
    return value.replace(/[<>&"']/g, (char) => {
      const entities: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
      };
      return entities[char] ?? char;
    });
  }
}
