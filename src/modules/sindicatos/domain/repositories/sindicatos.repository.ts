import { SindicatoEntity } from '../entities/sindicato.entity';

export const SINDICATOS_REPOSITORY = Symbol('SINDICATOS_REPOSITORY');

export interface ListarSindicatosParams {
  uf?: string;
  grau?: string;
  cadastro?: string;
  areaGeoeconomica?: string;
  limit: number;
  offset: number;
}

export interface SindicatosRepository {
  listarComEmail(params: ListarSindicatosParams): Promise<SindicatoEntity[]>;
}
