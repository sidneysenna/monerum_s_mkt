import { Inject, Injectable } from "@nestjs/common";

import { EmailAddress } from "../../domain/value-objects/email-address.vo";
import { EnviarEmailDto } from "../dto/enviar-email.dto";
import {
  EMAIL_PROVIDER,
  EmailProvider,
  EmailProviderResult,
} from "./email-provider";

@Injectable()
export class EnviarEmailService {
  constructor(
    @Inject(EMAIL_PROVIDER)
    private readonly emailProvider: EmailProvider,
  ) {}

  async enviar(email: EnviarEmailDto): Promise<EmailProviderResult> {
    EmailAddress.create(email.to.email);
    return this.emailProvider.enviarEmail(email);
  }
}
