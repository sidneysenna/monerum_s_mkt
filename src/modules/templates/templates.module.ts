import { Module } from "@nestjs/common";

import { EmailCssInlinerService } from "./application/services/email-css-inliner.service";
import { HtmlToTextService } from "./application/services/html-to-text.service";
import { TemplateRendererService } from "./application/services/template-renderer.service";

@Module({
  providers: [EmailCssInlinerService, HtmlToTextService, TemplateRendererService],
  exports: [EmailCssInlinerService, HtmlToTextService, TemplateRendererService],
})
export class TemplatesModule {}
