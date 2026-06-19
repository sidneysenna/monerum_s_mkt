import { SindicatoEntity } from "../../../sindicatos/domain/entities/sindicato.entity";
import { CampanhaEmailEntity } from "../entities/campanha-email.entity";

export const CAMPANHAS_EMAIL_REPOSITORY = Symbol(
  "CAMPANHAS_EMAIL_REPOSITORY",
);

export interface ListarElegiveisCampanhaParams {
  campanhaCodigo: string;
  uf?: string;
  grau?: string;
  cadastro?: string;
  areaGeoeconomica?: string;
  limit: number;
  offset: number;
}

export interface ResumoCampanhaEmail {
  totalEnviados: number;
  enviadosHoje: number;
  vagasRestantesHoje: number;
  totalFalhas: number;
}

export interface CampanhasEmailRepository {
  obterPorCodigo(codigo: string): Promise<CampanhaEmailEntity | null>;
  garantirCampanhaInicial(): Promise<CampanhaEmailEntity>;
  obterResumo(campanha: CampanhaEmailEntity): Promise<ResumoCampanhaEmail>;
  listarElegiveis(
    params: ListarElegiveisCampanhaParams,
  ): Promise<SindicatoEntity[]>;
}
