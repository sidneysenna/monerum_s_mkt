import { Injectable } from "@nestjs/common";

import { TemplateRendererService } from "../../../emails/infrastructure/templates/template-renderer.service";
import { PreviewCampanhaQueryDto } from "../dto/preview-campanha-query.dto";

const CAMPANHA_ID = "proposta-sindicato-digital";
const PLACEHOLDER_DEFAULTS = {
  VALOR_MENSALIDADE: "200,00",
  VALOR_TAXA: "10",
  CONTATO_WHATSAPP: "5531984791973",
  VENDEDOR_NOME: "SIDNEY SENNA",
  VENDEDOR_CONTATO: "sidney.senna@supremaalgoritmos.com.br",
} as const;

export interface PreviewCampanhaSindicatoDigitalResponse {
  campanha: typeof CAMPANHA_ID;
  subject: string;
  html: string;
  text: string;
  placeholders: Record<string, string>;
}

@Injectable()
export class PreviewCampanhaSindicatoDigitalUseCase {
  constructor(private readonly templateRenderer: TemplateRendererService) {}

  async execute(
    query: PreviewCampanhaQueryDto = {},
  ): Promise<PreviewCampanhaSindicatoDigitalResponse> {
    const placeholders = {
      NOME_SINDICATO: this.withDefault(query.denominacao, "seu sindicato"),
      NOME_PRESIDENTE: this.withDefault(query.nomePresidente, "Presidente"),
      ...PLACEHOLDER_DEFAULTS,
    };
    const template = await this.templateRenderer.render(
      CAMPANHA_ID,
      placeholders,
    );

    return {
      campanha: CAMPANHA_ID,
      subject: template.subject,
      html: template.html,
      text: template.text,
      placeholders,
    };
  }

  private withDefault(value: string | undefined, fallback: string): string {
    return value?.trim() ? value.trim() : fallback;
  }
}
