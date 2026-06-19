import { EmailDestinatarioDto } from "./email-destinatario.dto";

export class EnviarEmailDto {
  from!: string;
  to!: EmailDestinatarioDto;
  subject!: string;
  text!: string;
  html!: string;
}
