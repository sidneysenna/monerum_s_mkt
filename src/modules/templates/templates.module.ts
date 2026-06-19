import { Module } from "@nestjs/common";

import { HtmlToTextService } from "./application/services/html-to-text.service";
import { TemplateRendererService } from "./application/services/template-renderer.service";

@Module({
  providers: [HtmlToTextService, TemplateRendererService],
  exports: [HtmlToTextService, TemplateRendererService],
})
export class TemplatesModule {}
