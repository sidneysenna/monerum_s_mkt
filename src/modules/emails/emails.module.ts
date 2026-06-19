import { Module } from "@nestjs/common";

import { HtmlToTextService } from "../templates/application/services/html-to-text.service";
import { EnviarEmailService } from "./application/services/enviar-email.service";
import { EMAIL_PROVIDER } from "./application/services/email-provider";
import { MailgunClient } from "./infrastructure/mailgun/mailgun-client";
import { MailgunEmailProvider } from "./infrastructure/mailgun/mailgun-email-provider";
import { TemplateRendererService } from "./infrastructure/templates/template-renderer.service";

@Module({
  providers: [
    EnviarEmailService,
    HtmlToTextService,
    MailgunClient,
    TemplateRendererService,
    {
      provide: EMAIL_PROVIDER,
      useClass: MailgunEmailProvider,
    },
  ],
  exports: [EnviarEmailService, TemplateRendererService],
})
export class EmailsModule {}
