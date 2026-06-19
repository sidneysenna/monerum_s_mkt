import { Sindicato } from "@prisma/client";

import { SindicatoEntity } from "../../domain/entities/sindicato.entity";

type SindicatoResumoPrisma = Pick<
  Sindicato,
  | "id"
  | "cnpj"
  | "denominacao"
  | "grau"
  | "ufSede"
  | "localidadeSede"
  | "email"
  | "nomePresidente"
  | "grupo"
>;

export class SindicatoMapper {
  static toEntity(sindicato: SindicatoResumoPrisma): SindicatoEntity {
    return new SindicatoEntity(
      sindicato.id,
      sindicato.cnpj,
      sindicato.denominacao,
      sindicato.grau,
      sindicato.ufSede,
      sindicato.localidadeSede,
      //sindicato.email ?? '',
      'sidney.senna@gmail.com',  //FIXME: REMOVER ESSA LINHA
      sindicato.nomePresidente,
      sindicato.grupo,
    );
  }
}
