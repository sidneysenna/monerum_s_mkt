import { CampanhaEmailDestinatarioEntity } from "../entities/campanha-email-destinatario.entity";

export const CAMPANHA_EMAIL_DESTINATARIOS_REPOSITORY = Symbol(
  "CAMPANHA_EMAIL_DESTINATARIOS_REPOSITORY",
);

export interface ListarDestinatariosCampanhaParams {
  campanhaId: string;
  status?: string;
  limit: number;
  offset: number;
}

export interface RegistrarEnvioCampanhaParams {
  campanhaId: string;
  sindicatoId: number;
  email: string;
  status: "enviado" | "falhou";
  mailgunMessageId?: string;
  erro?: string;
}

export interface CampanhaEmailDestinatariosRepository {
  listar(
    params: ListarDestinatariosCampanhaParams,
  ): Promise<CampanhaEmailDestinatarioEntity[]>;
  registrarResultado(
    params: RegistrarEnvioCampanhaParams,
  ): Promise<CampanhaEmailDestinatarioEntity | null>;
}
