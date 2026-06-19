import { EnviarEmailDto } from "../dto/enviar-email.dto";

export const EMAIL_PROVIDER = Symbol("EMAIL_PROVIDER");

export interface EmailProviderResult {
  providerMessageId?: string;
  status: "enviado";
}

export interface EmailProvider {
  enviarEmail(email: EnviarEmailDto): Promise<EmailProviderResult>;
}
