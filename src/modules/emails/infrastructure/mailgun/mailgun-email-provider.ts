import { Injectable } from "@nestjs/common";

import { EnviarEmailDto } from "../../application/dto/enviar-email.dto";
import {
  EmailProvider,
  EmailProviderResult,
} from "../../application/services/email-provider";
import { MailgunClient } from "./mailgun-client";

@Injectable()
export class MailgunEmailProvider implements EmailProvider {
  constructor(private readonly mailgunClient: MailgunClient) {}

  async enviarEmail(email: EnviarEmailDto): Promise<EmailProviderResult> {
    const result = await this.mailgunClient.sendMessage({
      from: email.from,
      to: email.to.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    return {
      providerMessageId: result.id,
      status: "enviado",
    };
  }
}
